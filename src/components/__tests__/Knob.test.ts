import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import Knob from '../Knob.vue'
import type { ParamConfig } from '@/lib/params'

// Quasar configuration
const quasarConfig = {
  global: {
    plugins: [Quasar]
  }
}

// Mock parameter configuration for testing
const mockParams: ParamConfig = {
  min: 0,
  max: 127,
  step: 1,
  label: 'Test Param',
  cc: 74
}

describe('Knob.vue', () => {
  it('should set props correctly', () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    expect(wrapper.props('modelValue')).toBe(64)
    expect(wrapper.props('params')).toEqual(mockParams)
  })

  it('should display label correctly', () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    const label = wrapper.find('.label-knob')
    expect(label.text()).toBe('Test Param')
  })

  it('should emit events when value changes', async () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    // Directly change QKnob value
    const qKnob = wrapper.findComponent({ name: 'QKnob' })
    await qKnob.vm.$emit('update:model-value', 100)

    // Verify that emit occurs correctly
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([100])
    
    expect(wrapper.emitted()['handleControlChange']).toBeTruthy()
    expect(wrapper.emitted()['handleControlChange'][0]).toEqual([74, 100])
  })

  it('should not emit when same value is set', () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    // Directly test computed setter logic
    const vm = wrapper.vm as any
    vm._value = 64 // Set same value

    // Verify that emit does not occur
    expect(wrapper.emitted()['update:modelValue']).toBeFalsy()
    expect(wrapper.emitted()['handleControlChange']).toBeFalsy()
  })

  it('should pass correct props to QKnob component', () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    const qKnob = wrapper.findComponent({ name: 'QKnob' })
    expect(qKnob.props()).toMatchObject({
      min: 0,
      max: 127,
      modelValue: 64,
      showValue: true,
      size: '60px',
      thickness: 0.22,
      color: 'cyan-6',
      trackColor: 'grey-3'
    })
  })

  it('should work correctly with computed property _value', () => {
    const wrapper = mount(Knob, {
      ...quasarConfig,
      props: {
        params: mockParams,
        modelValue: 64
      }
    })

    const vm = wrapper.vm as any
    
    // Test getter
    expect(vm._value).toBe(64)
    
    // Test setter
    vm._value = 100
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['handleControlChange']).toBeTruthy()
  })
})