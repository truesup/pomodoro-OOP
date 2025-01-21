class PomodoroTimer {
  constructor(onUpdate, onSwitchMode) {
    this.workDuration = 1500;
    this.breakDuration = 300;
    this.currentTime = this.workDuration;
    this.currentMode = 'work';
    this.isRunning = false;
    this.timerInterval = null;

    this.onUpdate = onUpdate || (() => {});
    this.onSwitchMode = onSwitchMode || (() => {});
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timerInterval = setInterval(() => this.tick(), 1000);
    }
  }

  pause() {
    if (this.isRunning) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
    }
  }

  reset() {
    if (this.isRunning) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
    }

    this.currentTime =
      this.currentMode === 'work' ? this.workDuration : this.breakDuration;

    if (this.onUpdate) {
      this.onUpdate(this.formatTime(this.currentTime), this.currentMode);
    }
  }

  switchMode() {
    this.currentMode = this.currentMode === 'work' ? 'break' : 'work';
    this.currentTime =
      this.currentMode === 'work' ? this.workDuration : this.breakDuration;

    if (this.onSwitchMode) {
      this.onSwitchMode(this.currentMode, this.formatTime(this.currentTime));
    }
  }

  autoSwitchMode() {
    if (this.currentTime === 0) {
      this.switchMode();

      if (this.isRunning) {
        this.start();
      }
    }
  }

  tick() {
    if (this.currentTime > 0) {
      this.currentTime -= 1;
      if (this.onUpdate) {
        this.onUpdate(this.formatTime(this.currentTime), this.currentMode);
      }
    }

    this.autoSwitchMode();
  }
}

const startPauseButton = document.getElementById('startPauseButton');
const resetButton = document.getElementById('resetButton');
const display = document.getElementById('display');
const modeText = document.querySelector('.mode');

const onUpdate = (formattedTime, mode) => {
  display.textContent = formattedTime;
  modeText.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
};

const onSwitchMode = (mode, time) => {
  modeText.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
};

const pomodoroTimer = new PomodoroTimer(onUpdate, onSwitchMode);

startPauseButton.addEventListener('click', () => {
  if (pomodoroTimer.isRunning) {
    pomodoroTimer.pause();
    startPauseButton.textContent = 'Start';
  } else {
    pomodoroTimer.start();
    startPauseButton.textContent = 'Pause';
  }
});

resetButton.addEventListener('click', () => {
  pomodoroTimer.reset();
  startPauseButton.textContent = 'Start';
});
