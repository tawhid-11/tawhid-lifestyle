import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifestyleService } from '../../services/lifestyle.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [CommonModule],
  template: `
    <header class="header-nav glass-card">
      <div class="header-left">
        <div class="logo-area" (click)="logoInput.click()" style="cursor: pointer;" title="Click to change logo">
          <input type="file" #logoInput style="display: none;" accept="image/*" (change)="onLogoSelected($event)">
          @if (lifestyleService.userLogo()) {
            <img [src]="lifestyleService.userLogo()" class="custom-logo" alt="Logo">
          } @else {
            <div class="logo-icon pulse-glow">T</div>
          }
          <div class="logo-text">
            <h1>Tawhid LifeStyle</h1>
            <p class="subtitle">High Performance & Spiritual Growth</p>
          </div>
        </div>
      </div>

      <div class="header-center">
        <div class="live-clock">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T209-763q54-54 127-85.5T492-880q78 0 148.5 28T763-772l-51 51q-45-38-101.5-58.5T492-800q-133 0-226.5 93.5T172-480q0 133 93.5 226.5T492-160q133 0 226.5-93.5T812-480h80q0 83-31.5 156T775-197q-54 54-127 85.5T480-80Zm-40-360h160v80H480v-240h80v160Z"/>
          </svg>
          <span class="time-text">{{ liveTime() }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Theme Toggle -->
        <button class="icon-btn" (click)="lifestyleService.toggleTheme()" [title]="lifestyleService.theme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          {{ lifestyleService.theme() === 'dark' ? 'D' : 'L' }}
        </button>

        <!-- Language Toggle -->
        <button class="icon-btn" (click)="lifestyleService.toggleLanguage()" [title]="lifestyleService.language() === 'bn' ? 'Switch to English' : 'Switch to Bengali'">
          {{ lifestyleService.language() === 'bn' ? 'Eng' : 'Ban' }}
        </button>

        @if (lifestyleService.isLoggedIn()) {
          <div class="auth-status unlocked pulse-emerald" (click)="lifestyleService.logout()" title="Click to Lock View">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h320v80H240v400h480v-160h80v160q0 33-23.5 56.5T720-80H240Zm400-480v-80q0-83-58.5-141.5T480-920q-83 0-141.5 58.5T280-720h80q0 50 35 85t85 35q50 0 85-35t35-85v80h-80v80h240Zm80-120v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/>
            </svg>
            <span class="status-txt">{{ lifestyleService.language() === 'bn' ? 'এডিট মোড অ্যাক্টিভ' : 'Edit Mode Active' }}</span>
          </div>
        } @else {
          <div class="auth-status locked" (click)="lifestyleService.showLoginModal.set(true)" title="Click to Unlock Editing">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v4₀₀Zm24₀-1₂₀q3₃ ₀ 56.5-23.5T56₀-36₀q₀-3₃-23.5-56.5T48₀-4₄₀q₋₃₃ ₀-56.5 23.5T4₀₀-36₀q₀ 3₃ 23.5 56.5T48₀-28₀ZM36₀-64₀h24₀v-8₀q₀-5₀-3₅-8₅t₋8₅-3₅q₋5₀ ₀-8₅ 3₅t-3₅ 8₅v8₀Z"/>
            </svg>
            <span class="status-txt">{{ lifestyleService.language() === 'bn' ? 'ভিউ মোড (লকড)' : 'View Mode (Locked)' }}</span>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .header-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 28px;
      border-radius: 20px;
      margin-bottom: 24px;
      position: sticky;
      top: 20px;
      z-index: 1000;
    }

    .header-left .logo-area {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-family-title);
      font-weight: 800;
      font-size: 1.4rem;
      color: #fff;
    }

    .logo-text h1 {
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1.1;
      background: linear-gradient(90deg, #fff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-text .subtitle {
      font-size: 0.75rem;
      color: var(--accent-cyan);
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .header-center .live-clock {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 16px;
      border-radius: 30px;
      color: #94a3b8;
      font-family: var(--font-family-title);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .live-clock svg {
      color: var(--accent-blue);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .header-right .auth-status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      border-radius: 30px;
      cursor: pointer;
      font-family: var(--font-family-title);
      font-weight: 600;
      font-size: 0.85rem;
      transition: var(--transition-smooth);
    }

    .auth-status.locked {
      background: rgba(244, 63, 94, 0.1);
      color: var(--accent-rose);
      border: 1px solid rgba(244, 63, 94, 0.25);
    }

    .auth-status.locked:hover {
      background: rgba(244, 63, 94, 0.2);
      border-color: rgba(244, 63, 94, 0.4);
      transform: translateY(-1px);
    }

    .auth-status.unlocked {
      background: rgba(16, 185, 129, 0.1);
      color: var(--accent-emerald);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .auth-status.unlocked:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header-nav {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      .header-center {
        display: flex;
        justify-content: center;
      }
      .header-right {
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class DashboardHeaderComponent implements OnInit, OnDestroy {
onLogoSelected($event: Event) {
throw new Error('Method not implemented.');
}
  readonly lifestyleService = inject(LifestyleService);
  liveTime = signal<string>('');
  private intervalId: any;

  ngOnInit() {
    this.updateClock();
    this.intervalId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateClock() {
    const now = new Date();
    
    // Bangladesh Time Formatting or general clear presentation
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    };
    
    this.liveTime.set(now.toLocaleDateString('EN-BD', options));
  }
}
