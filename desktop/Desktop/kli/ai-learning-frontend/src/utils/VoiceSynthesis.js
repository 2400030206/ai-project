// Speech Synthesis Utility

export class VoiceSynthesis {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isSpeaking = false;
  }

  speak(text, language = "en", rate = 1, pitch = 1) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      this.isSpeaking = false;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    this.synth.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  isBrowserSupported() {
    return "speechSynthesis" in window;
  }

  getAvailableVoices() {
    return this.synth.getVoices();
  }

  setVoice(voiceIndex) {
    const voices = this.getAvailableVoices();
    if (this.currentUtterance && voices[voiceIndex]) {
      this.currentUtterance.voice = voices[voiceIndex];
    }
  }
}

export const voiceSynthesis = new VoiceSynthesis();
