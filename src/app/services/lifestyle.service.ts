import { Injectable, signal, computed, effect } from '@angular/core';

export interface Reflection {
  id: string;
  date: string;
  good: string;
  mistake: string;
  improvement: string;
}

export interface DsaProblem {
  id: string;
  date: string;
  name: string;
  tag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  notes?: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  category: 'Backend' | 'Database' | 'API' | 'Frontend';
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: ProjectTask[];
}

export interface DailyTrack {
  salah: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  bismillah: boolean;
  habits: {
    coding: boolean;
    problemSolving: boolean;
    revision: boolean;
    exercise: boolean;
    sleep: boolean;
    phone: boolean;
  };
  food: {
meat: any;
    egg: boolean;
    fish: boolean;
    almond: boolean;
    fruits: boolean;
    water: number;
  };
  avoid: {
    junk: boolean;
    sugary: boolean;
    lateNight: boolean;
  };
}



export interface HistorySummary {
  dayName: string;
  dateStr: string;
  salahCount: number;
  habitsCount: number;
  foodCount: number;
  avoidCount: number;
  water: number;
  bismillah: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LifestyleService {
  // Authentication Signals
  readonly isLoggedIn = signal<boolean>(localStorage.getItem('tawhid_auth') === 'true');
  readonly showLoginModal = signal<boolean>(false);
  
  // Theme & Language Signals
  readonly theme = signal<'dark' | 'light'>(localStorage.getItem('tawhid_theme') as 'dark' | 'light' || 'dark');
  readonly language = signal<'en' | 'bn'>(localStorage.getItem('tawhid_language') as 'en' | 'bn' || 'bn');
  
  // Custom Logo Signal
  readonly userLogo = signal<string | null>(localStorage.getItem('tawhid_user_logo'));
  
  // Custom Profile Image Signal
  readonly profileImage = signal<string | null>(localStorage.getItem('tawhid_profile_image'));
  // Date Signaling
  readonly currentDateStr = signal<string>(this.getTodayDateKey());
  
  // Dynamic Daily State
  readonly dailyTrack = signal<DailyTrack>(this.loadDailyTrack(this.getTodayDateKey()));
  
  // Persistent Global Lists
  readonly reflections = signal<Reflection[]>(this.loadFromLocalStorage('tawhid_reflections', []));
  readonly dsaProblems = signal<DsaProblem[]>(this.loadFromLocalStorage('tawhid_dsa', this.getDefaultDsaList()));
  
  // Dynamic Multiple Projects Signals
  readonly projects = signal<Project[]>(this.loadFromLocalStorage('tawhid_projects', this.getDefaultProjects()));
  readonly activeProjectId = signal<string>(localStorage.getItem('tawhid_active_project') || 'p1');

  // Computed Active Project
  readonly activeProject = computed(() => {
    const list = this.projects();
    const id = this.activeProjectId();
    return list.find(p => p.id === id) || list[0] || null;
  });

  // Pomodoro Stats
  readonly completedPomodorosToday = signal<number>(this.loadFromLocalStorage(`tawhid_pomodoro_${this.getTodayDateKey()}`, 0));

  // ----------------------------------------------------
  // Dynamic Todarki History Log (Last 7 Days Tracker)
  // ----------------------------------------------------
  readonly weeklyHistory = computed<HistorySummary[]>(() => {
    // Recalculates dynamically when today's track or any project updates
    const history: HistorySummary[] = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const dayTrack = this.loadDailyTrack(dateKey);
      
      const s = dayTrack.salah;
      const h = dayTrack.habits;
      const f = dayTrack.food;
      const av = dayTrack.avoid;

      const salahCount = (s.fajr ? 1 : 0) + (s.dhuhr ? 1 : 0) + (s.asr ? 1 : 0) + (s.maghrib ? 1 : 0) + (s.isha ? 1 : 0);
      const habitsCount = (h.coding ? 1 : 0) + (h.problemSolving ? 1 : 0) + (h.revision ? 1 : 0) + (h.exercise ? 1 : 0) + (h.sleep ? 1 : 0) + (h.phone ? 1 : 0);
      const foodCount = (f.egg ? 1 : 0) + (f.fish ? 1 : 0) + (f.almond ? 1 : 0) + (f.fruits ? 1 : 0);
      const avoidCount = (!av.junk ? 1 : 0) + (!av.sugary ? 1 : 0) + (!av.lateNight ? 1 : 0);

      history.push({
        dayName: weekdays[d.getDay()],
        dateStr: dateKey,
        salahCount,
        habitsCount,
        foodCount,
        avoidCount,
        water: f.water,
        bismillah: dayTrack.bismillah
      });
    }

    return history;
  });

  // Calculate streaks
  readonly prayerStreak = computed<number>(() => {
    const history = this.weeklyHistory();
    let streak = 0;
    // Iterate backwards from today to find consecutive days with 5/5 salah
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].salahCount === 5) {
        streak++;
      } else if (i === history.length - 1) {
        // If today isn't finished yet but yesterday was 5/5, keep the streak
        continue;
      } else {
        break;
      }
    }
    return streak;
  });

  readonly codingStreak = computed<number>(() => {
    const history = this.weeklyHistory();
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      // If coding habit is completed in that day's track
      const key = history[i].dateStr;
      const track = this.loadDailyTrack(key);
      if (track.habits.coding) {
        streak++;
      } else if (i === history.length - 1) {
        continue;
      } else {
        break;
      }
    }
    return streak;
  });

  constructor() {
    // Save state on change
    effect(() => {
      localStorage.setItem('tawhid_auth', String(this.isLoggedIn()));
    });

    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem('tawhid_theme', currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
    });

    effect(() => {
      localStorage.setItem('tawhid_language', this.language());
    });

    effect(() => {
      const logo = this.userLogo();
      if (logo) {
        localStorage.setItem('tawhid_user_logo', logo);
      } else {
        localStorage.removeItem('tawhid_user_logo');
      }
    });

    effect(() => {
      const img = this.profileImage();
      if (img) {
        localStorage.setItem('tawhid_profile_image', img);
      } else {
        localStorage.removeItem('tawhid_profile_image');
      }
    });

    effect(() => {
      const dateKey = this.currentDateStr();
      localStorage.setItem(`tawhid_track_${dateKey}`, JSON.stringify(this.dailyTrack()));
    });

    effect(() => {
      localStorage.setItem('tawhid_reflections', JSON.stringify(this.reflections()));
    });

    effect(() => {
      localStorage.setItem('tawhid_dsa', JSON.stringify(this.dsaProblems()));
    });

    effect(() => {
      localStorage.setItem('tawhid_projects', JSON.stringify(this.projects()));
    });

    effect(() => {
      localStorage.setItem('tawhid_active_project', this.activeProjectId());
    });
  }

  // Helper: Get YYYY-MM-DD
  getTodayDateKey(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Dynamic Date Changing
  changeViewingDate(dateStr: string) {
    this.currentDateStr.set(dateStr);
    this.dailyTrack.set(this.loadDailyTrack(dateStr));
    this.completedPomodorosToday.set(this.loadFromLocalStorage(`tawhid_pomodoro_${dateStr}`, 0));
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  toggleLanguage() {
    this.language.update(l => l === 'en' ? 'bn' : 'en');
  }

  // Authentication Logic
  login(password: string): boolean {
    if (password === 'tawhid123' || password === '22103205') {
      this.isLoggedIn.set(true);
      this.showLoginModal.set(false);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
  }

  verifyAuthAction(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    this.showLoginModal.set(true);
    return false;
  }

  // ----------------------------------------------------
  // DAILY HABIT WRITING METHODS
  // ----------------------------------------------------
  toggleSalah(prayer: keyof DailyTrack['salah']) {
    if (!this.verifyAuthAction()) return;
    
    this.dailyTrack.update(state => {
      const current = { ...state };
      current.salah = { ...current.salah, [prayer]: !current.salah[prayer] };
      return current;
    });
  }

  toggleBismillah() {
    if (!this.verifyAuthAction()) return;

    this.dailyTrack.update(state => {
      const current = { ...state };
      current.bismillah = !current.bismillah;
      return current;
    });
  }

  toggleHabit(habit: keyof DailyTrack['habits']) {
    if (!this.verifyAuthAction()) return;

    this.dailyTrack.update(state => {
      const current = { ...state };
      current.habits = { ...current.habits, [habit]: !current.habits[habit] };
      return current;
    });
  }

  toggleFood(food: keyof DailyTrack['food']) {
    if (!this.verifyAuthAction()) return;

    this.dailyTrack.update(state => {
      const current = { ...state };
      if (food === 'water') return current;
      current.food = { ...current.food, [food]: !current.food[food] as any };
      return current;
    });
  }

  setWaterIntake(liters: number) {
    if (!this.verifyAuthAction()) return;

    this.dailyTrack.update(state => {
      const current = { ...state };
      current.food = { ...current.food, water: liters };
      return current;
    });
  }

  toggleAvoid(avoidKey: keyof DailyTrack['avoid']) {
    if (!this.verifyAuthAction()) return;

    this.dailyTrack.update(state => {
      const current = { ...state };
      current.avoid = { ...current.avoid, [avoidKey]: !current.avoid[avoidKey] };
      return current;
    });
  }

  // ----------------------------------------------------
  // REFLECTION JOURNAL CRUD
  // ----------------------------------------------------
  addReflection(good: string, mistake: string, improvement: string) {
    if (!this.verifyAuthAction()) return;

    const newReflection: Reflection = {
      id: Math.random().toString(36).substr(2, 9),
      date: this.currentDateStr(),
      good: good.trim(),
      mistake: mistake.trim(),
      improvement: improvement.trim()
    };

    this.reflections.update(list => [newReflection, ...list]);
  }

  deleteReflection(id: string) {
    if (!this.verifyAuthAction()) return;

    this.reflections.update(list => list.filter(r => r.id !== id));
  }

  // ----------------------------------------------------
  // DSA PROBLEM SOLVING CRUD
  // ----------------------------------------------------
  addDsaProblem(name: string, tag: string, difficulty: 'Easy' | 'Medium' | 'Hard', notes?: string) {
    if (!this.verifyAuthAction()) return;

    const newProblem: DsaProblem = {
      id: Math.random().toString(36).substr(2, 9),
      date: this.currentDateStr(),
      name: name.trim(),
      tag: tag.trim(),
      difficulty,
      notes: notes?.trim()
    };

    this.dsaProblems.update(list => [newProblem, ...list]);
  }

  deleteDsaProblem(id: string) {
    if (!this.verifyAuthAction()) return;

    this.dsaProblems.update(list => list.filter(p => p.id !== id));
  }

  // ----------------------------------------------------
  // DYNAMIC DYNAMIC PROJECTS & TASKS CRUD
  // ----------------------------------------------------
  addProject(name: string, description: string) {
    if (!this.verifyAuthAction()) return;

    const newProject: Project = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      tasks: []
    };

    this.projects.update(list => [...list, newProject]);
    this.activeProjectId.set(newProject.id);
  }

  deleteProject(id: string) {
    if (!this.verifyAuthAction()) return;
    if (this.projects().length <= 1) return; // Keep at least one

    this.projects.update(list => list.filter(p => p.id !== id));
    // If deleted active project, auto switch
    if (this.activeProjectId() === id) {
      this.activeProjectId.set(this.projects()[0].id);
    }
  }

  addProjectTask(projectId: string, taskName: string, category: ProjectTask['category']) {
    if (!this.verifyAuthAction()) return;

    this.projects.update(list => 
      list.map(p => {
        if (p.id === projectId) {
          const newTask: ProjectTask = {
            id: 't_' + Math.random().toString(36).substr(2, 9),
            name: taskName.trim(),
            category,
            completed: false
          };
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      })
    );
  }

  toggleProjectTask(projectId: string, taskId: string) {
    if (!this.verifyAuthAction()) return;

    this.projects.update(list => 
      list.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
          };
        }
        return p;
      })
    );
  }

  deleteProjectTask(projectId: string, taskId: string) {
    if (!this.verifyAuthAction()) return;

    this.projects.update(list => 
      list.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.filter(t => t.id !== taskId)
          };
        }
        return p;
      })
    );
  }

  incrementPomodoro() {
    const dateKey = this.currentDateStr();
    const count = this.completedPomodorosToday() + 1;
    this.completedPomodorosToday.set(count);
    localStorage.setItem(`tawhid_pomodoro_${dateKey}`, String(count));
  }

  // ----------------------------------------------------
  // INITIALIZERS
  // ----------------------------------------------------
  private loadDailyTrack(dateStr: string): DailyTrack {
    const raw = localStorage.getItem(`tawhid_track_${dateStr}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // Fallback
      }
    }
    return {
  salah: {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  },
  bismillah: false,
  habits: {
    coding: false,
    problemSolving: false,
    revision: false,
    exercise: false,
    sleep: false,
    phone: false
  },
  food: {
    meat: undefined,
    egg: false,
    fish: false,
    almond: false,
    fruits: false,
    water: 0
  },
  avoid: {
    junk: false,
    sugary: false,
    lateNight: false
  }
};
  }

  private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw) as T;
      } catch (e) {
        // fallback
      }
    }
    return defaultValue;
  }

  private getDefaultProjects(): Project[] {
    return [
      {
        id: 'p1',
        name: 'Doctor Appointment System',
        description: 'PostgreSQL-backed appointment manager with express APIs & Angular front-end dashboard.',
        tasks: [
          { id: 't1', name: 'Design Postgres Doctor & Patient Models', category: 'Database', completed: true },
          { id: 't2', name: 'Create Express auth router and token hashing', category: 'API', completed: true },
          { id: 't3', name: 'Develop appointment scheduler algorithms', category: 'Backend', completed: false },
          { id: 't4', name: 'Write doctor slot booking REST endpoints', category: 'API', completed: false },
          { id: 't5', name: 'Create dashboard routing & patient booking screens', category: 'Frontend', completed: false },
          { id: 't6', name: 'Implement dynamic doctor availability calendars', category: 'Frontend', completed: false }
        ]
      },
      {
        id: 'p2',
        name: 'Tawhid Lifestyle Portfolio',
        description: 'Super elegant glassmorphic dashboard tracking daily salah, habits, fitness & career goals.',
        tasks: [
          { id: 'tp1', name: 'Create responsive standard CSS layout', category: 'Frontend', completed: true },
          { id: 'tp2', name: 'Design circular SVG progress rings', category: 'Frontend', completed: true },
          { id: 'tp3', name: 'Synthesize Pomodoro chime using Web Audio API', category: 'Backend', completed: true },
          { id: 'tp4', name: 'Implement dynamic local projects CRUD', category: 'Backend', completed: true },
          { id: 'tp5', name: 'Integrate live Bangla ticking digital clock', category: 'Frontend', completed: true }
        ]
      }
    ];
  }

  private getDefaultDsaList(): DsaProblem[] {
    return [
      { id: 'd1', date: '2026-05-18', name: 'Two Sum (LeetCode 1)', tag: 'Arrays & HashMaps', difficulty: 'Easy', notes: 'Solved using hash map for O(N) complexity.' },
      { id: 'd2', date: '2026-05-19', name: 'Valid Parentheses (LeetCode 20)', tag: 'Stacks', difficulty: 'Easy', notes: 'Used stacks to match opening and closing brackets.' },
      { id: 'd3', date: '2026-05-20', name: 'Container With Most Water', tag: 'Two Pointers', difficulty: 'Medium', notes: 'Optimized with two pointers shrinking towards the center.' }
    ];
  }
}
