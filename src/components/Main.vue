<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { WebMidi, type Output, type Input } from 'webmidi'
import Knob from './Knob.vue'
import StoreButton from './StoreButton.vue'
import Keyboard from './Keyboard.vue'
import { params, types, midiChannelOptions } from '@/lib/params'
import { storageAvailable } from '@/lib/utils'
import type {
  PatchData,
  PatchSectionKey,
  DeviceConnectionStatus,
  MidiChannel
} from '@/types/components'

// Reactive state
const holdSwitch = ref<boolean>(true) // Keyboard hold toggle switch
const arpSwitch = ref<boolean>(false) // Arppegiator toggle switch
const octave = ref<number>(0) // Octave value
const tab = ref<string>('knobs') // Global tab
const outputs = ref<Output[]>([]) // MIDI devices
const outputId = ref<string | null>(null)
const inputs = ref<Input[]>([])
const outputMidiChannel = ref<MidiChannel>('all') // Selected MIDI channel
const patches = ref<PatchData[]>([]) // 10 Patch data
const heldNotes = ref<number[]>([]) // Currently held notes

// Error handling state
const midiEnabled = ref<boolean>(false) // WebMIDI API availability status
const midiError = ref<string | null>(null) // Current MIDI error message
const deviceConnectionStatus = ref<DeviceConnectionStatus>('disconnected') // Device connection status
const showErrorNotification = ref<boolean>(false) // Error notification visibility
const errorMessage = ref<string>('') // Current error message for user

// Temporary patch data
const tmpPatch = reactive<PatchData>({
  osc: {
    type: { value: 0, label: 'Sawtooth' },
    shape: 1,
    alt: 1,
    rate: 1,
    depth: 1
  },
  filter: {
    type: { value: 0, label: 'Low Pass 2' },
    cutoff: 1,
    res: 1,
    rate: 1,
    depth: 1
  },
  eg: {
    type: { value: 0, label: 'ADSR' },
    attack: 1,
    release: 1,
    rate: 1,
    depth: 1
  },
  mod: {
    type: { value: 0, label: 'Off' },
    time: 1,
    depth: 1
  },
  delay: {
    type: { value: 0, label: 'Off' },
    time: 1,
    depth: 1,
    mix: 1
  },
  reverb: {
    type: { value: 0, label: 'Off' },
    time: 1,
    depth: 1,
    mix: 1
  },
  arp: {
    type: { value: 0, label: 'Up' },
    scale: { value: 0, label: 'Octave' },
    length: 127
  }
})

// Error handling methods
const showError = (message: string): void => {
  errorMessage.value = message
  showErrorNotification.value = true
  console.error('NTS-1 Controller Error:', message)
}

const hideError = (): void => {
  showErrorNotification.value = false
  errorMessage.value = ''
}

const checkWebMidiSupport = (): boolean => {
  if (!navigator.requestMIDIAccess) {
    showError('Web MIDI API is not supported in this browser. Please use Chrome, Firefox, or Edge.')
    return false
  }
  return true
}

const handleMidiError = (err: Error): void => {
  midiEnabled.value = false
  midiError.value = err.message
  let userMessage = 'MIDI initialization failed. '

  if (err.message.includes('NotAllowedError') || err.message.includes('permission')) {
    userMessage += 'Please allow MIDI access in your browser settings and refresh the page.'
  } else if (err.message.includes('NotSupportedError')) {
    userMessage += 'Web MIDI is not supported in this browser.'
  } else {
    userMessage += 'Please check your MIDI device connection and refresh the page.'
  }

  showError(userMessage)
}

const updateDeviceConnectionStatus = (): void => {
  if (!midiEnabled.value) {
    deviceConnectionStatus.value = 'midi_unavailable'
    return
  }

  if (outputs.value.length === 0) {
    deviceConnectionStatus.value = 'no_devices'
    showError('No MIDI output devices found. Please connect your NTS-1 and refresh the page.')
  } else if (!outputId.value) {
    deviceConnectionStatus.value = 'device_not_selected'
  } else {
    const selectedDevice = WebMidi.getOutputById(outputId.value)
    if (selectedDevice && selectedDevice.state === 'connected') {
      deviceConnectionStatus.value = 'connected'
      hideError() // Clear any previous device errors
    } else {
      deviceConnectionStatus.value = 'disconnected'
      showError('Selected MIDI device is disconnected. Please check your connection.')
    }
  }
}

// Safe MIDI operations with error handling
const safeMidiOperation = (operation: () => void, errorContext: string): void => {
  try {
    if (!midiEnabled.value) {
      showError('MIDI is not available. Please refresh the page and allow MIDI access.')
      return
    }
    operation()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    showError(`${errorContext}: ${errorMsg}`)
  }
}

// Methods
const handleOctave = (val: number): void => {
  octave.value = val
}

const noteOn = (noteNum: number): void => {
  safeMidiOperation(() => {
    if (!outputId.value) {
      showError('No MIDI device selected. Please select a device first.')
      return
    }
    const outputDevice = WebMidi.getOutputById(outputId.value)
    if (!outputDevice) {
      showError('Selected MIDI device is not available.')
      return
    }
    if (outputDevice.state !== 'connected') {
      showError('MIDI device is disconnected. Please check your connection.')
      return
    }

    const channels =
      outputMidiChannel.value === 'all' ? undefined : parseInt(outputMidiChannel.value) || 1
    outputDevice.playNote(noteNum, { channels })
    if (holdSwitch.value && !heldNotes.value.includes(noteNum)) {
      heldNotes.value.push(noteNum)
    }
  }, 'Note On')
}

const noteOff = (noteNum?: number): void => {
  safeMidiOperation(() => {
    if (!outputId.value) return
    const outputDevice = WebMidi.getOutputById(outputId.value)
    if (!outputDevice) return
    if (outputDevice.state !== 'connected') {
      showError('MIDI device is disconnected. Please check your connection.')
      return
    }

    if (holdSwitch.value) {
      return
    }
    const channels =
      outputMidiChannel.value === 'all' ? undefined : parseInt(outputMidiChannel.value) || 1
    if (noteNum !== undefined) {
      outputDevice.stopNote(noteNum, { channels })
    } else {
      for (let i = 0; i < 128; i++) {
        outputDevice.stopNote(i, { channels })
      }
    }
  }, 'Note Off')
}

const clearHeldNotes = (): void => {
  safeMidiOperation(() => {
    if (!outputId.value) return
    const outputDevice = WebMidi.getOutputById(outputId.value)
    if (!outputDevice) return
    if (outputDevice.state !== 'connected') {
      showError('MIDI device is disconnected. Please check your connection.')
      return
    }

    const channels =
      outputMidiChannel.value === 'all' ? undefined : parseInt(outputMidiChannel.value) || 1
    heldNotes.value.forEach(noteNum => {
      outputDevice.stopNote(noteNum, { channels })
    })
    heldNotes.value = []
  }, 'Clear Held Notes')
}

const handleControlChange = (cc: number, val: number): void => {
  console.log('cc:', cc)
  console.log('value:', val)
  safeMidiOperation(() => {
    if (!outputId.value) {
      showError('No MIDI device selected. Please select a device first.')
      return
    }
    const outputDevice = WebMidi.getOutputById(outputId.value)
    if (!outputDevice) {
      showError('Selected MIDI device is not available.')
      return
    }
    if (outputDevice.state !== 'connected') {
      showError('MIDI device is disconnected. Please check your connection.')
      return
    }

    const channels =
      outputMidiChannel.value === 'all' ? undefined : parseInt(outputMidiChannel.value) || 1
    outputDevice.sendControlChange(cc, val, { channels })
  }, 'Control Change')
}

// Safe localStorage operations with error handling
const safeLocalStorageOperation = (operation: () => void, errorContext: string): void => {
  try {
    if (!storageAvailable()) {
      showError('Local storage is not available. Patch data cannot be saved.')
      return
    }
    operation()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown storage error'
    showError(`${errorContext}: ${errorMsg}`)
    console.error('LocalStorage error:', error)
  }
}

const initStorage = (): void => {
  safeLocalStorageOperation(() => {
    const existingPatches = localStorage.getItem('patches')
    if (existingPatches) {
      try {
        const parsedPatches = JSON.parse(existingPatches) as PatchData[]
        // Validate parsed data structure
        if (Array.isArray(parsedPatches) && parsedPatches.length > 0) {
          patches.value = parsedPatches
          return
        }
      } catch (parseError) {
        console.warn('Invalid patch data in localStorage, reinitializing:', parseError)
        localStorage.removeItem('patches')
      }
    }

    // Initialize with empty patches array
    patches.value = Array(8)
      .fill(null)
      .map(() => ({ ...tmpPatch }))
    localStorage.setItem('patches', JSON.stringify(patches.value))
  }, 'Storage initialization failed')

  // Fallback: always ensure patches array exists
  if (!patches.value || patches.value.length === 0) {
    patches.value = Array(8)
      .fill(null)
      .map(() => ({ ...tmpPatch }))
  }
}

const handleSavePatch = (n: number): void => {
  if (n < 0 || n >= patches.value.length) {
    showError(`Invalid patch slot: ${n}. Please select a valid slot.`)
    return
  }

  safeLocalStorageOperation(
    () => {
      patches.value[n] = JSON.parse(JSON.stringify(tmpPatch))
      localStorage.setItem('patches', JSON.stringify(patches.value))
      console.log(`Patch saved to slot ${n + 1}`)
    },
    `Failed to save patch to slot ${n + 1}`
  )
}

const handleLoadPatch = (n: number): void => {
  if (n < 0 || n >= patches.value.length) {
    showError(`Invalid patch slot: ${n}. Please select a valid slot.`)
    return
  }

  safeLocalStorageOperation(
    () => {
      const patchesData = localStorage.getItem('patches')
      if (patchesData) {
        try {
          const stores = JSON.parse(patchesData) as PatchData[]
          if (stores[n] && typeof stores[n] === 'object') {
            Object.assign(tmpPatch, stores[n])
            sendPatch()
            console.log(`Patch loaded from slot ${n + 1}`)
          } else {
            showError(`Patch slot ${n + 1} is empty.`)
          }
        } catch (parseError) {
          showError(`Failed to load patch: Invalid data format.`)
          console.error('Parse error:', parseError)
        }
      } else {
        showError('No patch data found in storage.')
      }
    },
    `Failed to load patch from slot ${n + 1}`
  )
}

const sendPatch = (): void => {
  // Handle non-arp sections
  const sections: PatchSectionKey[] = ['osc', 'filter', 'eg', 'mod', 'delay', 'reverb']

  sections.forEach(sectionKey => {
    const section = tmpPatch[sectionKey]
    const sectionParams = params[sectionKey]

    Object.entries(section).forEach(([paramKey, value]) => {
      const paramConfig = sectionParams[paramKey as keyof typeof sectionParams]
      if (paramConfig && typeof paramConfig === 'object' && 'cc' in paramConfig) {
        if (paramKey === 'type') {
          handleControlChange(paramConfig.cc, (value as { value: number }).value)
        } else {
          handleControlChange(paramConfig.cc, value as number)
        }
      }
    })
  })

  // Handle arp section separately
  handleControlChange(117, tmpPatch.arp.type.value)
  handleControlChange(118, tmpPatch.arp.scale.value)
  handleControlChange(119, tmpPatch.arp.length)
}

const handlePanic = (): void => {
  if (!outputId.value) return
  const outputDevice = WebMidi.getOutputById(outputId.value)
  if (outputDevice) {
    const channels =
      outputMidiChannel.value === 'all' ? undefined : parseInt(outputMidiChannel.value) || 1
    for (let i = 0; i < 128; i++) {
      outputDevice.stopNote(i, { channels })
    }
    outputDevice.sendControlChange(123, 0, { channels })
    heldNotes.value = []
  }
}

// Watch for hold switch changes
watch(holdSwitch, newVal => {
  if (!newVal) {
    clearHeldNotes()
  }
})

// Device monitoring
const setupDeviceMonitoring = (): void => {
  // Listen for device connection/disconnection events
  WebMidi.addListener('connected', event => {
    console.log('MIDI device connected:', event.port.name)
    outputs.value = WebMidi.outputs
    inputs.value = WebMidi.inputs
    updateDeviceConnectionStatus()
  })

  WebMidi.addListener('disconnected', event => {
    console.log('MIDI device disconnected:', event.port.name)
    outputs.value = WebMidi.outputs
    inputs.value = WebMidi.inputs
    updateDeviceConnectionStatus()
  })
}

// Watch for output device selection changes
watch(outputId, () => {
  updateDeviceConnectionStatus()
})

// Lifecycle
onMounted(() => {
  // Check WebMIDI support first
  if (!checkWebMidiSupport()) {
    return
  }

  // init MIDI
  WebMidi.enable({
    callback: (err?: Error) => {
      if (err) {
        console.error('MIDI could not be enabled.', err)
        handleMidiError(err)
      } else {
        console.info('WebMIDI enabled!')
        console.dir(WebMidi.outputs)
        midiEnabled.value = true
        midiError.value = null
        outputs.value = WebMidi.outputs
        inputs.value = WebMidi.inputs
        setupDeviceMonitoring()
        updateDeviceConnectionStatus()
      }
    }
  })
  // init local storage
  initStorage()
})
</script>

<template>
  <div>
    <!-- Error notification -->
    <q-banner v-if="showErrorNotification" class="bg-negative text-white" rounded inline-actions>
      <q-icon name="warning" class="q-mr-sm" />
      {{ errorMessage }}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="hideError" />
      </template>
    </q-banner>

    <!-- Connection status indicator -->
    <q-banner
      v-if="midiEnabled && deviceConnectionStatus !== 'connected'"
      class="bg-warning text-black"
      rounded
      inline-actions
    >
      <q-icon name="info" class="q-mr-sm" />
      <span v-if="deviceConnectionStatus === 'no_devices'">
        No MIDI devices detected. Please connect your NTS-1 and refresh the page.
      </span>
      <span v-else-if="deviceConnectionStatus === 'device_not_selected'">
        Please select a MIDI output device below.
      </span>
      <span v-else-if="deviceConnectionStatus === 'disconnected'">
        Selected MIDI device is disconnected.
      </span>
      <span v-else> MIDI status: {{ deviceConnectionStatus }} </span>
    </q-banner>
    <q-toolbar class="bg-grey-9 text-white shadow-2">
      <span class="app-name">Nu:Tekt NTS-1 Web Controller</span>
      <q-space />
      <q-btn @click="handlePanic" color="red" class="panic-btn q-mr-md" unelevated size="md">
        Panic!
      </q-btn>
      <q-tabs v-model="tab" align="justify" class="tabs" indicator-color="white">
        <q-tab name="knobs" icon="fiber_smart_record" label="Knobs" />
        <q-tab name="keyboards" icon="straighten" label="Keyboard" />
        <q-tab name="settings" icon="settings_input_svideo" label="Settings" />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="knobs">
        <div class="row" style="margin-bottom: 10px">
          <span v-for="(_value, index) in 8" :key="index">
            <store-button :number="index" @load="handleLoadPatch" @save="handleSavePatch" />
          </span>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">OSC</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.osc.type"
                  :options="types.osc"
                  @update:model-value="handleControlChange(params.osc.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.osc.shape"
                  v-model="tmpPatch.osc.shape"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.alt"
                  v-model="tmpPatch.osc.alt"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.rate"
                  v-model="tmpPatch.osc.rate"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.depth"
                  v-model="tmpPatch.osc.depth"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">Filter</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.filter.type"
                  :options="types.filter"
                  @update:model-value="handleControlChange(params.filter.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.filter.cutoff"
                  v-model="tmpPatch.filter.cutoff"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.res"
                  v-model="tmpPatch.filter.res"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.rate"
                  v-model="tmpPatch.filter.rate"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.depth"
                  v-model="tmpPatch.filter.depth"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">EG</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.eg.type"
                  :options="types.eg"
                  @update:model-value="handleControlChange(params.eg.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.eg.attack"
                  v-model="tmpPatch.eg.attack"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.release"
                  v-model="tmpPatch.eg.release"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.rate"
                  v-model="tmpPatch.eg.rate"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.depth"
                  v-model="tmpPatch.eg.depth"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">Modulation</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.mod.type"
                  :options="types.mod"
                  @update:model-value="handleControlChange(params.mod.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.mod.time"
                  v-model="tmpPatch.mod.time"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.mod.depth"
                  v-model="tmpPatch.mod.depth"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">Delay</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.delay.type"
                  :options="types.delay"
                  @update:model-value="handleControlChange(params.delay.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.delay.time"
                  v-model="tmpPatch.delay.time"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.delay.depth"
                  v-model="tmpPatch.delay.depth"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.delay.mix"
                  v-model="tmpPatch.delay.mix"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">Reverb</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.reverb.type"
                  :options="types.reverb"
                  @update:model-value="handleControlChange(params.reverb.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.reverb.time"
                  v-model="tmpPatch.reverb.time"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.reverb.depth"
                  v-model="tmpPatch.reverb.depth"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.reverb.mix"
                  v-model="tmpPatch.reverb.mix"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
          <div class="col channel">
            <q-card>
              <q-card-section class="bg-grey-8 q-pa-sm text-white">
                <div class="text-h6">Arpeggiator</div>
              </q-card-section>
              <div>
                <q-select
                  v-model="tmpPatch.arp.type"
                  :options="types.arp"
                  @update:model-value="handleControlChange(params.arp.type.cc, $event.value)"
                />
              </div>
              <div>
                <q-select
                  v-model="tmpPatch.arp.scale"
                  :options="types.scale"
                  @update:model-value="handleControlChange(params.arp.scale.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.arp.length"
                  v-model="tmpPatch.arp.length"
                  @handleControlChange="handleControlChange"
                />
              </div>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="keyboards">
        <keyboard
          :arpSwitch="arpSwitch"
          @update:arpSwitch="arpSwitch = $event"
          :holdSwitch="holdSwitch"
          @update:holdSwitch="holdSwitch = $event"
          :octave="octave"
          @handleOctave="handleOctave"
          @noteOn="noteOn"
          @noteOff="noteOff"
          @handleControlChange="handleControlChange"
        />
      </q-tab-panel>
      <q-tab-panel name="settings">
        <h5>Output Setting</h5>
        <div class="row justify-start q-gutter-sm">
          <div class="col-3">
            <q-select
              outlined
              v-model="outputId"
              :options="outputs"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Output Device"
            />
          </div>
          <div class="col-3">
            <q-select
              outlined
              v-model="outputMidiChannel"
              :options="midiChannelOptions"
              label="MIDI Channel"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style>
.tabs {
  min-width: 300px;
}
.q-tabs--horizontal .q-tabs__arrow--left {
  display: none;
}
.q-tabs--horizontal .q-tabs__arrow--right {
  display: none;
}
.app-name {
  font-weight: 800;
  font-size: 20px;
}
.channel {
  min-width: 140px;
  max-width: 180px;
}
.channel .q-card {
  height: 540px;
}

.knobs {
  padding: 10px 0 4px 0;
}
.q-field__native {
  margin-left: 6px;
}
</style>
