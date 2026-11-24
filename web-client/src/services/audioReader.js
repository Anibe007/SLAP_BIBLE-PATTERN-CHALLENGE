/**
 * Audio Bible Reader Service
 * 
 * Provides robust, cross-platform Scripture audio playback via Web Speech API
 * with verse-by-verse sequencing, garbage-collection protection, Chrome keep-alive,
 * natural voice selection, and full Play / Pause / Resume / Stop controls.
 */

class AudioBibleReaderService {
  constructor() {
    this.state = 'IDLE'; // 'IDLE' | 'PLAYING' | 'PAUSED' | 'LOADING' | 'ERROR'
    this.book = '';
    this.chapter = '';
    this.verses = [];
    this.currentIndex = 0;
    this.activeVerseNumber = null;
    this.playbackRate = 0.95;
    this.pitch = 1.0;
    this.listeners = new Set();
    this.keepAliveInterval = null;
    this.activeUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    if (this.isSupported) {
      this._initVoices();
    }
  }

  _initVoices() {
    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          this.voices = available;
          this.selectedVoice = this._pickBestVoice(available);
        }
      } catch (err) {
        console.warn("SpeechSynthesis getVoices error:", err);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  _pickBestVoice(voices) {
    if (!voices || voices.length === 0) return null;

    // Prioritize high-quality natural English voices
    const preferredNames = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Microsoft David - English (United States)',
      'Microsoft Zira - English (United States)',
      'Daniel',
      'Samantha',
      'Serena',
      'Oliver',
      'Karen'
    ];

    for (const name of preferredNames) {
      const match = voices.find(v => v.name === name || v.name.includes(name));
      if (match) return match;
    }

    // Fall back to any en-US, en-GB, en-AU voice
    const englishVoice = voices.find(v => v.lang && (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')));
    if (englishVoice) return englishVoice;

    // Fall back to default voice
    return voices.find(v => v.default) || voices[0];
  }

  _startKeepAlive() {
    this._stopKeepAlive();
    // Chromium has an internal 15-second speech synthesis timeout bug.
    // Toggling pause/resume every 10s prevents it from timing out mid-chapter.
    this.keepAliveInterval = setInterval(() => {
      if (this.state === 'PLAYING' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  _stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  _notifyListeners(errorMsg = null) {
    const payload = {
      state: this.state,
      book: this.book,
      chapter: this.chapter,
      activeVerse: this.activeVerseNumber,
      currentIndex: this.currentIndex,
      totalVerses: this.verses.length,
      playbackRate: this.playbackRate,
      error: errorMsg
    };

    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error("Audio reader listener error:", err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately deliver current state to newly subscribed component
    callback({
      state: this.state,
      book: this.book,
      chapter: this.chapter,
      activeVerse: this.activeVerseNumber,
      currentIndex: this.currentIndex,
      totalVerses: this.verses.length,
      playbackRate: this.playbackRate,
      error: null
    });

    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Load and begin audio playback of a Bible chapter
   * @param {string} book - e.g. "Genesis"
   * @param {string|number} chapter - e.g. 1
   * @param {Array<{verse: number, text: string}>} verses - Chapter verses
   * @param {number} [startVerseIndex=0] - Starting verse index
   */
  play(book, chapter, verses, startVerseIndex = 0) {
    if (!this.isSupported) {
      this.state = 'ERROR';
      this._notifyListeners("Text-to-speech audio reader is not supported in this browser.");
      return;
    }

    if (!verses || verses.length === 0) {
      this.state = 'ERROR';
      this._notifyListeners("No scripture verses available to read.");
      return;
    }

    // Cancel any previous speech
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}

    this.book = book;
    this.chapter = chapter;
    this.verses = verses;
    this.currentIndex = Math.max(0, Math.min(startVerseIndex, verses.length - 1));
    this.state = 'PLAYING';
    this._startKeepAlive();

    // Small timeout ensures audio pipeline reset before starting
    setTimeout(() => {
      if (this.state === 'PLAYING') {
        this._speakCurrentVerse();
      }
    }, 50);
  }

  _cleanText(text) {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\[\d+\]/g, '') // remove footnote references [1]
      .replace(/\{[^}]*\}/g, '') // remove bracketed notes
      .replace(/\s+/g, ' ')
      .trim();
  }

  _speakCurrentVerse() {
    if (this.state !== 'PLAYING') return;

    if (this.currentIndex >= this.verses.length) {
      // Completed reading the chapter
      this.stop();
      return;
    }

    const currentV = this.verses[this.currentIndex];
    this.activeVerseNumber = currentV.verse;
    this._notifyListeners();

    const cleanedText = this._cleanText(currentV.text);
    
    // Construct readable text
    let spokenText = '';
    if (this.currentIndex === 0) {
      spokenText = `${this.book} chapter ${this.chapter}. Verse ${currentV.verse}. ${cleanedText}`;
    } else {
      spokenText = `Verse ${currentV.verse}. ${cleanedText}`;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = this.playbackRate;
      utterance.pitch = this.pitch;

      if (!this.selectedVoice && this.voices.length > 0) {
        this.selectedVoice = this._pickBestVoice(this.voices);
      }
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // GC Protection: bind to window and service instance
      this.activeUtterance = utterance;
      if (typeof window !== 'undefined') {
        window.__slapActiveUtterance = utterance;
      }

      utterance.onend = () => {
        if (this.state === 'PLAYING') {
          this.currentIndex++;
          // Small pause between verses for reverent cadence
          setTimeout(() => {
            if (this.state === 'PLAYING') {
              this._speakCurrentVerse();
            }
          }, 250);
        }
      };

      utterance.onerror = (e) => {
        // 'canceled' and 'interrupted' are expected when user stops/pauses
        if (e.error === 'canceled' || e.error === 'interrupted') {
          return;
        }
        console.warn("SpeechSynthesis error on verse:", currentV.verse, e.error);
        if (this.state === 'PLAYING') {
          // If a single verse errors, try advancing to next verse
          this.currentIndex++;
          if (this.currentIndex < this.verses.length) {
            setTimeout(() => this._speakCurrentVerse(), 300);
          } else {
            this.stop();
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis execution error:", err);
      this.state = 'ERROR';
      this._notifyListeners("Failed to initiate audio playback. Please check your browser audio settings.");
    }
  }

  pause() {
    if (this.state !== 'PLAYING') return;

    this.state = 'PAUSED';
    this._stopKeepAlive();

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
        // Fallback for browsers that do not pause cleanly
        setTimeout(() => {
          if (this.state === 'PAUSED' && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.cancel();
          }
        }, 150);
      }
    } catch (err) {
      console.warn("Error pausing speech:", err);
    }

    this._notifyListeners();
  }

  resume() {
    if (this.state !== 'PAUSED') return;

    this.state = 'PLAYING';
    this._startKeepAlive();

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          this._notifyListeners();
          return;
        }
      }
    } catch (err) {
      console.warn("Error resuming native speech:", err);
    }

    // If native resume didn't trigger speech, restart from current verse index
    this._speakCurrentVerse();
  }

  stop() {
    this._stopKeepAlive();
    this.state = 'IDLE';
    this.activeVerseNumber = null;
    this.currentIndex = 0;
    this.activeUtterance = null;
    if (typeof window !== 'undefined') {
      window.__slapActiveUtterance = null;
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
    }
    this._notifyListeners();
  }

  seekToVerse(verseNumber) {
    const idx = this.verses.findIndex(v => v.verse === verseNumber);
    if (idx !== -1) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
      this.currentIndex = idx;
      this.state = 'PLAYING';
      this._startKeepAlive();
      this._speakCurrentVerse();
    }
  }

  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.5, Math.min(rate, 2.0));
    // If currently playing, restart active verse at new rate
    if (this.state === 'PLAYING') {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
      this._speakCurrentVerse();
    } else {
      this._notifyListeners();
    }
  }
}

export const audioReader = new AudioBibleReaderService();
