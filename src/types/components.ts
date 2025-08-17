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
  state: 'connected' | 'disconnected'
  type: 'input' | 'output'
}

// MIDI Channel type
export type MidiChannel =
  | 'all'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'

// MIDI operation result
export interface MidiOperationResult {
  success: boolean
  error?: string
}

// Error types
export type ErrorType =
  | 'midi_not_supported'
  | 'midi_permission_denied'
  | 'midi_device_error'
  | 'storage_error'
  | 'validation_error'
  | 'unknown_error'

export interface AppError {
  type: ErrorType
  message: string
  context?: string
  timestamp?: Date
}

// Function types for error handling
export type ErrorHandler = (error: AppError) => void
export type SafeOperation<T = void> = () => T | Promise<T>
export type SafeOperationWrapper = <T>(
  operation: SafeOperation<T>,
  errorContext: string,
  errorType?: ErrorType
) => T | void

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

// Type for patch sections
export type PatchSectionKey = 'osc' | 'filter' | 'eg' | 'mod' | 'delay' | 'reverb'

// Type for patch section values (excluding type which is OptionType)
export type PatchSectionValue = number

// Type for parameter keys within each section
export type ParamKey<T extends PatchSectionKey> = T extends 'osc'
  ? 'shape' | 'alt' | 'rate' | 'depth'
  : T extends 'filter'
    ? 'cutoff' | 'res' | 'rate' | 'depth'
    : T extends 'eg'
      ? 'attack' | 'release' | 'rate' | 'depth'
      : T extends 'mod'
        ? 'time' | 'depth'
        : T extends 'delay'
          ? 'time' | 'depth' | 'mix'
          : T extends 'reverb'
            ? 'time' | 'depth' | 'mix'
            : never

// Error handling types
export interface ErrorState {
  showErrorNotification: boolean
  errorMessage: string
  midiEnabled: boolean
  midiError: string | null
  deviceConnectionStatus: string
}

export type DeviceConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'no_devices'
  | 'device_not_selected'
  | 'midi_unavailable'

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
