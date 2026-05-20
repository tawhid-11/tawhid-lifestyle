import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifestyleService } from '../../services/lifestyle.service';

interface Translatable {
  en: string;
  bn: string;
}

interface DaySchedule {
  id: string;
  name: Translatable;
  theme: Translatable;
  officeHours: Translatable;
  morningBlock: Translatable[];
  officeFocus?: Translatable[];
  nightBlock?: Translatable[];
  color: string;
}

@Component({
  selector: 'app-schedule-view',
  imports: [CommonModule],
  template: `
    <div class="schedule-section glass-card animated-fade-in">
      <div class="section-header">
        <div class="title-area">
          <h2>{{ isEn() ? '📅 7-Day Master Schedule Planner' : '📅 ৭ দিনের মাস্টার শিডিউল প্ল্যানার' }}</h2>
          <p>{{ isEn() ? 'A highly detailed balanced routine for work and self-improvement.' : 'আপনার কাজের সময় এবং আত্মউন্নয়ন সেশনের বিস্তারিত ব্যালেন্সড রুটিন।' }}</p>
        </div>
        <div class="today-indicator">
          {{ isEn() ? 'Today:' : 'আজকের দিন:' }} <span class="badge" [style.background]="schedules[activeDayIndex()].color">{{ isEn() ? schedules[activeDayIndex()].name.en : schedules[activeDayIndex()].name.bn }}</span>
        </div>
      </div>

      <!-- Days Tabs -->
      <div class="tabs-scroll">
        <div class="days-tabs">
          @for (day of schedules; track day.id; let idx = $index) {
            <button 
              class="tab-btn" 
              [class.active]="activeDayIndex() === idx"
              [class.is-today]="todayIndex === idx"
              (click)="activeDayIndex.set(idx)"
              [style.--active-color]="day.color"
            >
              <span class="day-dot" [style.background]="day.color"></span>
              <span class="day-txt">{{ isEn() ? day.name.en : day.name.bn }}</span>
              @if (todayIndex === idx) {
                <span class="today-badge">TODAY</span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Schedule Content Panel -->
      @if (schedules[activeDayIndex()]; as selectedDay) {
        <div class="schedule-panel animated-fade-in" [style.border-left-color]="selectedDay.color">
          
          <!-- Top Theme Ribbon -->
          <div class="theme-ribbon" [style.background]="selectedDay.color + '15'" [style.color]="selectedDay.color">
            <span class="emoji">🔥</span>
            <span class="theme-title"><strong>{{ isEn() ? 'Main Theme:' : 'মূল থিম:' }}</strong> {{ isEn() ? selectedDay.theme.en : selectedDay.theme.bn }}</span>
          </div>

          <!-- Schedule Layout Grid -->
          <div class="schedule-layout">
            
            <!-- Left Info Block -->
            <div class="info-block">
              <div class="time-card">
                <span class="label">{{ isEn() ? '🏢 Office Hours' : '🏢 অফিস সময়কাল' }}</span>
                <span class="value">{{ isEn() ? selectedDay.officeHours.en : selectedDay.officeHours.bn }}</span>
              </div>
            </div>

            <!-- Right Detail Blocks -->
            <div class="routine-blocks">
              
              <!-- Morning Routine -->
              @if (selectedDay.morningBlock && selectedDay.morningBlock.length > 0) {
                <div class="routine-section">
                  <div class="section-title">
                    <span class="indicator morning"></span>
                    <h4>{{ isEn() ? '🌅 Morning Power Block' : '🌅 সকালের পাওয়ার ব্লক' }}</h4>
                  </div>
                  <ul class="routine-list">
                    @for (item of selectedDay.morningBlock; track item.en) {
                      <li>
                        <span class="bullet-point"></span>
                        <span class="item-text">{{ isEn() ? item.en : item.bn }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Office Routine / Focus -->
              @if (selectedDay.officeFocus && selectedDay.officeFocus.length > 0) {
                <div class="routine-section">
                  <div class="section-title">
                    <span class="indicator office"></span>
                    <h4>{{ isEn() ? '💼 Work & Development Focus' : '💼 অফিস ও কাজের ফোকাস' }}</h4>
                  </div>
                  <ul class="routine-list">
                    @for (item of selectedDay.officeFocus; track item.en) {
                      <li>
                        <span class="bullet-point"></span>
                        <span class="item-text">{{ isEn() ? item.en : item.bn }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Night Routine -->
              @if (selectedDay.nightBlock && selectedDay.nightBlock.length > 0) {
                <div class="routine-section">
                  <div class="section-title">
                    <span class="indicator night"></span>
                    <h4>{{ isEn() ? '🌃 Night Sync & Revision' : '🌃 রাতের রিভিশন ও প্ল্যান' }}</h4>
                  </div>
                  <ul class="routine-list">
                    @for (item of selectedDay.nightBlock; track item.en) {
                      <li>
                        <span class="bullet-point"></span>
                        <span class="item-text">{{ isEn() ? item.en : item.bn }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

            </div>

          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      min-width: 0;
    }

    .schedule-section {
      border: 1px solid var(--glass-border);
      height: 100%;
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
      margin-bottom: 6px;
    }

    .today-indicator {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 500;
    }

    :root[data-theme="light"] .today-indicator {
      color: #475569;
    }

    .today-indicator .badge {
      color: #fff !important;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
      margin-left: 6px;
    }

    /* Scrollable Tabs Wrapper */
    .tabs-scroll {
      width: 100%;
      overflow-x: auto;
      margin-bottom: 24px;
      padding-bottom: 6px;
    }

    .days-tabs {
      display: flex;
      gap: 10px;
      min-width: max-content;
    }

    .tab-btn {
      background: rgba(100, 100, 100, 0.05);
      border: 1px solid var(--glass-border);
      padding: 10px 18px;
      border-radius: 12px;
      color: #94a3b8;
      font-family: var(--font-family-title);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition-smooth);
      position: relative;
    }
    
    :root[data-theme="light"] .tab-btn {
      color: #475569;
    }

    .tab-btn:hover {
      background: rgba(100, 100, 100, 0.1);
      border-color: var(--glass-border-hover);
    }

    .tab-btn.active {
      background: var(--active-color);
      border-color: var(--active-color);
      color: #fff !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .tab-btn.is-today {
      border: 1.5px dashed var(--accent-cyan);
    }

    .day-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .tab-btn.active .day-dot {
      background: #fff !important;
    }

    .today-badge {
      font-size: 0.6rem;
      font-weight: 800;
      background: #0f172a;
      color: var(--accent-cyan);
      padding: 1px 4px;
      border-radius: 4px;
      margin-left: 4px;
      border: 1.5px solid var(--accent-cyan);
    }

    /* Panel Styling */
    .schedule-panel {
      border-left: 4px solid #fff;
      padding-left: 20px;
      background: rgba(100, 100, 100, 0.02);
      border-radius: 0 12px 12px 0;
      transition: var(--transition-smooth);
    }

    .theme-ribbon {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .schedule-layout {
      display: grid;
      grid-template-columns: 1.2fr 3fr;
      gap: 28px;
    }

    @media (max-width: 768px) {
      .schedule-layout {
        grid-template-columns: 1fr;
      }
    }

    .time-card {
      background: rgba(100, 100, 100, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }

    .time-card .label {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    :root[data-theme="light"] .time-card .label {
      color: #64748b;
    }

    .time-card .value {
      font-size: 1.15rem;
      font-weight: 800;
      font-family: var(--font-family-title);
    }

    /* Routine Details */
    .routine-blocks {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .routine-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title h4 {
      font-size: 0.95rem;
      font-weight: 700;
    }

    .indicator {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }

    .indicator.morning { background: var(--accent-amber); }
    .indicator.office { background: var(--accent-blue); }
    .indicator.night { background: var(--accent-purple); }

    .routine-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 20px;
    }

    .routine-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.5;
    }

    .bullet-point {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #64748b;
      display: inline-block;
      margin-top: 8px;
      flex-shrink: 0;
    }

    .item-text {
      font-size: 0.88rem;
      color: #94a3b8;
      font-weight: 500;
    }
    
    :root[data-theme="light"] .item-text {
      color: #475569;
    }
  `]
})
export class ScheduleViewComponent implements OnInit {
  readonly lifestyleService = inject(LifestyleService);
  activeDayIndex = signal<number>(0);
  todayIndex = 0;

  isEn() {
    return this.lifestyleService.language() === 'en';
  }

  readonly schedules: DaySchedule[] = [
    {
      id: 'sun',
      name: { en: 'Sunday', bn: 'রবিবার (Sunday)' },
      theme: { en: 'Discipline & Stability Setup', bn: 'শৃংখলা ও স্টেবিলাইজেশন' },
      officeHours: { en: '9:30 AM – 7:30 PM (Onsite)', bn: '৯:৩০ সকাল – ৭:৩০ রাত (অফিস)' },
      morningBlock: [
        { en: '🕌 Perform Fajr Salah with absolute mindfulness and recite Quran.', bn: '🕌 ফজরের নামাজ মনোযোগের সাথে পড়া এবং কোরআন তেলাওয়াত করা।' },
        { en: '🚶 30 minutes of light cardio/walking to energize the body and clear the mind.', bn: '🚶 ৩০ মিনিট হালকা কার্ডিও বা হাঁটা, যাতে শরীর ও মন সতেজ হয়।' },
        { en: '🎯 Review weekly goals in the journal. Write down 3 non-negotiable tasks for the day.', bn: '🎯 ডায়েরিতে সাপ্তাহিক লক্ষ্য রিভিউ করা এবং আজকের ৩টি আবশ্যক টাস্ক লিখে ফেলা।' }
      ],
      officeFocus: [
        { en: '💻 Execute core tasks using 25m Pomodoro sessions. Avoid multi-tasking.', bn: '💻 ২৫ মিনিটের পোমোডোরো সেশন ব্যবহার করে মূল কাজগুলো শেষ করা। মাল্টিটাস্কিং এড়িয়ে চলা।' },
        { en: '🚫 Keep phone in DND mode. Check social media only during the 5m breaks.', bn: '🚫 ফোন DND মোডে রাখা। শুধুমাত্র ৫ মিনিটের ব্রেকে সোশ্যাল মিডিয়া চেক করা।' }
      ],
      nightBlock: [
        { en: '🔄 20m memory recall: Review what new concepts were learned today.', bn: '🔄 ২০ মিনিট মেমরি রিকল: আজকে অফিসে কী নতুন শিখলাম তার রিভিউ করা।' },
        { en: '📅 Outline the schedule and technical tasks for tomorrow morning.', bn: '📅 আগামীকালের সকালের কাজের রুটিন ও টেকনিক্যাল টাস্ক প্ল্যান করা।' }
      ],
      color: '#3b82f6' // Blue
    },
    {
      id: 'mon',
      name: { en: 'Monday', bn: 'সোমবার (Monday)' },
      theme: { en: 'Heavy Skill Building (Brain Pressure → Growth)', bn: 'স্কিল ডেভেলপমেন্ট ও ব্রেইন গ্রোথ' },
      officeHours: { en: '1:00 PM – 11:30 PM (Onsite)', bn: '১:০০ দুপুর – ১১:৩০ রাত (অফিস)' },
      morningBlock: [
        { en: '🕌 Begin with Fajr and Bismillah. Set strong intentions for the day.', bn: '🕌 ফজর ও বিসমিল্লাহ দিয়ে শুরু করা। দিনের কাজের জন্য মজবুত নিয়ত করা।' },
        { en: '💻 1 Hour Core Practice: Build a small feature strictly without looking at tutorials.', bn: '💻 ১ ঘণ্টা কোর প্র্যাকটিস: টিউটোরিয়াল না দেখে সম্পূর্ণ নিজে একটি ছোট ফিচার বানানো।' },
        { en: '🛠️ 1 Hour Project: Work on any project(Focus on API endpoints).', bn: '🛠️ ১ ঘণ্টা প্রজেক্ট: অ্যাপয়েন্টমেন্ট সিস্টেমের কাজ করা (API এন্ডপয়েন্টে ফোকাস)।' },
        { en: '🧠 1 Hour Coding: Solve 2 LeetCode Medium problems (Focus on Array & HashMaps).', bn: '🧠 ১ ঘণ্টা Coding: ২টি লিটকোড মিডিয়াম প্রবলেম সলভ করা (Array ও HashMap ফোকাস)।' }
      ],
      officeFocus: [
        { en: '🏢 Apply newly learned design patterns to office codebase actively.', bn: '🏢 নতুন শেখা ডিজাইন প্যাটার্নগুলো অফিসের কোডবেসে অ্যাপ্লাই করা।' },
        { en: '💬 Communicate blockers clearly to the team during stand-ups.', bn: '💬 স্ট্যান্ড-আপ মিটিংয়ে নিজের ব্লকারগুলো টিমের কাছে পরিষ্কারভাবে তুলে ধরা।' }
      ],
      nightBlock: [
        { en: '🔄 Document the hardest bug faced today and how it was solved.', bn: '🔄 আজকে ফেস করা সবচেয়ে কঠিন বাগটি কীভাবে ফিক্স করেছি তা লিখে রাখা।' }
      ],
      color: '#8b5cf6' // Purple
    },
    {
      id: 'tue',
      name: { en: 'Tuesday', bn: 'মঙ্গলবার (Tuesday)' },
      theme: { en: 'Logic & Critical Thinking Focus', bn: 'লজিক ও ক্রিটিক্যাল থিংকিং' },
      officeHours: { en: '1:00 PM – 11:30 PM (Onsite)', bn: '১:০০ দুপুর – ১১:৩০ রাত (অফিস)' },
      morningBlock: [
        { en: '🕌 Fajr prayer followed by a 15-minute stretching routine.', bn: '🕌 ফজরের নামাজ এবং এরপর ১৫ মিনিট বডি স্ট্রেচিং।' },
        { en: '🧠 Coding Deep Dive: Practice Two Pointers and Sliding Window techniques.', bn: '🧠 Coding ডিপ ডাইভ: Two Pointers এবং Sliding Window টেকনিক প্র্যাকটিস করা।' },
        { en: '⚙️ Architecture Study: Read an article on backend scaling or database indexing.', bn: '⚙️ আর্কিটেকচার স্টাডি: ব্যাকএন্ড স্কেলিং বা ডেটাবেস ইনডেক্সিং নিয়ে আর্টিকেল পড়া।' },
        { en: '🔌 Backend Revision: Refactor yesterday’s API code for better performance.', bn: '🔌 ব্যাকএন্ড রিভিশন: পারফরম্যান্স বাড়াতে গতদিনের API কোড রিফ্যাক্টর করা।' }
      ],
      officeFocus: [
        { en: '🏢 Focus on delivering office tickets with zero QA bugs.', bn: '🏢 জিরো QA বাগ সহ অফিসের রিলিজ টাস্কগুলো ডেলিভার করার চেষ্টা করা।' }
      ],
      nightBlock: [
        { en: '🌙 5-minute journal: Write down 1 mistake made today and how to avoid it.', bn: '🌙 ৫ মিনিটের ডায়েরি: আজকের ১টি ভুল লেখা এবং ভবিষ্যতে তা কীভাবে এড়ানো যায় তা ভাবা।' }
      ],
      color: '#f59e0b' // Amber
    },
    {
      id: 'wed',
      name: { en: 'Wednesday', bn: 'বুধবার (Wednesday)' },
      theme: { en: 'Project Execution & Output Day', bn: 'প্রজেক্ট এক্সিকিউশন ও আউটপুট' },
      officeHours: { en: '1:00 PM – 11:30 PM (Onsite)', bn: '১:০০ দুপুর – ১১:৩০ রাত (অফিস)' },
      morningBlock: [
        { en: '🕌 Fajr prayer and intense focus initialization.', bn: '🕌 ফজরের নামাজ এবং ইনটেন্স ফোকাস মোড অন করা।' },
        { en: '🛠️ Project Sprint: Complete the doctor availability calendar UI integration.', bn: '🛠️ প্রজেক্ট স্প্রিন্ট: ডক্টর এভেইলেবিলিটি ক্যালেন্ডারের UI ইন্টিগ্রেশন শেষ করা।' },
        { en: '🐛 Bug Squashing: Profile the app and fix any memory leaks or slow queries.', bn: '🐛 বাগ ফিক্সিং: অ্যাপ প্রোফাইলিং করা এবং স্লো কুয়েরি বা মেমরি লিক ফিক্স করা।' },
        { en: '🐙 Git Flow: Practice rebasing, squashing commits, and writing clean PRs.', bn: '🐙 গিট ফ্লো: রিবেসিং, কমিট স্কোয়াশ এবং ক্লিন PR লেখা প্র্যাকটিস করা।' }
      ],
      officeFocus: [
        { en: '💻 Code Release: Ensure all branch merges are clean and CI/CD passes.', bn: '💻 কোড রিলিজ: সকল ব্রাঞ্চ মার্জ ক্লিন রাখা এবং CI/CD পাস করানো।' }
      ],
      nightBlock: [
        { en: '🔄 Review the output of the project sprint. Did we hit the milestone?', bn: '🔄 প্রজেক্ট স্প্রিন্টের আউটপুট রিভিউ করা। আজকের মাইলস্টোন কি অর্জিত হয়েছে?' }
      ],
      color: '#06b6d4' // Cyan
    },
    {
      id: 'thu',
      name: { en: 'Thursday', bn: 'বৃহস্পতিবার (Thursday)' },
      theme: { en: 'Remote Deep Work & Learning', bn: 'রিমোট ডিপ ওয়ার্ক ও লার্নিং' },
      officeHours: { en: '2:00 PM – 10:00 PM (Remote)', bn: '২:০০ দুপুর – ১০:০০ রাত (রিমোট)' },
      morningBlock: [
        { en: '🕌 Fajr prayer followed by 45 minutes of deep reading (Tech Book).', bn: '🕌 ফজরের নামাজ এবং এরপর ৪৫ মিনিট গভীর টেকনিক্যাল বই পড়া।' },
        { en: '🏛️ System Design: Map out the architecture for a scalable chat application.', bn: '🏛️ সিস্টেম ডিজাইন: একটি স্কেলেবল চ্যাট অ্যাপ্লিকেশনের আর্কিটেকচার ডিজাইন করা।' },
        { en: '🌐 API Security: Implement JWT refresh tokens and rate limiting in the side project.', bn: '🌐 API সিকিউরিটি: প্রজেক্টে JWT রিফ্রেশ টোকেন এবং রেট লিমিটিং ইমপ্লিমেন্ট করা।' },
        { en: '💻 Open Source / Advanced Problem Solving for 1.5 hours.', bn: '💻 ১.৫ ঘণ্টা অ্যাডভান্সড প্রবলেম সলভিং বা ওপেন সোর্স কোড ঘাঁটাঘাঁটি করা।' }
      ],
      officeFocus: [
        { en: '💼 Remote Collaboration: Over-communicate with the team via Slack/Jira.', bn: '💼 রিমোট ডিউটি: স্ল্যাক/জিরায় টিমের সাথে ক্লিয়ার কমিউনিকেশন বজায় রাখা।' }
      ],
      nightBlock: [
        { en: '📝 Write a small tech blog draft or LinkedIn post about today’s learning.', bn: '📝 আজকের শেখা বিষয় নিয়ে ছোট একটি টেক ব্লগ বা লিংকডইন পোস্টের ড্রাফট তৈরি করা।' }
      ],
      color: '#ec4899' // Pink
    },
    {
      id: 'fri',
      name: { en: 'Friday', bn: 'শুক্রবার (Friday)' },
      theme: { en: 'Recovery, Family & Spiritual Reset', bn: 'রিকভারি, পরিবার ও স্পিরিচুয়াল রিসেট' },
      officeHours: { en: '🚫 Weekly Off-Day', bn: '🚫 সাপ্তাহিক ছুটি' },
      morningBlock: [
        { en: '🕌 Prepare early for Jummah (Ghusl, clean clothes, early arrival).', bn: '🕌 জুমার জন্য আগে আগে প্রস্তুতি নেওয়া (গোসল, পরিষ্কার কাপড়, আগে মসজিদে যাওয়া)।' },
        { en: '💤 Catch up on sleep debt. Allow the brain to completely disconnect from code.', bn: '💤 পর্যাপ্ত ঘুমিয়ে ব্রেইনকে রিলাক্স করা। কোডিং থেকে পুরোপুরি দূরে থাকা।' },
        { en: '🏋️ 1-hour moderate physical workout (Gym or sports).', bn: '🏋️ ১ ঘণ্টা ফিজিক্যাল ওয়ার্কআউট (জিম বা খেলাধুলা)।' }
      ],
      officeFocus: [
        { en: '👨‍👩‍👦 Spend quality, uninterrupted time with family and parents.', bn: '👨‍👩‍👦 পরিবার এবং বাবা-মায়ের সাথে আনইন্টারাপ্টেড কোয়ালিটি টাইম কাটানো।' }
      ],
      nightBlock: [
        { en: '📊 Weekly Review: Analyze habit tracker. Where did I fail this week?', bn: '📊 উইকলি রিভিউ: হ্যাবিট ট্র্যাকার অ্যানালাইজ করা। এই সপ্তাহে কোথায় ঘাটতি ছিল?' },
        { en: '💻 Light coding / Read tech newsletters to stay updated (No heavy work).', bn: '💻 হালকা কোডিং বা টেক নিউজলেটার পড়া (কোনো ভারী বা ব্রেইন-পেশার কাজ নয়)।' }
      ],
      color: '#10b981' // Emerald
    },
    {
      id: 'sat',
      name: { en: 'Saturday', bn: 'শনিবার (Saturday)' },
      theme: { en: 'Master Day 🔥 (Improvement Explosion)', bn: 'মাস্টার ডে 🔥 (ইমপ্রুভমেন্ট এক্সপ্লোশন)' },
      officeHours: { en: '🚫 Weekly Off-Day', bn: '🚫 সাপ্তাহিক ছুটি' },
      morningBlock: [
        { en: '🕌 Fajr prayer, Morning Walk, and highly caffeinated deep work entry.', bn: '🕌 ফজর, প্রাতঃভ্রমণ এবং এরপর হাই-ফোকাস ডিপ ওয়ার্ক সেশনে প্রবেশ।' },
        { en: '🧠 3-Hour Programming Marathon: Solve minimum 5 problems completely unassisted.', bn: '🧠 ৩-ঘণ্টা DSA ম্যারাথন: কারো সাহায্য ছাড়াই অন্তত ৫টি প্রবলেম সলভ করা।' },
        { en: '💻 2-Hour Core Development: Finish the hardest pending feature of the portfolio.', bn: '💻 ২-ঘণ্টা কোর ডেভেলপমেন্ট: পোর্টফোলিওর সবচেয়ে কঠিন ফিচারটি তৈরি করে ফেলা।' }
      ],
      officeFocus: [
        { en: '🛠️ Any working Projects: Push the final build to production server.', bn: '🛠️  ফাইনাল বিল্ড প্রোডাকশন সার্ভারে ডিপ্লয় করা।' }
      ],
      nightBlock: [
        { en: '📝 Write the absolute comprehensive weekly review. Set brutal goals for next week.', bn: '📝 সম্পূর্ণ সপ্তাহের বিস্তারিত রিভিউ লেখা। আগামী সপ্তাহের জন্য কঠিন ও ক্লিয়ার লক্ষ্য সেট করা।' },
        { en: '📅 Block out the calendar for Monday. Sleep early.', bn: '📅 সোমবারের জন্য ক্যালেন্ডার ব্লক করে রাখা এবং তাড়াতাড়ি ঘুমিয়ে পড়া।' }
      ],
      color: '#f43f5e' // Rose
    }
  ];

  ngOnInit() {
    // Detect current day of week (0=Sunday, 1=Monday... 6=Saturday)
    const today = new Date().getDay();
    this.todayIndex = today;
    this.activeDayIndex.set(today);
  }
}
