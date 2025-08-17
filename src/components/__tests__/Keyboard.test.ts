import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import Keyboard from '../Keyboard.vue'

// Quasar configuration
const quasarConfig = {
  global: {
    plugins: [Quasar]
  }
}

describe('Keyboard.vue', () => {
  const defaultProps = {
    holdSwitch: false,
    arpSwitch: false,
    octave: 0
  }

  it('should set props correctly', () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: defaultProps
    })

    expect(wrapper.props('holdSwitch')).toBe(false)
    expect(wrapper.props('arpSwitch')).toBe(false)
    expect(wrapper.props('octave')).toBe(0)
  })

  it('should display octave value correctly', () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: 2 }
    })

    const octaveBadge = wrapper.findComponent({ name: 'QBadge' })
    expect(octaveBadge.text()).toBe('2')
  })

  it('should work correctly with octave up button', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: 2 }
    })

    const upButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Up')
    )
    await upButton?.trigger('click')

    expect(wrapper.emitted()['handleOctave']).toBeTruthy()
    expect(wrapper.emitted()['handleOctave'][0]).toEqual([3])
  })

  it('should work correctly with octave down button', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: 2 }
    })

    const downButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Down')
    )
    await downButton?.trigger('click')

    expect(wrapper.emitted()['handleOctave']).toBeTruthy()
    expect(wrapper.emitted()['handleOctave'][0]).toEqual([1])
  })

  it('should enforce octave upper limit', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: 5 }
    })

    const upButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Up')
    )
    await upButton?.trigger('click')

    // When octave = 5, it's at upper limit so should not emit
    expect(wrapper.emitted()['handleOctave']).toBeFalsy()
  })

  it('should enforce octave lower limit', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: -5 }
    })

    const downButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Down')
    )
    await downButton?.trigger('click')

    // When octave = -5, it's at lower limit so should not emit
    expect(wrapper.emitted()['handleOctave']).toBeFalsy()
  })

  it('should work correctly with holdSwitch toggle', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: defaultProps
    })

    const toggle = wrapper.findComponent({ name: 'QToggle' })
    await toggle.vm.$emit('update:model-value', true)

    expect(wrapper.emitted()['update:holdSwitch']).toBeTruthy()
    expect(wrapper.emitted()['update:holdSwitch'][0]).toEqual([true])
  })

  it('should not emit when holdSwitch is same value', () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, holdSwitch: true }
    })

    const vm = wrapper.vm as any
    vm._holdSwitch = true // Set same value

    expect(wrapper.emitted()['update:holdSwitch']).toBeFalsy()
  })

  it('should have piano keys placed correctly', () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: defaultProps
    })

    const keys = wrapper.findAll('.key')
    expect(keys).toHaveLength(24) // Total white and black keys

    // Check first white key
    const firstKey = keys[0]
    expect(firstKey.attributes('data-note')).toBe('60')

    // Check first black key
    const firstBlackKey = wrapper.find('.black-key')
    expect(firstBlackKey.attributes('data-note')).toBe('61')
  })

  it('should trigger note on event correctly', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: { ...defaultProps, octave: 1 }
    })

    const firstKey = wrapper.find('[data-note="60"]')
    
    // Simulate mousedown event
    await firstKey.trigger('mousedown')

    expect(wrapper.emitted()['noteOn']).toBeTruthy()
    // When octave = 1, coefficient = 1 * 12 = 12
    // noteNum = 60 + 12 = 72
    expect(wrapper.emitted()['noteOn'][0]).toEqual([72])
  })

  it('should trigger note off event correctly', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: defaultProps
    })

    const piano = wrapper.find('.piano')
    await piano.trigger('mouseup')

    expect(wrapper.emitted()['noteOff']).toBeTruthy()
  })

  it('should work with touch events for note on/off', async () => {
    const wrapper = mount(Keyboard, {
      ...quasarConfig,
      props: defaultProps
    })

    const firstKey = wrapper.find('[data-note="60"]')
    const piano = wrapper.find('.piano')

    // touchstart event
    await firstKey.trigger('touchstart')
    expect(wrapper.emitted()['noteOn']).toBeTruthy()

    // touchend event
    await piano.trigger('touchend')
    expect(wrapper.emitted()['noteOff']).toBeTruthy()
  })

  it('should calculate octave correctly', async () => {
    const testCases = [
      { octave: -2, expectedNote: 36 }, // 60 + (-2 * 12) = 36
      { octave: 0, expectedNote: 60 },  // 60 + (0 * 12) = 60
      { octave: 2, expectedNote: 84 }   // 60 + (2 * 12) = 84
    ]

    for (const testCase of testCases) {
      const wrapper = mount(Keyboard, {
        ...quasarConfig,
        props: { ...defaultProps, octave: testCase.octave }
      })

      const firstKey = wrapper.find('[data-note="60"]')
      await firstKey.trigger('mousedown')

      expect(wrapper.emitted()['noteOn']).toBeTruthy()
      const emittedNote = wrapper.emitted()['noteOn'][0][0]
      expect(emittedNote).toBe(testCase.expectedNote)
    }
  })
})