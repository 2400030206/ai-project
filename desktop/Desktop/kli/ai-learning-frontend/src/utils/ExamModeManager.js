// Exam Mode Security Utilities

export class ExamModeManager {
  constructor(onTabSwitch, onPageLeave) {
    this.onTabSwitch = onTabSwitch;
    this.onPageLeave = onPageLeave;
    this.isListening = false;
  }

  startMonitoring() {
    if (this.isListening) return;

    // Detect visibility change (tab switching)
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Detect keyboard shortcuts that might open new tabs
    document.addEventListener("keydown", this.handleKeyDown);

    // Detect right-click attempts
    document.addEventListener("contextmenu", this.handleContextMenu);

    // Detect page unload
    window.addEventListener("beforeunload", this.handlePageLeave);

    // Detect page focus changes
    window.addEventListener("blur", this.handleWindowBlur);
    window.addEventListener("focus", this.handleWindowFocus);

    this.isListening = true;
  }

  stopMonitoring() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("contextmenu", this.handleContextMenu);
    window.removeEventListener("beforeunload", this.handlePageLeave);
    window.removeEventListener("blur", this.handleWindowBlur);
    window.removeEventListener("focus", this.handleWindowFocus);
    this.isListening = false;
  }

  handleVisibilityChange = () => {
    if (document.hidden) {
      this.onTabSwitch();
    }
  };

  handleKeyDown = (event) => {
    // Ctrl/Cmd + T = New Tab
    if ((event.ctrlKey || event.metaKey) && event.key === "t") {
      event.preventDefault();
      this.onTabSwitch();
    }
    // Ctrl/Cmd + N = New Window
    if ((event.ctrlKey || event.metaKey) && event.key === "n") {
      event.preventDefault();
      this.onTabSwitch();
    }
    // Ctrl/Cmd + W = Close Tab
    if ((event.ctrlKey || event.metaKey) && event.key === "w") {
      event.preventDefault();
      this.onPageLeave();
    }
  };

  handleContextMenu = (event) => {
    event.preventDefault();
    return false;
  };

  handlePageLeave = (event) => {
    this.onPageLeave();
    event.returnValue = "Are you sure you want to leave? Your exam will be auto-submitted.";
    return event.returnValue;
  };

  handleWindowBlur = () => {
    this.onTabSwitch();
  };

  handleWindowFocus = () => {
    // Optional: Could log re-entry
  };
}

// Timer utility for exam
export class ExamTimer {
  constructor(durationMinutes = 60) {
    this.totalSeconds = durationMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.timerInterval = null;
    this.onTick = null;
    this.onComplete = null;
  }

  start(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      if (this.onTick) {
        this.onTick(this.getFormattedTime());
      }

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pause() {
    this.stop();
  }

  resume(onTick, onComplete) {
    this.start(onTick, onComplete);
  }

  getFormattedTime() {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  getRemainingPercentage() {
    return (this.remainingSeconds / this.totalSeconds) * 100;
  }
}
