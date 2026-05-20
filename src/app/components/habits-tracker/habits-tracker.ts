import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LifestyleService } from '../../services/lifestyle.service';

@Component({
  selector: 'app-habits-tracker',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="habits-section grid-container animated-fade-in">
      
      <!-- Spiritual Track Card -->
      <div class="glass-card habit-card spiritual-discipline">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon">🕌</span>
            <h3> Spiritual Discipline</h3>
          </div>
          <span class="status-badge spiritual">Daily 5 Prayers</span>
        </div>
        <p class="desc">Mental stability, self-control, and the source of deep focus power.</p>
        
        <div class="trackers-list">
          
          <!-- Bismillah Intent Check -->
          <div class="intent-block" [class.checked]="track().bismillah" (click)="lifestyleService.toggleBismillah()">
            <div class="intent-icon">✨</div>
            <div class="intent-text">
              <strong>Day Start:</strong> "Bismillah + Intention to Improve" (নিয়ত সহ Bismillah দিয়ে দিন শুরু করা)
            </div>
            <div class="intent-check">
              @if (track().bismillah) {
                <span class="check-mark">✓</span>
              }
            </div>
          </div>

          <!-- Salah Checks -->
          <div class="salah-grid">
            <label class="custom-checkbox spiritual">
              <input type="checkbox" [checked]="track().salah.fajr" (change)="lifestyleService.toggleSalah('fajr')">
              <span class="checkmark"></span>
              <span class="checkbox-label">ফজর (Fajr)</span>
            </label>

            <label class="custom-checkbox spiritual">
              <input type="checkbox" [checked]="track().salah.dhuhr" (change)="lifestyleService.toggleSalah('dhuhr')">
              <span class="checkmark"></span>
              <span class="checkbox-label">যোহর (Dhuhr)</span>
            </label>

            <label class="custom-checkbox spiritual">
              <input type="checkbox" [checked]="track().salah.asr" (change)="lifestyleService.toggleSalah('asr')">
              <span class="checkmark"></span>
              <span class="checkbox-label">আসর (Asr)</span>
            </label>

            <label class="custom-checkbox spiritual">
              <input type="checkbox" [checked]="track().salah.maghrib" (change)="lifestyleService.toggleSalah('maghrib')">
              <span class="checkmark"></span>
              <span class="checkbox-label">মাগরিব (Maghrib)</span>
            </label>

            <label class="custom-checkbox spiritual">
              <input type="checkbox" [checked]="track().salah.isha" (change)="lifestyleService.toggleSalah('isha')">
              <span class="checkmark"></span>
              <span class="checkbox-label">এশা (Isha)</span>
            </label>
          </div>

        </div>
      </div>

      <!-- Daily Core Rules Card -->
      <div class="glass-card habit-card core-rules">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon">🧠</span>
            <h3>Core Rules (Everyday Minimums)</h3>
          </div>
          <span class="status-badge tech">Mandatory Rules</span>
        </div>
        <p class="desc">Brain development and memory retention enhancement daily checklist.</p>
        
        <div class="trackers-list vertical">
          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.coding" (change)="lifestyleService.toggleHabit('coding')">
            <span class="checkmark"></span>
            <span class="checkbox-label">💻 1-2 hours of pure coding practice</span>
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.problemSolving" (change)="lifestyleService.toggleHabit('problemSolving')">
            <span class="checkmark"></span>
            <span class="checkbox-label">🧠 1 problem-solving session (Logic)</span>
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.revision" (change)="lifestyleService.toggleHabit('revision')">
            <span class="checkmark"></span>
            <span class="checkbox-label">🔄 1 revision session (Memory Training)</span>
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.exercise" (change)="lifestyleService.toggleHabit('exercise')">
            <span class="checkmark"></span>
            <span class="checkbox-label">🏋️ 20-40 minutes of walking or body exercise</span>
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.sleep" (change)="lifestyleService.toggleHabit('sleep')">
            <span class="checkmark"></span>
            <span class="checkbox-label">💤 7+ hours of sufficient sleep</span>
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" [checked]="track().habits.phone" (change)="lifestyleService.toggleHabit('phone')">
            <span class="checkmark"></span>
            <span class="checkbox-label">📱 Controlled Mobile Phone Usage</span>
          </label>
        </div>
      </div>

      <!-- Food & Body System Card -->
      <div class="glass-card habit-card food-fitness">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon">🥗</span>
            <h3>Food & Fitness Fuel (Brain Fuel)</h3>
          </div>
          <span class="status-badge health">Health Intelligence</span>
        </div>
        <p class="desc">To avoid brain fog, it's essential to maintain correct food habits and hydration.</p>
        
        <div class="food-sections">
          
          <!-- Must Eat Items -->
          <div class="food-group">
            <h5>🟢 Daily Food List (Must Eat):</h5>
            <div class="food-checks">
              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().food.egg" (change)="lifestyleService.toggleFood('egg')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🥚 Egg</span>
              </label>

              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().food.fish" (change)="lifestyleService.toggleFood('fish')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🐟 Fish</span>
              </label>
               <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().food.meat" (change)="lifestyleService.toggleFood('meat')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🍖 Meat</span>
              </label>

              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().food.almond" (change)="lifestyleService.toggleFood('almond')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🥜 Almond</span>
              </label>

              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().food.fruits" (change)="lifestyleService.toggleFood('fruits')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🍎 Fruits</span>
              </label>
            </div>
          </div>

          <!-- Water Slider -->
          <div class="water-section">
            <div class="water-info">
              <h5>💧 Water intake:</h5>
              <span class="water-value">{{ track().food.water }}L / 3L Target</span>
            </div>
            <div class="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="4" 
                step="0.5" 
                [ngModel]="track().food.water"
                (ngModelChange)="onWaterChange($event)"
                class="water-slider" 
              />
              <div class="water-ticks">
                <span>0L</span>
                <span>1L</span>
                <span>2L</span>
                <span>3L</span>
                <span>4L</span>
              </div>
            </div>
          </div>

          <!-- Avoid Items -->
          <div class="food-group avoid-group">
            <h5>🔴 Items to Avoid (Avoid list):</h5>
            <div class="food-checks">
              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().avoid.junk" (change)="lifestyleService.toggleAvoid('junk')">
                <span class="checkmark"></span>
                <span class="checkbox-label">❌ Junk Food</span>
              </label>

              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().avoid.sugary" (change)="lifestyleService.toggleAvoid('sugary')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🥤 Sugary Drinks</span>
              </label>

              <label class="custom-checkbox health">
                <input type="checkbox" [checked]="track().avoid.lateNight" (change)="lifestyleService.toggleAvoid('lateNight')">
                <span class="checkmark"></span>
                <span class="checkbox-label">🍗 Heavy Meals at Night </span>
              </label>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .habits-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    @media (max-width: 1100px) {
      .habits-section {
        grid-template-columns: 1fr;
      }
    }

    .habit-card {
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
    }

    .habit-card .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-icon {
      font-size: 1.4rem;
    }

    .habit-card .card-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
    }

    .status-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge.spiritual {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge.tech {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .status-badge.health {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .habit-card .desc {
      font-size: 0.82rem;
      color: #94a3b8;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .trackers-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-grow: 1;
    }

    .trackers-list.vertical {
      gap: 14px;
    }

    /* Intent Block */
    .intent-block {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .intent-block:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .intent-block.checked {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.25);
    }

    .intent-icon {
      font-size: 1.3rem;
    }

    .intent-text {
      font-size: 0.85rem;
      color: #cbd5e1;
      flex-grow: 1;
      line-height: 1.4;
    }

    .intent-check {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .intent-block.checked .intent-check {
      background: var(--accent-emerald);
      border-color: var(--accent-emerald);
      color: #fff;
      box-shadow: 0 0 8px var(--accent-emerald-glow);
    }

    .intent-block.checked .intent-text {
      color: #64748b;
      text-decoration: line-through;
    }

    .check-mark {
      font-size: 0.75rem;
      font-weight: bold;
    }

    /* Salah Grid */
    .salah-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 4px;
      background: rgba(255, 255, 255, 0.01);
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .checkbox-label {
      font-size: 0.88rem;
    }

    /* Food & Fitness Section */
    .food-sections {
      display: flex;
      flex-direction: column;
      gap: 18px;
      flex-grow: 1;
    }

    .food-group h5 {
      font-size: 0.82rem;
      color: #cbd5e1;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .food-checks {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .avoid-group {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 16px;
    }

    .avoid-group .food-checks {
      grid-template-columns: 1fr;
    }

    /* Water Section Range Slider */
    .water-section {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      padding: 14px;
      border-radius: 12px;
    }

    .water-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .water-info h5 {
      font-size: 0.82rem;
      color: #cbd5e1;
      margin: 0;
    }

    .water-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }

    .slider-wrapper {
      position: relative;
    }

    .water-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.1);
      outline: none;
      transition: var(--transition-smooth);
    }

    .water-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
    }

    .water-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent-cyan);
      cursor: pointer;
      box-shadow: 0 0 10px var(--accent-cyan-glow);
      margin-top: -6px;
      transition: var(--transition-smooth);
    }

    .water-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    .water-ticks {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
    }
  `]
})
export class HabitsTrackerComponent {
  readonly lifestyleService = inject(LifestyleService);
  readonly track = this.lifestyleService.dailyTrack;

  onWaterChange(liters: number) {
    this.lifestyleService.setWaterIntake(Number(liters));
  }
}
