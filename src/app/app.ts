import { Component } from '@angular/core';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header';
import { OverviewComponent } from './components/overview/overview';
import { ScheduleViewComponent } from './components/schedule-view/schedule-view';
import { HabitsTrackerComponent } from './components/habits-tracker/habits-tracker';
import { PomodoroTimerComponent } from './components/pomodoro-timer/pomodoro-timer';
import { DsaProjectsComponent } from './components/dsa-projects/dsa-projects';
import { ReflectionsDiaryComponent } from './components/reflections-diary/reflections-diary';
import { AuthModalComponent } from './components/auth-modal/auth-modal';

@Component({
  selector: 'app-root',
  imports: [
    DashboardHeaderComponent,
    OverviewComponent,
    ScheduleViewComponent,
    HabitsTrackerComponent,
    PomodoroTimerComponent,
    DsaProjectsComponent,
    ReflectionsDiaryComponent,
    AuthModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
