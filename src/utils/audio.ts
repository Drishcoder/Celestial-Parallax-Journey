/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isAlive = false;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentSectionIndex = 0;

  // Polyphonic chords representing the moods of the 4 sections
  private chords = [
    // Section 0: The Celestial Summit (A Major 9th / Open celestial)
    [110.00, 165.00, 220.00, 277.18, 330.00], // A2, E3, A3, C#4, E4
    // Section 1: The Sylvan Shallows (G minor / Wooded melancholic)
    [98.00, 146.83, 196.00, 233.08, 293.66],  // G2, D3, G3, Bb3, D4
    // Section 2: The Crystal Fjord (F Major 7th / Crisp Glacier Aqua)
    [87.31, 130.81, 174.61, 220.00, 349.23],  // F2, C3, F3, A3, F4
    // Section 3: The Heartwood Core (C Major / Settling grounded Earth)
    [65.41, 130.81, 196.00, 261.63, 311.13]   // C2, C3, G3, C4, Eb4 (deep roots)
  ];

  constructor() {}

  public init() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create Filter Node for deep warmth
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    
    // Master Gain for smooth volume control & global muting
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start silent
    
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // 1. Build Sub Drone (triangle wave for ultimate warmth)
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = "triangle";
    // Pitch corresponds to root note of current chord: A1 (55Hz)
    this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
    
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime); // Soft background weight
    
    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.filter);
    this.droneOsc.start();

    // 2. Build 5-Voice Chord Pad
    const initialChord = this.chords[0];
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      // Combine saw and sine waves dynamically
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(initialChord[i], this.ctx.currentTime);

      // Give each oscillator a slightly detuned voice (creates rich choir chorus feel)
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, this.ctx.currentTime);

      const voiceGain = this.ctx.createGain();
      // Higher voices are softer, lower voices provide body
      const baseGain = i === 0 ? 0.15 : i === 1 ? 0.12 : i === 2 ? 0.09 : 0.06;
      voiceGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

      osc.connect(voiceGain);
      voiceGain.connect(this.filter);
      osc.start();

      this.voices.push({ osc, gain: voiceGain });
    }

    this.isAlive = true;
  }

  public async play() {
    if (!this.ctx) this.init();
    
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (this.masterGain && this.ctx) {
      // Fade-in smoothly over 1.5 seconds to avoid click pops
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      // Fade-out smoothly over 1.0 second
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
    }
  }

  public setSection(index: number) {
    if (index < 0 || index >= this.chords.length) return;
    if (index === this.currentSectionIndex) return;
    this.currentSectionIndex = index;

    if (!this.ctx || !this.isAlive) return;

    const targetChord = this.chords[index];
    const now = this.ctx.currentTime;

    // Glide pitches of chord oscillators over 2.5 seconds (Cinematic pitch glide/crossfade)
    this.voices.forEach((voice, i) => {
      if (i < targetChord.length) {
        voice.osc.frequency.cancelScheduledValues(now);
        voice.osc.frequency.setValueAtTime(voice.osc.frequency.value, now);
        // Exponential ramp for natural-sounding musical glide
        voice.osc.frequency.exponentialRampToValueAtTime(targetChord[i], now + 2.5);
      }
    });

    // Root bass drone changes to match new key
    if (this.droneOsc) {
      const rootFrequency = targetChord[0] / 2; // Octave below the lowest voice
      this.droneOsc.frequency.cancelScheduledValues(now);
      this.droneOsc.frequency.setValueAtTime(this.droneOsc.frequency.value, now);
      this.droneOsc.frequency.exponentialRampToValueAtTime(rootFrequency, now + 3.0);
    }

    // Tweak lowpass filter cutoff to alter timbre based on section depth
    if (this.filter) {
      // High section -> more brightness (higher cutoff)
      // Lower section -> deeper, warmer, muffled sound (lower cutoff)
      const cutoffMap = [480, 380, 420, 320]; // Custom frequencies representing altitude
      const targetCutoff = cutoffMap[index] || 400;

      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
      this.filter.frequency.exponentialRampToValueAtTime(targetCutoff, now + 3.0);
    }
  }

  /**
   * Modulate filter cutoff on scroll to create a breathing "shiff" sound
   */
  public handleScrollModulation(normalizedProgress: number) {
    if (!this.ctx || !this.filter || !this.isAlive) return;
    
    // Add dynamic scroll wave based modulation
    const now = this.ctx.currentTime;
    const baseCutoff = [480, 380, 420, 320][this.currentSectionIndex] || 400;
    
    // Sweep range (+/- 60Hz) depending on speed/progress
    const currentProgressMod = Math.sin(normalizedProgress * Math.PI) * 40;
    const targetVal = Math.max(200, baseCutoff + currentProgressMod);
    
    this.filter.frequency.setValueAtTime(targetVal, now);
  }
}
