/**
 * "Remember Me" storage API
 */

const STORAGE_KEY = 'kastachme.remember';

function loadFromStorage() {
  const dataStr = window.localStorage.getItem(STORAGE_KEY);
  if (!dataStr) {
    return {};
  }
  return JSON.parse(dataStr);
}

function saveToStorage(data) {
  return window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStorage() {
  return window.localStorage.removeItem(STORAGE_KEY);
}

export default {
  load: loadFromStorage,
  save: saveToStorage,
  clear: clearStorage,
};
