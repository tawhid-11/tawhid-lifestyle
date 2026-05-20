import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifestyleService } from '../../services/lifestyle.service';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  template: `
    <div class="overview-section animated-fade-in">
      
      <!-- Profile Intro Card -->
      <div class="glass-card intro-card">
        <div class="avatar-area" (click)="profileInput.click()" style="cursor: pointer;" title="Click to change profile picture">
          <input type="file" #profileInput style="display: none;" accept="image/*" (change)="onProfileSelected($event)">
          <div class="avatar-glow">
            @if (lifestyleService.profileImage()) {
              <img [src]="lifestyleService.profileImage()" class="custom-avatar" alt="Profile">
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="currentColor">
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q64-31 133-46.5t123-15.5q54 0 123 15.5t133 46.5q31 15 48.5 43.5T800-272v32H160Zm80-80h480v-3q0-11-5.5-20T700-357q-54-27-106.5-39.5T480-409q-55 0-107.5 12.5T266-357q-9 4-14.5 13t-5.5 20v3Zm240-240q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 440Z"/>
              </svg>
            }
          </div>
          <div class="badge-developer">PRO DEVELOPER</div>
        </div>
        <div class="intro-content">
          <h2>Welcome, Tawhid!</h2>
          <p>Here's your daily dashboard to track your health, mental discipline, and software engineering career growth.</p>
          
          <div class="quote-grid">
            <div class="quote-card">
              <span class="quote-icon">🕌</span>
              <p>"Spiritual discipline = mental stability + self control + focus power"</p>
            </div>
            <div class="quote-card">
              <span class="quote-icon">⚡</span>
              <p>"Body weak = brain slow. Keep yourself fueled and physically active!"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gauges & Progress Grid -->
      <div class="stats-grid">
        
        <!-- Spiritual Progress -->
        <div class="glass-card stat-card spiritual">
          <div class="card-header">
            <h3>Spiritual Discipline</h3>
            <span class="status-pill spiritual">Spiritual</span>
          </div>
          <div class="card-body">
            <div class="radial-container">
              <svg class="progress-ring" width="100" height="100">
                <circle class="ring-bg" cx="50" cy="50" r="40" />
                <circle class="ring-bar" cx="50" cy="50" r="40" 
                        [style.strokeDashoffset]="spiritualOffset()" />
              </svg>
              <div class="radial-text">
                <span class="percentage">{{ spiritualPercent() }}%</span>
                <span class="label">Prayers</span>
              </div>
            </div>
            <p class="summary-text">{{ prayersDone() }} / 5 Waktu Prayers Completed</p>
          </div>
        </div>

        <!-- Habits Progress -->
        <div class="glass-card stat-card tech">
          <div class="card-header">
            <h3>Daily Rules</h3>
            <span class="status-pill tech">Development</span>
          </div>
          <div class="card-body">
            <div class="radial-container">
              <svg class="progress-ring" width="100" height="100">
                <circle class="ring-bg" cx="50" cy="50" r="40" />
                <circle class="ring-bar" cx="50" cy="50" r="40" 
                        [style.strokeDashoffset]="habitsOffset()" />
              </svg>
              <div class="radial-text">
                <span class="percentage">{{ habitsPercent() }}%</span>
                <span class="label">Target</span>
              </div>
            </div>
            <p class="summary-text">{{ habitsDone() }} / 6 Core Rules Achieved</p>
          </div>
        </div>

        <!-- Health Progress -->
        <div class="glass-card stat-card health">
          <div class="card-header">
            <h3>Food & Fitness Fuel</h3>
            <span class="status-pill health">Health</span>
          </div>
          <div class="card-body">
            <div class="radial-container">
              <svg class="progress-ring" width="100" height="100">
                <circle class="ring-bg" cx="50" cy="50" r="40" />
                <circle class="ring-bar" cx="50" cy="50" r="40" 
                        [style.strokeDashoffset]="healthOffset()" />
              </svg>
              <div class="radial-text">
                <span class="percentage">{{ healthPercent() }}%</span>
                <span class="label">Lifestyle</span>
              </div>
            </div>
            <p class="summary-text">{{ lifestyleScoreText() }}</p>
          </div>
        </div>

        <!-- Career System Development -->
        <div class="glass-card stat-card career">
          <div class="card-header">
            <h3>Software Engineer</h3>
            <span class="status-pill tech">Active Project</span>
          </div>
          <div class="card-body">
            <div class="radial-container">
              <svg class="progress-ring" width="100" height="100">
                <circle class="ring-bg" cx="50" cy="50" r="40" />
                <circle class="ring-bar" cx="50" cy="50" r="40" 
                        [style.strokeDashoffset]="projectOffset()" />
              </svg>
              <div class="radial-text">
                <span class="percentage">{{ projectPercent() }}%</span>
                <span class="label">Projects</span>
              </div>
            </div>
            <div class="proj-summary">
              <span class="proj-name-badge">{{ activeProjectName() }}</span>
              <p class="summary-text">{{ completedProjectTasksCount() }} / {{ totalProjectTasksCount() }} Tasks Completed</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Streaks Strip (Full Width) -->
      <div class="glass-card streaks-card col-span-2">
        <div class="streak-item spiritual">
          <div class="streak-icon">🕌</div>
          <div class="streak-details">
            <span class="title">Prayer Performance Streak</span>
            <span class="counter"><strong>{{ prayerStreak() }} days</strong> (Completed 5 Waktu prayers)</span>
          </div>
        </div>
        
        <div class="streak-item coding">
          <div class="streak-icon">💻</div>
          <div class="streak-details">
            <span class="title">Daily Coding Streak</span>
            <span class="counter"><strong>{{ codingStreak() }} days</strong> (Completed 1-2 hour sessions)</span>
          </div>
        </div>
      </div>

      <!-- Todarki Accountability History Board (Full Width) -->
      <div class="glass-card todarki-card col-span-2">
        <div class="todarki-header">
          <div class="todarki-title">
            <span class="todarki-emoji">🕵️‍♂️</span>
            <h3>7 Days Lifestyle Accountability Board (Habits & Spiritual Supervision Grid)</h3>
          </div>
          <p class="todarki-sub">Your history of maintaining regular habits that are automatically saved.</p>
        </div>

        <div class="todarki-grid">
          @for (day of weeklyHistory(); track day.dateStr) {
            <div class="todarki-day-card" [class.is-today]="day.dateStr === todayKey()">
              <span class="day-label">{{ day.dayName }}</span>
              <span class="date-label">{{ formatDateSub(day.dateStr) }}</span>
              
              <div class="day-metrics">
                <!-- Bismillah intent -->
                <div class="metric-item" [title]="day.bismillah ? 'দিনের শুরুতে বিসমিল্লাহ নিয়ত নিয়েছেন' : 'বিসমিল্লাহ নিয়ত মিস হয়েছে'">
                  <span class="icon">✨</span>
                  <span class="status-dot" [class.success]="day.bismillah"></span>
                </div>

                <!-- Salah completed -->
                <div class="metric-item" [title]="day.salahCount + ' ওয়াক্ত সালাত আদায় করেছেন'">
                  <span class="icon">🕌</span>
                  <span class="score-tag" [class.complete]="day.salahCount === 5">{{ day.salahCount }}/5</span>
                </div>

                <!-- Core habits -->
                <div class="metric-item" [title]="day.habitsCount + ' কোর রুলস সম্পূর্ণ করেছেন'">
                  <span class="icon">🧠</span>
                  <span class="score-tag" [class.complete]="day.habitsCount === 6">{{ day.habitsCount }}/6</span>
                </div>

                <!-- Food checklists -->
                <div class="metric-item" [title]="day.foodCount + ' পুষ্টিকর ফুড আইটেম খেয়েছেন'">
                  <span class="icon">🥗</span>
                  <span class="score-tag" [class.complete]="day.foodCount === 4">{{ day.foodCount }}/4</span>
                </div>

                <!-- Avoid checklists -->
                <div class="metric-item" [title]="(3 - day.avoidCount) + ' ক্ষতিকর খাবার পরিহার করেছেন'">
                  <span class="icon">🚫</span>
                  <span class="score-tag" [class.complete]="day.avoidCount === 3">{{ day.avoidCount }}/3</span>
                </div>

                <!-- Water consumed -->
                <div class="metric-item" [title]="day.water + ' লিটার পানি পান করেছেন'">
                  <span class="icon">💧</span>
                  <span class="score-text">{{ day.water }}L</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .overview-section {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .col-span-2 {
      grid-column: span 2;
    }

    @media (max-width: 1024px) {
      .overview-section {
        grid-template-columns: 1fr;
      }
      .col-span-2 {
        grid-column: span 1;
      }
    }

    /* Intro Card */
    .intro-card {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: linear-gradient(135deg, rgba(13, 19, 38, 0.75) 0%, rgba(20, 28, 56, 0.5) 100%);
    }

    .avatar-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .avatar-glow {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.1);
      border: 2px solid var(--accent-blue);
      box-shadow: 0 0 20px var(--accent-blue-glow);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--accent-blue);
      overflow: hidden;
    }

    .custom-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-developer {
      background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
      color: #fff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 12px;
      letter-spacing: 0.05em;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .intro-content h2 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 12px;
      background: linear-gradient(90deg, #fff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .intro-content p {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .quote-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .quote-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .quote-icon {
      font-size: 1.3rem;
    }

    .quote-card p {
      margin: 0;
      font-size: 0.8rem;
      color: #cbd5e1;
      font-style: italic;
    }

    /* Stats Cards Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .stat-card .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .stat-card .card-header h3 {
      font-size: 1rem;
      font-weight: 700;
    }

    .stat-card .card-body {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-card .summary-text {
      font-size: 0.82rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .proj-summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .proj-name-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-purple);
      background: rgba(139, 92, 246, 0.1);
      border: 1.5px solid rgba(139, 92, 246, 0.25);
      padding: 2px 8px;
      border-radius: 6px;
      display: inline-block;
      max-width: max-content;
    }

    /* Radial Progress Rings */
    .radial-container {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .ring-bg {
      fill: transparent;
      stroke: rgba(255, 255, 255, 0.04);
      stroke-width: 8;
    }

    .ring-bar {
      fill: transparent;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 251.2;
      stroke-dashoffset: 251.2;
      transition: stroke-dashoffset 0.6s ease-in-out;
    }

    .spiritual .ring-bar { stroke: var(--accent-emerald); }
    .tech .ring-bar { stroke: var(--accent-blue); }
    .health .ring-bar { stroke: var(--accent-amber); }
    .career .ring-bar { stroke: var(--accent-purple); }

    .radial-text {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .radial-text .percentage {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
      font-family: var(--font-family-title);
      line-height: 1;
    }

    .radial-text .label {
      font-size: 0.6rem;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 2px;
      letter-spacing: 0.05em;
    }

    /* Streaks Design */
    .streaks-card {
      display: flex;
      justify-content: space-around;
      gap: 20px;
      padding: 16px 24px;
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%);
      border-color: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 600px) {
      .streaks-card {
        flex-direction: column;
        gap: 16px;
      }
    }

    .streak-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .streak-icon {
      font-size: 2rem;
    }

    .streak-details {
      display: flex;
      flex-direction: column;
    }

    .streak-details .title {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .streak-details .counter {
      font-size: 1.1rem;
      color: #fff;
      margin-top: 2px;
    }

    .streak-details .counter strong {
      color: var(--accent-emerald);
      font-size: 1.25rem;
      font-family: var(--font-family-title);
      text-shadow: 0 0 10px var(--accent-emerald-glow);
    }

    .streak-item.coding .streak-details .counter strong {
      color: var(--accent-blue);
      text-shadow: 0 0 10px var(--accent-blue-glow);
    }

    /* Todarki Supervision Board */
    .todarki-card {
      border-color: rgba(255, 255, 255, 0.08);
      background: rgba(13, 19, 38, 0.45);
      padding: 24px;
    }

    .todarki-header {
      margin-bottom: 20px;
    }

    .todarki-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .todarki-title h3 {
      font-size: 1.15rem;
      font-weight: 800;
    }

    .todarki-emoji {
      font-size: 1.4rem;
    }

    .todarki-sub {
      font-size: 0.82rem;
      color: #64748b;
    }

    .todarki-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 12px;
    }

    @media (max-width: 800px) {
      .todarki-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    @media (max-width: 500px) {
      .todarki-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .todarki-day-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .todarki-day-card:hover {
      background: rgba(255, 255, 255, 0.04);
      transform: translateY(-1px);
    }

    .todarki-day-card.is-today {
      border: 1.5px dashed var(--accent-cyan);
      background: rgba(6, 182, 212, 0.03);
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.1);
    }

    .day-label {
      font-size: 0.9rem;
      font-weight: 800;
      color: #fff;
    }

    .date-label {
      font-size: 0.65rem;
      color: #475569;
      margin-top: 2px;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .day-metrics {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.01);
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .metric-item .icon {
      font-size: 0.85rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      display: inline-block;
    }

    .status-dot.success {
      background: var(--accent-emerald);
      box-shadow: 0 0 6px var(--accent-emerald);
    }

    .score-tag {
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748b;
    }

    .score-tag.complete {
      color: var(--accent-emerald);
      font-weight: 800;
    }

    .score-text {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent-cyan);
    }
  `]
})
export class OverviewComponent {
  readonly lifestyleService = inject(LifestyleService);
  
  // Lists
  weeklyHistory = this.lifestyleService.weeklyHistory;
  prayerStreak = this.lifestyleService.prayerStreak;
  codingStreak = this.lifestyleService.codingStreak;
  
  todayKey = signal<string>(this.lifestyleService.getTodayDateKey());

  // Active Project variables
  activeProjectName = computed(() => {
    const p = this.lifestyleService.activeProject();
    return p ? p.name : 'No Project';
  });

  // 1. Spiritual stats
  prayersDone = computed(() => {
    const s = this.lifestyleService.dailyTrack().salah;
    return (s.fajr ? 1 : 0) + (s.dhuhr ? 1 : 0) + (s.asr ? 1 : 0) + (s.maghrib ? 1 : 0) + (s.isha ? 1 : 0);
  });
  
  spiritualPercent = computed(() => {
    return Math.round((this.prayersDone() / 5) * 100);
  });

  spiritualOffset = computed(() => {
    return this.calculateOffset(this.spiritualPercent());
  });

  // 2. Habits stats
  habitsDone = computed(() => {
    const h = this.lifestyleService.dailyTrack().habits;
    return (h.coding ? 1 : 0) + (h.problemSolving ? 1 : 0) + (h.revision ? 1 : 0) + (h.exercise ? 1 : 0) + (h.sleep ? 1 : 0) + (h.phone ? 1 : 0);
  });

  habitsPercent = computed(() => {
    return Math.round((this.habitsDone() / 6) * 100);
  });

  habitsOffset = computed(() => {
    return this.calculateOffset(this.habitsPercent());
  });

  // 3. Health & Fitness stats
  healthPercent = computed(() => {
    const t = this.lifestyleService.dailyTrack();
    let score = 0;
    let max = 8;
    
    if (t.food.egg) score++;
    if (t.food.fish) score++;
    if (t.food.almond) score++;
    if (t.food.fruits) score++;
    
    if (!t.avoid.junk) score++;
    if (!t.avoid.sugary) score++;
    if (!t.avoid.lateNight) score++;

    const waterRatio = Math.min(t.food.water / 3, 1);
    score += waterRatio;

    return Math.round((score / max) * 100);
  });

  healthOffset = computed(() => {
    return this.calculateOffset(this.healthPercent());
  });

  lifestyleScoreText = computed(() => {
    const water = this.lifestyleService.dailyTrack().food.water;
    return `ফুড ব্যালেন্স + ${water}L পানি পান`;
  });

  // 4. Active Project stats
  completedProjectTasksCount = computed(() => {
    const p = this.lifestyleService.activeProject();
    if (!p) return 0;
    return p.tasks.filter(t => t.completed).length;
  });

  totalProjectTasksCount = computed(() => {
    const p = this.lifestyleService.activeProject();
    if (!p) return 0;
    return p.tasks.length;
  });

  projectPercent = computed(() => {
    const total = this.totalProjectTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedProjectTasksCount() / total) * 100);
  });

  projectOffset = computed(() => {
    return this.calculateOffset(this.projectPercent());
  });

  private calculateOffset(percent: number): number {
    const r = 40;
    const circumference = 2 * Math.PI * r;
    return circumference - (percent / 100) * circumference;
  }

  onProfileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.lifestyleService.profileImage.set(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  formatDateSub(dateStr: string): string {
    try {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}`;
    } catch (e) {
      return dateStr;
    }
  }
}
