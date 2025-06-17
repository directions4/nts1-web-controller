<script setup>
import { ref, reactive, onMounted } from 'vue'
import { WebMidi } from 'webmidi'
import _ from 'lodash'
import Knob from './Knob.vue'
import StoreButton from './StoreButton.vue'
import Keyboard from './Keyboard.vue'
import { params, types, midiChannelOptions } from '@/lib/params'
import { storageAvailable } from '@/lib/utils'

// Reactive state
const holdSwitch = ref(true) // Keyboard hold toggle switch
const arpSwitch = ref(false) // Arppegiator toggle switch
const octave = ref(0) // Octave value
const tab = ref('knobs') // Global tab
const outputs = ref([]) // MIDI devices
const outputId = ref(null)
const inputs = ref([])
const outputMidiChannel = ref('all') // Selected MIDI channel
const patches = ref([]) // 10 Patch data

// Temporary patch data
const tmpPatch = reactive({
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

// Methods
const handleOctave = val => {
  octave.value = val
}

const noteOn = noteNum => {
  const outputDevice = WebMidi.getOutputById(outputId.value)
  outputDevice.playNote(noteNum, outputMidiChannel.value)
}

const noteOff = () => {
  const outputDevice = WebMidi.getOutputById(outputId.value)
  if (!holdSwitch.value) {
    for (let i = 0; i < 128; i++) {
      outputDevice.stopNote(i, outputMidiChannel.value)
    }
  }
}

const handleControlChange = (cc, val) => {
  // console.log("cc:", cc)
  // console.log("value:", val)
  const outputDevice = WebMidi.getOutputById(outputId.value)
  outputDevice.sendControlChange(cc, val, outputMidiChannel.value)
}

const initStorage = () => {
  const _tmpPatch = tmpPatch
  patches.value[0] = _tmpPatch
  if (storageAvailable) {
    if (localStorage.patches == undefined) {
      localStorage.setItem('patches', JSON.stringify(patches.value))
    }
  }
}

const handleSavePatch = n => {
  if (storageAvailable()) {
    const _tmpPatch = tmpPatch
    patches.value[n] = _tmpPatch
    localStorage.setItem('patches', JSON.stringify(patches.value))
  }
}

const handleLoadPatch = n => {
  if (storageAvailable()) {
    const stores = JSON.parse(localStorage.getItem('patches'))
    if (stores[n]) {
      Object.assign(tmpPatch, stores[n])
      sendPatch()
    } else {
      console.log('Empty!')
    }
  }
}

const sendPatch = () => {
  _.forEach(tmpPatch, (val, key) => {
    let parentKey = key
    if (key !== 'arp') {
      _.forEach(tmpPatch[key], (val, key) => {
        let cc = params[parentKey][key]['cc']
        if (key === 'type') {
          handleControlChange(cc, val.value)
        } else {
          handleControlChange(cc, val)
        }
      })
    } else {
      handleControlChange(117, tmpPatch.arp.type.value)
      handleControlChange(118, tmpPatch.arp.scale.value)
      handleControlChange(119, tmpPatch.arp.length)
    }
  })
}

// Lifecycle
onMounted(() => {
  // init MIDI
  WebMidi.enable(err => {
    if (err) {
      console.error('MIDI could not be enabled.', err)
    } else {
      console.info('WebMIDI enabled!')
      console.dir(WebMidi.outputs)
      outputs.value = WebMidi.outputs
      inputs.value = WebMidi.inputs
    }
  })
  // init local storage
  initStorage()
})
</script>

<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white shadow-2">
      <span class="app-name">Nu:Tekt NTS-1 Web Controller</span>
      <q-space />
      <q-tabs v-model="tab" align="justify" class="tabs" indicator-color="white">
        <q-tab name="knobs" icon="fiber_smart_record" label="Knobs" />
        <q-tab name="keyboards" icon="straighten" label="Keyboard" />
        <q-tab name="settings" icon="settings_input_svideo" label="Settings" />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="knobs">
        <div class="row" style="margin-bottom: 10px">
          <span v-for="(value, index) in 8" :key="index">
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
