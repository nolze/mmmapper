import { writable } from 'svelte/store';

// TODO: Split
const textaliveStore = {
  manager: writable(null),
};

const word = writable(null);
const char = writable(null);
const beat = {
  progress: writable(0),
  position: writable({ position: 1, length: 1 }),
};
const chorus = {
  now: writable(false),
};
const vocalAmplitude = {
  ratio: writable(0),
};

export { textaliveStore };
export default { word, char, beat, chorus, vocalAmplitude };
