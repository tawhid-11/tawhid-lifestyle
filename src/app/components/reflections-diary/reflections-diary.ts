import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LifestyleService, Reflection } from '../../services/lifestyle.service';

@Component({
  selector: 'app-reflections-diary',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reflections-section glass-card animated-fade-in">
      <div class="section-header">
        <div class="title-area">
          <h2>📝 End-of-Day Review</h2>
          <p>Reflect on your day and identify areas for improvement.</p>
        </div>
        <span class="status-pill spiritual">Spiritual Growth</span>
      </div>

      <div class="diary-layout">
        
        <!-- Input Form Card (Left) -->
        <div class="diary-form-pane">
          <h4>✍️ Add Reflection</h4>
          <p class="form-sub">Password unlock to record your end-of-day review.</p>
          
          <div class="diary-form">
            <div class="form-group">
              <label for="good">🌟 What did I do well?</label>
              <textarea 
                id="good" 
                [(ngModel)]="newGood" 
                placeholder="What did I do well today? যেমন: আজ ফজরের নামাজে জাগ্রত ছিলাম, ২ ঘণ্টা কোডিং করেছি, স্বাস্থ্যকর খাবার খেয়েছি...." 
                rows="3" 
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="mistake">⚠️ What mistakes did I make?</label>
              <textarea 
                id="mistake" 
                [(ngModel)]="newMistake" 
                placeholder="যেমন: সোশ্যাল মিডিয়ায় বাড়তি ১৫ মিনিট সময়  নষ্ট করেছি..." 
                rows="3" 
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="improve">🚀 কাল কী improve করবো? (How to improve tomorrow?)</label>
              <textarea 
                id="improve" 
                [(ngModel)]="newImprovement" 
                placeholder="যেমন: মোবাইল ফোন রিমোট রুমে চার্জ দেবো, ফোকাস বাড়াতে পমোডোরো রুলস মানবো..." 
                rows="3" 
                class="form-control"
              ></textarea>
            </div>

            <button class="btn-primary btn-submit" (click)="saveReflection()">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-466ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-120H240v120Zm-40-86v466-466Z"/>
              </svg>
              Save Reflection
            </button>
          </div>
        </div>

        <!-- History Display Pane (Right) -->
        <div class="diary-history-pane">
          <h4>📖 History Archive</h4>
          
          <div class="history-list">
            @if (reflectionsList().length === 0) {
              <div class="empty-diary">
                <div class="book-icon">📚</div>
                <p>No past reflections found. Write your end-of-day review to complete the day!</p>
              </div>
            } @else {
              @for (entry of reflectionsList(); track entry.id) {
                <div class="history-card">
                  <div class="card-meta">
                    <span class="meta-date">📅 {{ formatBanglaDate(entry.date) }}</span>
                    <button class="btn-delete" (click)="deleteEntry(entry.id)" title="Delete reflection">
                      <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T720-120H280Zm80-160h80v-320h-80v320Zm160 0h80v-320h-80v320Z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="card-detail">
                    <div class="point-section good-point">
                      <strong>🌟 What did I do well?</strong>
                      <p>{{ entry.good }}</p>
                    </div>
                    <div class="point-section mistake-point">
                      <strong>⚠️ What mistakes did I make?</strong>
                      <p>{{ entry.mistake }}</p>
                    </div>
                    <div class="point-section improve-point">
                      <strong>🚀 How to improve tomorrow?</strong>
                      <p>{{ entry.improvement }}</p>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .reflections-section {
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 1.4rem;
      font-weight: 800;
    }

    .diary-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }

    @media (max-width: 900px) {
      .diary-layout {
        grid-template-columns: 1fr;
      }
    }

    .diary-form-pane h4, .diary-history-pane h4 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 6px;
      color: #fff;
    }

    .form-sub {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 20px;
    }

    .diary-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .form-group textarea {
      font-size: 0.82rem;
      line-height: 1.5;
      resize: vertical;
    }

    .btn-submit {
      width: 100%;
      justify-content: center;
      padding: 12px;
    }

    /* History / Archive */
    .history-list {
      max-height: 520px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-right: 4px;
    }

    .empty-diary {
      text-align: center;
      padding: 48px 16px;
      color: #475569;
      background: rgba(255, 255, 255, 0.01);
      border: 1px dashed rgba(255, 255, 255, 0.08);
      border-radius: 12px;
    }

    .book-icon {
      font-size: 2.2rem;
      margin-bottom: 12px;
    }

    .empty-diary p {
      font-size: 0.85rem;
      font-style: italic;
    }

    .history-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: var(--transition-smooth);
    }

    .history-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 8px;
    }

    .meta-date {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }

    .card-detail {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .point-section {
      font-size: 0.82rem;
      line-height: 1.5;
    }

    .point-section strong {
      display: block;
      margin-bottom: 2px;
    }

    .good-point strong { color: var(--accent-emerald); }
    .mistake-point strong { color: var(--accent-rose); }
    .improve-point strong { color: var(--accent-amber); }

    .point-section p {
      margin: 0;
      color: #94a3b8;
      padding-left: 6px;
    }

    .btn-delete {
      background: transparent;
      border: none;
      color: #475569;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .btn-delete:hover {
      color: var(--accent-rose);
      background: rgba(244, 63, 94, 0.1);
    }
  `]
})
export class ReflectionsDiaryComponent {
  readonly lifestyleService = inject(LifestyleService);
  
  reflectionsList = this.lifestyleService.reflections;

  newGood = '';
  newMistake = '';
  newImprovement = '';

  saveReflection() {
    if (!this.newGood.trim() || !this.newMistake.trim() || !this.newImprovement.trim()) return;

    this.lifestyleService.addReflection(
      this.newGood,
      this.newMistake,
      this.newImprovement
    );

    // Reset fields on success (if authenticated)
    if (this.lifestyleService.isLoggedIn()) {
      this.newGood = '';
      this.newMistake = '';
      this.newImprovement = '';
    }
  }

  deleteEntry(id: string) {
    this.lifestyleService.deleteReflection(id);
  }

  formatBanglaDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      return date.toLocaleDateString('bn-BD', options);
    } catch (e) {
      return dateStr;
    }
  }
}
