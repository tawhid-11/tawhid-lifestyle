import { Component, signal, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifestyleService } from '../../services/lifestyle.service';

@Component({
  selector: 'app-pomodoro-timer',
  imports: [CommonModule],
  template: `
    <div class="pomodoro-section glass-card animated-fade-in">
      <div class="card-header">
        <div class="title-area">
          <h3>⏱️ Deep Work Timer</h3>
          <p>25 minutes focus + 5 minutes break. A practical way to enhance brain's capacity.</p>
        </div>
        <div class="session-badge">
          Today's session: <span class="count-glow">{{ completedToday() }}</span>
        </div>
      </div>

      <div class="timer-body">
        
        <!-- SVG Circular Progress -->
        <div class="timer-dial">
          <svg class="dial-svg" width="180" height="180">
            <circle class="dial-bg" cx="90" cy="90" r="80" />
            <circle class="dial-bar" cx="90" cy="90" r="80" 
                    [style.strokeDashoffset]="dialOffset()"
                    [style.stroke]="isBreak() ? 'var(--accent-emerald)' : 'var(--accent-blue)'" />
          </svg>
          <div class="time-display">
            <span class="digits">{{ minutesStr() }}:{{ secondsStr() }}</span>
            <span class="mode-label">{{ isBreak() ? 'BREAK TIME' : 'DEEP WORK' }}</span>
          </div>
        </div>

        <!-- Controls Area -->
        <div class="controls-area">
          <!-- Session Presets -->
          <div class="presets">
            <button class="btn-preset" [class.active]="!isBreak() && durationSeconds() === 1500" (click)="setMode(25, false)">
              🧠 Focus (25m)
            </button>
            <button class="btn-preset" [class.active]="isBreak() && durationSeconds() === 300" (click)="setMode(5, true)">
              ☕ Break (5m)
            </button>
            <!-- Testing preset -->
            <button class="btn-preset test-btn" (click)="setMode(0.05, false)">
              ⚡ Test (3s)
            </button>
          </div>

          <!-- Master actions -->
          <div class="actions">
            @if (!isRunning()) {
              <button class="btn-primary btn-play pulse-glow" (click)="start()">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                  <path d="M320-203v-554l440 277-440 277Z"/>
                </svg>
                Start Session
              </button>
            } @else {
              <button class="btn-secondary btn-pause" (click)="pause()">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                  <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Z"/>
                </svg>
                Pause Session
              </button>
            }
            
            <button class="btn-secondary btn-reset" (click)="reset()">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 56-158-158 158-158 56 56-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
              </svg>
              Reset Session
            </button>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .pomodoro-section {
      border: 1px solid rgba(255, 255, 255, 0.08);
      height: 100%;
    }

    .pomodoro-section .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      margin-bottom: 28px;
    }

    .pomodoro-section .card-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .session-badge {
      font-size: 0.82rem;
      color: #94a3b8;
      font-weight: 600;
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 6px 14px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .count-glow {
      color: #fff;
      font-weight: 800;
      text-shadow: 0 0 10px var(--accent-blue-glow);
    }

    .timer-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
    }

    /* Dial Styling */
    .timer-dial {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }

    .dial-svg {
      transform: rotate(-90deg);
    }

    .dial-bg {
      fill: transparent;
      stroke: rgba(255, 255, 255, 0.03);
      stroke-width: 6;
    }

    .dial-bar {
      fill: transparent;
      stroke-width: 6;
      stroke-linecap: round;
      stroke-dasharray: 502.4; /* 2 * PI * R where R=80 */
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 0.3s linear, stroke 0.3s ease;
    }

    .time-display {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .time-display .digits {
      font-size: 2.2rem;
      font-weight: 900;
      color: #fff;
      font-family: var(--font-family-title);
      letter-spacing: -0.02em;
    }

    .time-display .mode-label {
      font-size: 0.65rem;
      font-weight: 800;
      color: #64748b;
      margin-top: 4px;
      letter-spacing: 0.1em;
    }

    /* Controls */
    .controls-area {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
      max-width: 340px;
    }

    .presets {
      display: flex;
      gap: 8px;
    }

    .btn-preset {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-preset:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .btn-preset.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--accent-blue);
      color: var(--accent-blue);
      box-shadow: 0 0 10px var(--accent-blue-glow);
    }

    .btn-preset.active:nth-child(2) {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent-emerald);
      color: var(--accent-emerald);
      box-shadow: 0 0 10px var(--accent-emerald-glow);
    }

    .test-btn {
      color: var(--accent-cyan);
      border-color: rgba(6, 182, 212, 0.2);
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .btn-play, .btn-pause {
      flex: 2;
      justify-content: center;
      gap: 6px;
    }

    .btn-play {
      background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .btn-pause {
      background: rgba(244, 63, 94, 0.15);
      color: #fda4af;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    .btn-pause:hover {
      background: rgba(244, 63, 94, 0.25);
    }

    .btn-reset {
      flex: 1;
      justify-content: center;
    }
  `]
})
export class PomodoroTimerComponent implements OnDestroy {
  readonly lifestyleService = inject(LifestyleService);
  
  // Timer States
  readonly durationSeconds = signal<number>(1500); // Default 25m
  readonly secondsLeft = signal<number>(1500);
  readonly isRunning = signal<boolean>(false);
  readonly isBreak = signal<boolean>(false);

  completedToday = this.lifestyleService.completedPomodorosToday;

  private timerId: any = null;

  // Formatted digits signals
  minutesStr = computed(() => {
    const min = Math.floor(this.secondsLeft() / 60);
    return String(min).padStart(2, '0');
  });

  secondsStr = computed(() => {
    const sec = this.secondsLeft() % 60;
    return String(sec).padStart(2, '0');
  });

  // Circle layout offset
  dialOffset = computed(() => {
    const total = this.durationSeconds();
    const left = this.secondsLeft();
    if (total === 0) return 0;
    
    const r = 80;
    const circumference = 2 * Math.PI * r; // 502.4
    const ratio = left / total;
    return circumference - (ratio * circumference);
  });

  start() {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.timerId = setInterval(() => {
      if (this.secondsLeft() > 0) {
        this.secondsLeft.update(s => s - 1);
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  pause() {
    this.isRunning.set(false);
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  reset() {
    this.pause();
    this.secondsLeft.set(this.durationSeconds());
  }

  setMode(minutes: number, breakMode: boolean) {
    this.pause();
    this.isBreak.set(breakMode);
    const secs = Math.round(minutes * 60);
    this.durationSeconds.set(secs);
    this.secondsLeft.set(secs);
  }

  private completeSession() {
    this.pause();
    this.playSynthesizedChime();

    if (!this.isBreak()) {
      // Completed deep work Pomodoro
      this.lifestyleService.incrementPomodoro();
      // Auto toggle to break
      this.setMode(5, true);
    } else {
      // Break is over
      this.setMode(25, false);
    }
  }

  // Synthesize crystal-clear premium chime audio using Web Audio API!
  private playSynthesizedChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };
      
      const now = ctx.currentTime;
      // Beautiful high-pitch chime chime! (E6 & G6 notes)
      playTone(now, 1318.51, 1.2); // E6
      playTone(now + 0.15, 1567.98, 1.5); // G6
      
    } catch (e) {
      // Audio synthesis blocker fallback
    }
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
