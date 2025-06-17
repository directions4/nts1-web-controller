// Type definitions
export interface ParamConfig {
  min: number
  max: number
  step: number
  label: string
  cc: number
}

export interface TypeOnlyConfig {
  cc: number
}

export interface OptionType {
  value: number
  label: string
}

export interface MidiChannelOption {
  value: string
  label: string
}

export interface ParamsStructure {
  osc: {
    type: TypeOnlyConfig
    shape: ParamConfig
    alt: ParamConfig
    rate: ParamConfig
    depth: ParamConfig
  }
  filter: {
    type: TypeOnlyConfig
    cutoff: ParamConfig
    res: ParamConfig
    rate: ParamConfig
    depth: ParamConfig
  }
  eg: {
    type: TypeOnlyConfig
    attack: ParamConfig
    release: ParamConfig
    rate: ParamConfig
    depth: ParamConfig
  }
  mod: {
    type: TypeOnlyConfig
    time: ParamConfig
    depth: ParamConfig
  }
  delay: {
    type: TypeOnlyConfig
    time: ParamConfig
    depth: ParamConfig
    mix: ParamConfig
  }
  reverb: {
    type: TypeOnlyConfig
    time: ParamConfig
    depth: ParamConfig
    mix: ParamConfig
  }
  arp: {
    type: TypeOnlyConfig
    scale: TypeOnlyConfig
    length: ParamConfig
  }
}

export interface TypesStructure {
  osc: OptionType[]
  filter: OptionType[]
  eg: OptionType[]
  mod: OptionType[]
  delay: OptionType[]
  reverb: OptionType[]
  arp: OptionType[]
  scale: OptionType[]
}

// Parameter configurations
export const params: ParamsStructure = {
  osc: {
    type: {
      cc: 53
    },
    shape: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Shape',
      cc: 54
    },
    alt: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Alternate',
      cc: 55
    },
    rate: {
      min: 0,
      max: 127,
      step: 1,
      label: 'LFO Rate',
      cc: 24
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'LFO Depth',
      cc: 26
    }
  },
  filter: {
    type: {
      cc: 42
    },
    cutoff: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Cut Off',
      cc: 43
    },
    res: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Resonance',
      cc: 71
    },
    rate: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Sweep Depth',
      cc: 23
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Sweep Rate',
      cc: 25
    }
  },
  eg: {
    type: {
      cc: 72
    },
    attack: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Attack',
      cc: 73
    },
    release: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Release',
      cc: 75
    },
    rate: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Trem. Depth',
      cc: 27
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Trem. Rate',
      cc: 28
    }
  },
  mod: {
    type: {
      cc: 88
    },
    time: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Time',
      cc: 30
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Depth',
      cc: 31
    }
  },
  delay: {
    type: {
      cc: 89
    },
    time: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Time',
      cc: 33
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Depth',
      cc: 34
    },
    mix: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Mix',
      cc: 35
    }
  },
  reverb: {
    type: {
      cc: 90
    },
    time: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Time',
      cc: 36
    },
    depth: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Depth',
      cc: 37
    },
    mix: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Mix',
      cc: 38
    }
  },
  arp: {
    type: {
      cc: 117
    },
    scale: {
      cc: 118
    },
    length: {
      min: 0,
      max: 127,
      step: 1,
      label: 'Length',
      cc: 119
    }
  }
}

// Type options
export const types: TypesStructure = {
  osc: [
    {
      value: 0,
      label: 'Sawtooth'
    },
    {
      value: 1,
      label: 'Triangle'
    },
    {
      value: 2,
      label: 'Square'
    },
    {
      value: 3,
      label: 'VPN'
    },
    {
      value: 4,
      label: 'USER01'
    }
  ],
  filter: [
    {
      value: 0,
      label: 'LowPass 2p'
    },
    {
      value: 1,
      label: 'LowPass 4p'
    },
    {
      value: 2,
      label: 'BandPass 2p'
    },
    {
      value: 3,
      label: 'BandPass 4p'
    },
    {
      value: 4,
      label: 'HightPass 2p'
    },
    {
      value: 5,
      label: 'HightPass 4p'
    },
    {
      value: 6,
      label: 'Off'
    }
  ],
  eg: [
    {
      value: 0,
      label: 'ADSR'
    },
    {
      value: 1,
      label: 'AHR'
    },
    {
      value: 2,
      label: 'AR'
    },
    {
      value: 3,
      label: 'AR·Loop'
    },
    {
      value: 4,
      label: 'Gate'
    },
    {
      value: 5,
      label: 'Gate+Decay'
    },
    {
      value: 6,
      label: 'Off'
    }
  ],
  mod: [
    {
      value: 0,
      label: 'Off'
    },
    {
      value: 1,
      label: 'Chorus'
    },
    {
      value: 2,
      label: 'Ensemble'
    },
    {
      value: 3,
      label: 'Phaser'
    },
    {
      value: 4,
      label: 'Flanger'
    },
    {
      value: 5,
      label: 'User'
    }
  ],
  delay: [
    {
      value: 0,
      label: 'Off'
    },
    {
      value: 1,
      label: 'Stereo'
    },
    {
      value: 2,
      label: 'Mono'
    },
    {
      value: 3,
      label: 'PingPong'
    },
    {
      value: 4,
      label: 'HighCut'
    },
    {
      value: 5,
      label: 'Tape'
    },
    {
      value: 6,
      label: 'User'
    }
  ],
  reverb: [
    {
      value: 0,
      label: 'Off'
    },
    {
      value: 1,
      label: 'Hall'
    },
    {
      value: 2,
      label: 'Plate'
    },
    {
      value: 3,
      label: 'Room'
    },
    {
      value: 4,
      label: 'Riser'
    },
    {
      value: 5,
      label: 'Submarine'
    },
    {
      value: 6,
      label: 'User'
    }
  ],
  arp: [
    {
      value: 0,
      label: 'Up'
    },
    {
      value: 1,
      label: 'Down'
    },
    {
      value: 2,
      label: 'UpDown'
    },
    {
      value: 3,
      label: 'DownUp'
    },
    {
      value: 4,
      label: 'UpDown2'
    },
    {
      value: 5,
      label: 'DownUp2'
    },
    {
      value: 6,
      label: 'Converge'
    },
    {
      value: 7,
      label: 'Diverge'
    },
    {
      value: 8,
      label: 'Con/Div'
    },
    {
      value: 9,
      label: 'Pinky·Up'
    },
    {
      value: 10,
      label: 'Pinky·UpDown'
    },
    {
      value: 11,
      label: 'Thumb·Up'
    },
    {
      value: 12,
      label: 'Thumb·UpDown'
    },
    {
      value: 13,
      label: 'Random'
    },
    {
      value: 14,
      label: 'Stochastic'
    },
    {
      value: 15,
      label: 'Off'
    }
  ],
  scale: [
    {
      value: 0,
      label: 'Octave'
    },
    {
      value: 1,
      label: 'Major'
    },
    {
      value: 2,
      label: 'Minor'
    },
    {
      value: 3,
      label: 'Dorian'
    },
    {
      value: 4,
      label: 'Lydian'
    },
    {
      value: 5,
      label: 'Mixolydian'
    },
    {
      value: 6,
      label: 'Spanish·8·Tone'
    },
    {
      value: 7,
      label: 'Blues'
    },
    {
      value: 8,
      label: 'Arabian'
    },
    {
      value: 9,
      label: 'Chromatic'
    }
  ]
}

// MIDI Channel options
export const midiChannelOptions: MidiChannelOption[] = [
  'all',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16'
].map((value, index) => ({
  value,
  label: index === 0 ? 'All' : value
}))
