import { useSettingsStore } from "../../stores/settingsStore";

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Standard audio context initializer
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Plays a tone with a specific frequency, type, duration, and gain envelope.
 */
function playTone({ frequency, type = "sine", duration = 0.1, gainStart = 0.1, frequencyEnd = null }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security constraint)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  if (frequencyEnd !== null) {
    osc.frequency.exponentialRampToValueAtTime(frequencyEnd, ctx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gainStart, ctx.currentTime);
  // Linear decay envelope
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound() {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  // A light ascending chime: C5 (523.25 Hz) then E5 (659.25 Hz)
  const ctx = getAudioContext();
  if (!ctx) return;
  
  playTone({ frequency: 523.25, duration: 0.12, gainStart: 0.08 });
  setTimeout(() => {
    playTone({ frequency: 659.25, duration: 0.18, gainStart: 0.08 });
  }, 100);
}

export function playIncorrectSound() {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  // A short low thud: triangle wave decaying from 220Hz (A3)
  playTone({ frequency: 220, type: "triangle", duration: 0.25, gainStart: 0.15 });
}

export function playAchievementSound() {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  // An arpeggio of C major chord: C4 (261.63Hz) -> E4 (329.63Hz) -> G4 (392Hz) -> C5 (523.25Hz)
  const tones = [261.63, 329.63, 392, 523.25];
  tones.forEach((freq, idx) => {
    setTimeout(() => {
      playTone({ frequency: freq, duration: 0.18, gainStart: 0.06 });
    }, idx * 80);
  });
}

export function playLevelUpSound() {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  // A sweep synthesizer riser from 300Hz to 800Hz
  playTone({ frequency: 300, frequencyEnd: 800, duration: 0.5, gainStart: 0.1 });
}

export function playNewRecordSound() {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  // A fast triplet fanfare: E5 (659.25) -> G5 (783.99) -> C6 (1046.50)
  const tones = [659.25, 783.99, 1046.50];
  tones.forEach((freq, idx) => {
    setTimeout(() => {
      playTone({ frequency: freq, duration: 0.25, gainStart: 0.08 });
    }, idx * 100);
  });
}
