/**
 * Exam Timer Utilities
 * Manages persistent timer state with localStorage and server sync
 */

interface TimerState {
  examId: number;
  startTime: string; // ISO datetime when exam started for this user
  endTime: string; // ISO datetime when exam should end
  lastSync: number; // timestamp when last synced with server
  remainingSeconds?: number; // backup in case of calculation issues
}

const TIMER_STORAGE_KEY = 'exam_timer_state';
const SYNC_INTERVAL = 30 * 1000; // Sync every 30 seconds

export class ExamTimer {
  private examId: number;
  private startTime: Date;
  private endTime: Date;
  private lastSync: number = 0;
  private onTimeUpdate: (remainingSeconds: number) => void;
  private onTimeEnd: () => void;
  private timerInterval?: NodeJS.Timeout;
  private syncInterval?: NodeJS.Timeout;

  constructor(
    examId: number,
    examStartTime: string,
    examEndTime: string,
    onTimeUpdate: (remainingSeconds: number) => void,
    onTimeEnd: () => void
  ) {
    this.examId = examId;
    this.startTime = new Date(examStartTime);
    this.endTime = new Date(examEndTime);
    this.onTimeUpdate = onTimeUpdate;
    this.onTimeEnd = onTimeEnd;
    
    this.loadTimerState();
  }

  /**
   * Load timer state from localStorage or calculate from server times
   */
  private loadTimerState(): void {
    try {
      const savedState = localStorage.getItem(TIMER_STORAGE_KEY);
      if (savedState) {
        const state: TimerState = JSON.parse(savedState);
        if (state.examId === this.examId) {
          // Use saved state if it's for the same exam
          this.startTime = new Date(state.startTime);
          this.endTime = new Date(state.endTime);
          this.lastSync = state.lastSync;
        }
      }
    } catch (error) {
      // Failed to load timer state
    }
  }

  /**
   * Save current timer state to localStorage
   */
  private saveTimerState(): void {
    try {
      const state: TimerState = {
        examId: this.examId,
        startTime: this.startTime.toISOString(),
        endTime: this.endTime.toISOString(),
        lastSync: Date.now(),
        remainingSeconds: this.getRemainingSeconds()
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Failed to save timer state
    }
  }

  /**
   * Calculate remaining seconds based on current time and exam end time
   */
  public getRemainingSeconds(): number {
    const now = new Date();
    const remaining = Math.max(0, Math.floor((this.endTime.getTime() - now.getTime()) / 1000));
    return remaining;
  }

  /**
   * Check if exam has started
   */
  public hasExamStarted(): boolean {
    const now = new Date();
    return now >= this.startTime;
  }

  /**
   * Check if exam has ended
   */
  public hasExamEnded(): boolean {
    const now = new Date();
    return now >= this.endTime;
  }

  /**
   * Get seconds until exam starts (negative if already started)
   */
  public getSecondsUntilStart(): number {
    const now = new Date();
    return Math.floor((this.startTime.getTime() - now.getTime()) / 1000);
  }

  /**
   * Start the timer with automatic updates and syncing
   */
  public start(): void {
    // Initial calculation and update
    this.updateTimer();
    
    // Set up timer interval (every second)
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);

    // Set up sync interval (every 30 seconds)
    this.syncInterval = setInterval(() => {
      this.saveTimerState();
    }, SYNC_INTERVAL);
  }

  /**
   * Stop the timer and clean up intervals
   */
  public stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    this.saveTimerState();
  }

  /**
   * Update timer and trigger callbacks
   */
  private updateTimer(): void {
    const remaining = this.getRemainingSeconds();
    
    if (remaining <= 0) {
      this.stop();
      this.onTimeEnd();
      return;
    }

    this.onTimeUpdate(remaining);
  }

  /**
   * Sync with server time (can be called to update exam times from server)
   */
  public syncWithServer(newStartTime?: string, newEndTime?: string): void {
    if (newStartTime) {
      this.startTime = new Date(newStartTime);
    }
    if (newEndTime) {
      this.endTime = new Date(newEndTime);
    }
    this.saveTimerState();
  }

  /**
   * Force set remaining time (for emergency situations)
   */
  public setRemainingSeconds(seconds: number): void {
    const now = new Date();
    this.endTime = new Date(now.getTime() + (seconds * 1000));
    this.saveTimerState();
  }

  /**
   * Clear saved timer state (on logout or exam submit)
   */
  public static clearSavedState(): void {
    try {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    } catch (error) {
      // Failed to clear timer state
    }
  }

  /**
   * Format seconds to readable time format
   */
  public static formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}