<template>
  <div>
    <div class="row q-pa-md">
      <div class="col">
        <div>
          <label>
            Octave:
            <q-badge color="grey-9">{{ octave }}</q-badge>
          </label>
        </div>
        <q-btn
          color="primary"
          icon="keyboard_arrow_left"
          label="Down"
          @click="handleOctaveDown"
          style="width:120px;margin: 0 10px 0 0;"
        />
        <q-btn
          color="primary"
          icon-right="keyboard_arrow_right"
          label="Up"
          @click="handleOctaveUp"
          style="width:120px;"
        />
      </div>
      <div class="col text-right">
        <div>
          <label>Hold</label>
        </div>
        <q-toggle v-model="_holdSwitch" />
      </div>
    </div>

    <div
      class="piano"
      @mousedown="handleNoteOn"
      @mouseup="handleNoteOff"
      @touchstart="handleNoteOn"
      @touchend="handleNoteOff"
    >
      <span class="key" data-note="60"></span>
      <span class="key black-key" data-note="61"></span>
      <span class="key" data-note="62"></span>
      <span class="key black-key" data-note="63"></span>
      <span class="key" data-note="64"></span>
      <span class="key" data-note="65"></span>
      <span class="key black-key" data-note="66"></span>
      <span class="key" data-note="67"></span>
      <span class="key black-key" data-note="68"></span>
      <span class="key" data-note="69"></span>
      <span class="key black-key" data-note="70"></span>
      <span class="key" data-note="71"></span>
      <span class="key" data-note="72"></span>
      <span class="key black-key" data-note="73"></span>
      <span class="key" data-note="74"></span>
      <span class="key black-key" data-note="75"></span>
      <span class="key" data-note="76"></span>
      <span class="key" data-note="77"></span>
      <span class="key black-key" data-note="78"></span>
      <span class="key" data-note="79"></span>
      <span class="key black-key" data-note="80"></span>
      <span class="key" data-note="81"></span>
      <span class="key black-key" data-note="82"></span>
      <span class="key" data-note="83"></span>
    </div>
  </div>
</template>

<style>
.key {
  border: 1px solid #999;
  cursor: pointer;
  display: inline-block;
  height: 460px;
  width: calc(100% / 14 - 2px);
  width: -webkit-calc(100% / 14 - 2px);
}

.black-key {
  background-color: #333;
  height: 260px;
  margin-left: -2.5%;
  position: absolute;
  width: 5%;
}

.piano {
  margin: 50px auto;
  position: relative;
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Hold trigger switch
  holdSwitch: {
    type: Boolean,
    required: true,
    default: false
  },
  // Arppegio trigger switch
  arpSwitch: {
    type: Boolean,
    required: true,
    default: false
  },
  // Octave up and down
  octave: {
    type: Number,
    required: true,
    default: 0
  }
})

const emit = defineEmits([
  'update:holdSwitch',
  'update:arpSwitch', 
  'handleOctave',
  'noteOn',
  'noteOff'
])

const _holdSwitch = computed({
  get() {
    return props.holdSwitch
  },
  set(bool) {
    if (props.holdSwitch !== bool) {
      emit('update:holdSwitch', bool)
    }
  }
})

const _arpSwitch = computed({
  get() {
    return props.arpSwitch
  },
  set(bool) {
    if (props.arpSwitch !== bool) {
      emit('update:arpSwitch', bool)
    }
  }
})

const _octave = computed(() => props.octave)

const handleOctaveUp = () => {
  if (props.octave < 5) {
    emit('handleOctave', props.octave + 1)
  }
}

const handleOctaveDown = () => {
  if (props.octave > -5) {
    emit('handleOctave', props.octave - 1)
  }
}

const handleNoteOn = (event) => {
  const coefficient = props.octave * 12
  const noteNum = Number(event.target.dataset.note) + coefficient
  emit('noteOn', noteNum)
}

const handleNoteOff = () => {
  emit('noteOff')
}
</script>
