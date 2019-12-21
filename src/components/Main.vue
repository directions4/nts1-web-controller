<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white shadow-2">
      <span class="app-name">Nu:Tekt NTS-1 Web Controller</span>
      <q-space />
      <q-tabs
        v-model="tab"
        align="justify"
        class="tabs"
        indicator-color="white"
      >
        <q-tab name="knobs" icon="fiber_smart_record" label="Knobs" />
        <q-tab name="keyboards" icon="straighten" label="Keyboard" />
        <q-tab name="settings" icon="settings_input_svideo" label="Settings" />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="knobs">
        <div class="row" style="margin-bottom: 10px;">
          <span v-for="(value, index) in 8" :key="index">
            <store-button
              :number="index"
              @load="handleLoadPatch"
              @save="handleSavePatch"
            />
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
                  @input="handleControlChange(params.osc.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.osc.shape"
                  :value="tmpPatch.osc.shape"
                  @input="tmpPatch.osc.shape = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.alt"
                  :value="tmpPatch.osc.alt"
                  @input="tmpPatch.osc.alt = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.rate"
                  :value="tmpPatch.osc.rate"
                  @input="tmpPatch.osc.rate = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.osc.depth"
                  :value="tmpPatch.osc.depth"
                  @input="tmpPatch.osc.depth = $event"
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
                  @input="
                    handleControlChange(params.filter.type.cc, $event.value)
                  "
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.filter.cutoff"
                  :value="tmpPatch.filter.cutoff"
                  @input="tmpPatch.filter.cutoff = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.res"
                  :value="tmpPatch.filter.res"
                  @input="tmpPatch.filter.res = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.rate"
                  :value="tmpPatch.filter.rate"
                  @input="tmpPatch.filter.rate = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.filter.depth"
                  :value="tmpPatch.filter.depth"
                  @input="tmpPatch.filter.depth = $event"
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
                  @input="handleControlChange(params.eg.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.eg.attack"
                  :value="tmpPatch.eg.attack"
                  @input="tmpPatch.eg.attack = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.release"
                  :value="tmpPatch.eg.release"
                  @input="tmpPatch.eg.release = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.rate"
                  :value="tmpPatch.eg.rate"
                  @input="tmpPatch.eg.rate = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.eg.depth"
                  :value="tmpPatch.eg.depth"
                  @input="tmpPatch.eg.depth = $event"
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
                  @input="handleControlChange(params.mod.type.cc, $event.value)"
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.mod.time"
                  :value="tmpPatch.mod.time"
                  @input="tmpPatch.mod.time = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.mod.depth"
                  :value="tmpPatch.mod.depth"
                  @input="tmpPatch.mod.depth = $event"
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
                  @input="
                    handleControlChange(params.delay.type.cc, $event.value)
                  "
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.delay.time"
                  :value="tmpPatch.delay.time"
                  @input="tmpPatch.delay.time = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.delay.depth"
                  :value="tmpPatch.delay.depth"
                  @input="tmpPatch.delay.depth = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.delay.mix"
                  :value="tmpPatch.delay.mix"
                  @input="tmpPatch.delay.mix = $event"
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
                  @input="
                    handleControlChange(params.reverb.type.cc, $event.value)
                  "
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.reverb.time"
                  :value="tmpPatch.reverb.time"
                  @input="tmpPatch.reverb.time = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.reverb.depth"
                  :value="tmpPatch.reverb.depth"
                  @input="tmpPatch.reverb.depth = $event"
                  @handleControlChange="handleControlChange"
                />
                <knob
                  :params="params.reverb.mix"
                  :value="tmpPatch.reverb.mix"
                  @input="tmpPatch.reverb.mix = $event"
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
                  @input="handleControlChange(params.arp.type.cc, $event.value)"
                />
              </div>
              <div>
                <q-select
                  v-model="tmpPatch.arp.scale"
                  :options="types.scale"
                  @input="
                    handleControlChange(params.arp.scale.cc, $event.value)
                  "
                />
              </div>
              <div class="knobs text-center">
                <knob
                  :params="params.arp.length"
                  :value="tmpPatch.arp.length"
                  @input="tmpPatch.arp.length = $event"
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
          @inputArp="arpSwitch = $event"
          :holdSwitch="holdSwitch"
          @inputHold="holdSwitch = $event"
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

<script>
import webmidi from "webmidi";
import _ from "lodash";
import Knob from "./Knob";
import StoreButton from "./StoreButton";
import Keyboard from "./Keyboard";
import { params, types, midiChannelOptions } from "@/lib/params";
import { storageAvailable } from "@/lib/utils";

export let midiAccess;
export default {
  name: "Main",
  components: {
    Knob,
    StoreButton,
    Keyboard
  },
  data() {
    return {
      holdSwitch: true, // Keyboard hold toggle switch
      arpSwitch: false, // Arppegiator toggle switch
      octave: 0, // Octave value
      params, // Defined parameters
      types, // Defined types
      midiChannelOptions, // MIDI Channel options
      tab: "knobs", // Global tab
      outputs: [], // MIDI devices
      output: null, // Selected device
      outputId: -220173338,
      inputs: [],
      inputId: null,
      outputMidiChannel: "all", // Selected MIDI channel
      inputMidiChannel: "all",
      patches: [], // 10 Patch data
      tmpPatch: {
        // a temporary patch
        osc: {
          type: { value: 0, label: "Sawtooth" },
          shape: 1,
          alt: 1,
          rate: 1,
          depth: 1
        },
        filter: {
          type: { value: 0, label: "Low Pass 2" },
          cutoff: 1,
          res: 1,
          rate: 1,
          depth: 1
        },
        eg: {
          type: { value: 0, label: "ADSR" },
          attack: 1,
          release: 1,
          rate: 1,
          depth: 1
        },
        mod: {
          type: { value: 0, label: "Off" },
          time: 1,
          depth: 1
        },
        delay: {
          type: { value: 0, label: "Off" },
          time: 1,
          depth: 1,
          mix: 1
        },
        reverb: {
          type: { value: 0, label: "Off" },
          time: 1,
          depth: 1,
          mix: 1
        },
        arp: {
          type: { value: 0, label: "Up" },
          scale: { value: 0, label: "Octave" },
          length: 127
        }
      }
    };
  },
  created() {
    // init MIDI
    webmidi.enable(err => {
      if (err) {
        console.log("MIDI could not be enabled.", err);
      } else {
        console.log("WebMIDI ebabled!");
        this.outputs = webmidi.outputs;
        this.inputs = webmidi.inputs;
      }
    });
    // init local storage
    this.initStorage();
  },
  methods: {
    // Update octave value
    handleOctave(val) {
      this.octave = val;
    },
    // Play note
    noteOn(noteNum) {
      const output = webmidi.getOutputById(this.outputId);
      output.playNote(noteNum, this.outputMidiChannel);
    },
    // Stop note
    noteOff() {
      const output = webmidi.getOutputById(this.outputId);
      if (!this.holdSwitch) {
        for (let i = 0; i < 128; i++) {
          output.stopNote(i, this.outputMidiChannel);
        }
      }
    },
    // Control change
    handleControlChange: function(cc, val) {
      // console.log("cc:", cc);
      // console.log("value:", val);
      const output = webmidi.getOutputById(this.outputId);
      output.sendControlChange(cc, val, this.outputMidiChannel);
    },
    // init LocalStorage
    initStorage() {
      const _tmpPatch = this.tmpPatch;
      this.patches[0] = _tmpPatch;
      if (storageAvailable) {
        if (localStorage.patches == undefined) {
          localStorage.setItem("patches", JSON.stringify(this.patches));
        }
      }
    },
    // Save a patch to LocalStorage
    handleSavePatch(n) {
      if (storageAvailable()) {
        const _tmpPatch = this.tmpPatch;
        this.patches[n] = _tmpPatch;
        localStorage.setItem("patches", JSON.stringify(this.patches));
      }
    },
    // Load a patch from LocalStorage
    handleLoadPatch(n) {
      if (storageAvailable()) {
        const stores = JSON.parse(localStorage.getItem("patches"));
        if (stores[n]) {
          this.tmpPatch = stores[n];
          this.sendPatch();
        } else {
          console.log("Empty!");
        }
      }
    },
    sendPatch() {
      _.forEach(this.tmpPatch, (val, key) => {
        let parentKey = key;
        if (key !== "arp") {
          _.forEach(this.tmpPatch[key], (val, key) => {
            let cc = this.params[parentKey][key]["cc"];
            if (key === "type") {
              this.handleControlChange(cc, val.value);
            } else {
              this.handleControlChange(cc, val);
            }
          });
        } else {
          this.handleControlChange(117, this.tmpPatch.arp.type.value);
          this.handleControlChange(118, this.tmpPatch.arp.scale.value);
          this.handleControlChange(119, this.tmpPatch.arp.length);
        }
      });
    }
  }
};
</script>
