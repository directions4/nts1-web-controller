/**
 * @file utilities
 */

// Type definitions
type Primitive = string | number | boolean | null | undefined
type StorageType = 'localStorage' | 'sessionStorage'

/**
 * Check if a value exists (is not null or undefined)
 * @param x - The value to check
 * @returns True if the value exists, false otherwise
 */
export const existy = (x: Primitive): boolean => x != null

/**
 * Check if a value is truthy (not false and exists)
 * @param x - The value to check
 * @returns True if the value is truthy, false otherwise
 */
export const truthy = (x: Primitive): boolean => x !== false && existy(x)

/**
 * Check if browser storage is available
 * @param type - The storage type to check ('localStorage' or 'sessionStorage')
 * @returns True if storage is available and accessible, false otherwise
 * @description From MDN https://developer.mozilla.org/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
export const storageAvailable = (type: StorageType = 'localStorage'): boolean => {
  let storage: Storage

  try {
    storage = window[type]
  } catch {
    return false
  }

  try {
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage?.length ?? 0) !== 0
    )
  }
}
