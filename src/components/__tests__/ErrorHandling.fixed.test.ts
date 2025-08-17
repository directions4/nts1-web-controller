import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import Main from '../Main.vue'

// Quasar configuration
const quasarConfig = {
  global: {
    plugins: [Quasar]
  }
}

// Mock console methods
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'info').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('Error Handling Tests', () => {
  let wrapper: any

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Basic Error Functions', () => {
    it('should have error handling functions available', () => {
      wrapper = mount(Main, quasarConfig)

      expect(typeof wrapper.vm.showError).toBe('function')
      expect(typeof wrapper.vm.hideError).toBe('function')
      expect(typeof wrapper.vm.checkWebMidiSupport).toBe('function')
      expect(typeof wrapper.vm.updateDeviceConnectionStatus).toBe('function')
    })

    it('should show and hide error messages correctly', () => {
      wrapper = mount(Main, quasarConfig)

      // Test showError
      wrapper.vm.showError('Test error message')
      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toBe('Test error message')

      // Test hideError
      wrapper.vm.hideError()
      expect(wrapper.vm.showErrorNotification).toBe(false)
      expect(wrapper.vm.errorMessage).toBe('')
    })

    it('should validate patch slot numbers', () => {
      wrapper = mount(Main, quasarConfig)

      // Test invalid negative slot
      wrapper.vm.handleSavePatch(-1)
      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toContain('Invalid patch slot')

      wrapper.vm.hideError()

      // Test invalid high slot
      wrapper.vm.handleLoadPatch(999)
      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toContain('Invalid patch slot')
    })
  })

  describe('Device Connection Status', () => {
    it('should update device connection status appropriately', () => {
      wrapper = mount(Main, quasarConfig)

      // Test when MIDI is not enabled
      wrapper.vm.midiEnabled = false
      wrapper.vm.updateDeviceConnectionStatus()
      expect(wrapper.vm.deviceConnectionStatus).toBe('midi_unavailable')

      // Test when no devices available
      wrapper.vm.midiEnabled = true
      wrapper.vm.outputs = []
      wrapper.vm.updateDeviceConnectionStatus()
      expect(wrapper.vm.deviceConnectionStatus).toBe('no_devices')

      // Test when device not selected
      wrapper.vm.outputs = [{ id: 'test', name: 'Test Device' }]
      wrapper.vm.outputId = null
      wrapper.vm.updateDeviceConnectionStatus()
      expect(wrapper.vm.deviceConnectionStatus).toBe('device_not_selected')
    })

    it('should display connection status messages in UI', async () => {
      wrapper = mount(Main, quasarConfig)

      wrapper.vm.midiEnabled = true
      wrapper.vm.deviceConnectionStatus = 'no_devices'
      await wrapper.vm.$nextTick()

      const statusBanner = wrapper.find('.bg-warning')
      expect(statusBanner.exists()).toBe(true)
      expect(statusBanner.text()).toContain('No MIDI devices detected')
    })
  })

  describe('Error Notification UI', () => {
    it('should display error banner when error is shown', async () => {
      wrapper = mount(Main, quasarConfig)

      wrapper.vm.showError('Test UI error')
      await wrapper.vm.$nextTick()

      const errorBanner = wrapper.find('.bg-negative')
      expect(errorBanner.exists()).toBe(true)
      expect(errorBanner.text()).toContain('Test UI error')
    })

    it('should allow dismissing error notifications', async () => {
      wrapper = mount(Main, quasarConfig)

      wrapper.vm.showError('Dismissible error')
      await wrapper.vm.$nextTick()

      const dismissButton = wrapper.find('button')
      if (dismissButton.exists()) {
        await dismissButton.trigger('click')
        expect(wrapper.vm.showErrorNotification).toBe(false)
      }
    })
  })

  describe('Safe Operations', () => {
    it('should handle MIDI operations when MIDI is disabled', () => {
      wrapper = mount(Main, quasarConfig)

      wrapper.vm.midiEnabled = false
      wrapper.vm.safeMidiOperation(() => {
        // This operation should not execute
        throw new Error('Should not reach here')
      }, 'Test Operation')

      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toContain('MIDI is not available')
    })

    it('should handle note operations without device selected', () => {
      wrapper = mount(Main, quasarConfig)

      wrapper.vm.midiEnabled = true
      wrapper.vm.outputId = null
      wrapper.vm.noteOn(60)

      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toContain('No MIDI device selected')
    })
  })

  describe('WebMIDI Support', () => {
    it('should check WebMIDI API support', () => {
      wrapper = mount(Main, quasarConfig)

      // Test when requestMIDIAccess is not available
      const originalRequestMIDIAccess = navigator.requestMIDIAccess
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: undefined,
        writable: true
      })

      const result = wrapper.vm.checkWebMidiSupport()
      expect(result).toBe(false)
      expect(wrapper.vm.showErrorNotification).toBe(true)
      expect(wrapper.vm.errorMessage).toContain('Web MIDI API is not supported')

      // Restore original value
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: originalRequestMIDIAccess,
        writable: true
      })
    })
  })
})
