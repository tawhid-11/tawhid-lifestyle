import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LifestyleService } from '../../services/lifestyle.service';

@Component({
  selector: 'app-auth-modal',
  imports: [CommonModule, FormsModule],
  template: `
    @if (lifestyleService.showLoginModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content glass-card animated-fade-in" (click)="$event.stopPropagation()" [class.shake]="shake()">
          <div class="modal-header">
            <div class="icon-lock">
              <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill="currentColor">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
              </svg>
            </div>
            <h2>Sign In</h2>
            <p>Enter your password to update your routine, diary, and tracker.</p>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  [(ngModel)]="password" 
                  (keydown.enter)="handleLogin()"
                  placeholder="Password..." 
                  class="form-control"
                  #passwordInput
                />
              </div>
              @if (errorMessage()) {
                <span class="error-msg">{{ errorMessage() }}</span>
              }
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn-primary" (click)="handleLogin()">Unlock</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 6, 12, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .modal-content {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(13, 19, 38, 0.85);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    .shake {
      animation: shakeAnim 0.4s ease-in-out;
    }

    @keyframes shakeAnim {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }

    .modal-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .icon-lock {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.15);
      color: var(--accent-purple);
      margin-bottom: 16px;
      border: 1px solid rgba(139, 92, 246, 0.3);
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 8px;
      font-weight: 700;
    }

    p {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
      margin-bottom: 8px;
    }

    .input-wrapper input {
      font-size: 1rem;
      text-align: center;
      letter-spacing: 0.05em;
    }

    .error-msg {
      display: block;
      margin-top: 8px;
      font-size: 0.8rem;
      color: #f43f5e;
      text-align: center;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .modal-footer button {
      flex: 1;
      justify-content: center;
      padding: 12px;
    }
  `]
})
export class AuthModalComponent {
  readonly lifestyleService = inject(LifestyleService);
  
  password = '';
  shake = signal(false);
  errorMessage = signal('');

  handleLogin() {
    this.errorMessage.set('');
    const success = this.lifestyleService.login(this.password);
    
    if (success) {
      this.password = '';
    } else {
      this.shake.set(true);
      this.errorMessage.set('Invalid password! Please try again. ');
      setTimeout(() => this.shake.set(false), 500);
    }
  }

  closeModal() {
    this.lifestyleService.showLoginModal.set(false);
    this.password = '';
    this.errorMessage.set('');
  }
}
