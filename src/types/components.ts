import type { ParamConfig, OptionType } from '@/lib/params'

// Patch data structure
export interface PatchData {
  osc: {
    type: OptionType
    shape: number
    alt: number
    rate: number
    depth: number
  }
  filter: {
    type: OptionType
    cutoff: number
    res: number
    rate: number
    depth: number
  }
  eg: {
    type: OptionType
    attack: number
    release: number
    rate: number
    depth: number
  }
  mod: {
    type: OptionType
    time: number
    depth: number
  }
  delay: {
    type: OptionType
    time: number
    depth: number
    mix: number
  }
  reverb: {
    type: OptionType
    time: number
    depth: number
    mix: number
  }
  arp: {
    type: OptionType
    scale: OptionType
    length: number
  }
}

// MIDI Device interface
export interface MidiDevice {
  id: string
  name: string
  manufacturer: string
  state: string
  type: string
}

// Component Props
export interface KnobProps {
  params: ParamConfig
  modelValue: number
}

export interface StoreButtonProps {
  number: number
}

export interface KeyboardProps {
  holdSwitch: boolean
  arpSwitch: boolean
  octave: number
}

// Event emitters
export interface KnobEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'handleControlChange', cc: number, value: number): void
}

export interface StoreButtonEmits {
  (e: 'load', slot: number): void
  (e: 'save', slot: number): void
}

export interface KeyboardEmits {
  (e: 'update:holdSwitch', value: boolean): void
  (e: 'update:arpSwitch', value: boolean): void
  (e: 'handleOctave', value: number): void
  (e: 'noteOn', noteNum: number): void
  (e: 'noteOff'): void
}
