import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LifestyleService, DsaProblem, ProjectTask } from '../../services/lifestyle.service';

@Component({
  selector: 'app-dsa-projects',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dsa-projects-section animated-fade-in">

      <!-- ═══════════════════════════════════════════════════ -->
      <!-- LEFT: DSA Problem Solving Logger                   -->
      <!-- ═══════════════════════════════════════════════════ -->
      <div class="glass-card panel-card dsa-board">
        <div class="panel-header">
          <div class="title-wrap">
            <span class="panel-icon">🧠</span>
            <h3>Problem- Solving</h3>
          </div>
          <div class="weekly-stat">
            Weekly: <span class="accent-txt">{{ dsaList().length }} / 15</span> solved
          </div>
        </div>
        <p class="panel-desc">Arrays, Strings, Loops and Backend Logical Thinking Practice Session.</p>

        <!-- Add Problem Form -->
        <div class="add-form">
          <div class="form-row">
            <input type="text" [(ngModel)]="newDsaName"
              placeholder="Problem Name (e.g., Reverse String)..."
              class="form-control" (keydown.enter)="addDsaProblem()" />
          </div>
          <div class="form-row flex-row">
            <input type="text" [(ngModel)]="newDsaTag"
              placeholder="Tag (e.g., Arrays)..."
              class="form-control" />
            <select [(ngModel)]="newDsaDifficulty" class="form-control select-difficulty">
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
            </select>
          </div>
          <div class="form-row flex-row">
            <input type="text" [(ngModel)]="newDsaNotes"
              placeholder="Short Notes (Optional)..."
              class="form-control" />
            <button class="btn-primary" (click)="addDsaProblem()">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
              </svg>
              Add Problem
            </button>
          </div>
        </div>

        <!-- DSA Problem List -->
        <div class="dsa-list scrollable-list">
          @if (dsaList().length === 0) {
            <div class="empty-state">No DSA problems added yet.</div>
          } @else {
            @for (problem of dsaList(); track problem.id) {
              <div class="dsa-item">
                <div class="dsa-info">
                  <div class="title-line">
                    <span class="dif-dot" [class]="problem.difficulty.toLowerCase()"></span>
                    <strong class="prob-name">{{ problem.name }}</strong>
                    <span class="difficulty-tag" [class]="problem.difficulty.toLowerCase()">{{ problem.difficulty }}</span>
                  </div>
                  <div class="sub-line">
                    <span class="tag-badge"># {{ problem.tag }}</span>
                    @if (problem.notes) {
                      <span class="notes-txt"> - {{ problem.notes }}</span>
                    }
                    <span class="date-micro">{{ problem.date }}</span>
                  </div>
                </div>
                <button class="btn-delete" (click)="deleteDsaProblem(problem.id)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T720-120H280Zm80-160h80v-320h-80v320Zm160 0h80v-320h-80v320Z"/>
                  </svg>
                </button>
              </div>
            }
          }
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════ -->
      <!-- RIGHT: Dynamic Multi-Project Board                 -->
      <!-- ═══════════════════════════════════════════════════ -->
      <div class="glass-card panel-card project-board">

        <!-- Project Header with Switcher -->
        <div class="project-top-bar">
          <div class="project-title-row">
            <span class="panel-icon">🛠️</span>
            <div class="project-select-wrap">
              <select class="project-switcher"
                [ngModel]="lifestyleService.activeProjectId()"
                (ngModelChange)="switchProject($event)">
                @for (proj of lifestyleService.projects(); track proj.id) {
                  <option [value]="proj.id">{{ proj.name }}</option>
                }
              </select>
              <svg class="select-chevron" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
              </svg>
            </div>
          </div>

          <div class="project-actions-bar">
            <!-- Progress badge -->
            <div class="progress-badge">
              <div class="progress-bar-track">
                <div class="progress-bar-fill" [style.width.%]="projectPercent()"></div>
              </div>
              <span class="percent-label">{{ projectPercent() }}%</span>
            </div>

            <!-- New Project Toggle -->
            <button class="btn-icon-action btn-new-proj"
              (click)="toggleNewProjectForm()"
              [class.active]="showNewProjectForm()"
              title="New Project">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
              </svg>
            </button>

            <!-- Delete Active Project -->
            <button class="btn-icon-action btn-del-proj"
              [disabled]="lifestyleService.projects().length <= 1"
              (click)="deleteActiveProject()"
              title="Delete Project">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T720-120H280Zm80-160h80v-320h-80v320Zm160 0h80v-320h-80v320Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Active Project Description -->
        @if (lifestyleService.activeProject()) {
          <p class="panel-desc proj-desc">
            {{ lifestyleService.activeProject()!.description }}
          </p>
        }

        <!-- ── New Project Form (Expandable) ── -->
        @if (showNewProjectForm()) {
          <div class="new-project-form animated-fade-in">
            <div class="new-proj-title">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Z"/>
              </svg>
              Create New Project
            </div>
            <input type="text" class="form-control" [(ngModel)]="newProjectName"
              placeholder="Project Name (e.g., E-Commerce App)..." />
            <textarea class="form-control" [(ngModel)]="newProjectDesc"
              placeholder="Short Description (Optional)..." rows="2"></textarea>
            <div class="new-proj-btns">
              <button class="btn-primary" (click)="createProject()">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                </svg>
                Create
              </button>
              <button class="btn-secondary" (click)="showNewProjectForm.set(false)">বাতিল</button>
            </div>
          </div>
        }

        <!-- ── Category Legend ── -->
        <div class="category-badges">
          <span class="badge cat-db">Database</span>
          <span class="badge cat-api">API</span>
          <span class="badge cat-be">Backend</span>
          <span class="badge cat-fe">Frontend</span>
          <span class="cat-stat">
            {{ completedTasksCount() }}/{{ totalTasksCount() }} টাস্ক
          </span>
        </div>

        <!-- ── Add Task Form ── -->
        <div class="add-form">
          <div class="form-row flex-row">
            <input type="text" [(ngModel)]="newTaskName"
              placeholder="New Task Name..."
              class="form-control"
              (keydown.enter)="addProjectTask()" />
            <select [(ngModel)]="newTaskCategory" class="form-control select-category">
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="API">API Router</option>
              <option value="Frontend">Frontend UI</option>
            </select>
            <button class="btn-primary" (click)="addProjectTask()">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
              </svg>
              Add Task  
            </button>
          </div>
        </div>

        <!-- ── Task Checklist ── -->
        <div class="project-list scrollable-list">
          @if (activeTasks().length === 0) {
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor" style="opacity:0.2">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760ZM360-400h240v-80H360v80Zm0-160h240v-80H360v80Z"/>
              </svg>
              <p>No tasks added to this project yet.<br/>Add a new task using the form above.</p>
            </div>
          } @else {
            @for (task of activeTasks(); track task.id) {
              <div class="task-item" [class.completed]="task.completed">
                <label class="custom-checkbox flex-grow">
                  <input type="checkbox"
                    [checked]="task.completed"
                    (change)="toggleTask(task.id)" />
                  <span class="checkmark"></span>
                  <span class="checkbox-label">
                    <span class="task-cat-tag" [class]="task.category.toLowerCase()">
                      {{ task.category }}
                    </span>
                    <span class="task-title-txt">{{ task.name }}</span>
                  </span>
                </label>
                <button class="btn-delete" (click)="deleteTask(task.id)" title="Delete Task">
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T720-120H280Zm80-160h80v-320h-80v320Zm160 0h80v-320h-80v320Z"/>
                  </svg>
                </button>
              </div>
            }
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Section Grid Layout ── */
    .dsa-projects-section {
      display: grid;
      grid-template-columns: 1.05fr 1.2fr;
      gap: 24px;
    }

    @media (max-width: 992px) {
      .dsa-projects-section { grid-template-columns: 1fr; }
    }

    /* ── Panel Card Base ── */
    .panel-card {
      border: 1px solid rgba(255,255,255,0.08);
      display: flex;
      flex-direction: column;
      height: 560px;
    }

    /* ── DSA Board Header ── */
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .panel-icon { font-size: 1.3rem; }

    .panel-card h3 {
      font-size: 1rem;
      font-weight: 700;
    }

    .weekly-stat {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .accent-txt {
      color: var(--accent-blue);
      font-weight: 800;
    }

    .panel-desc {
      font-size: 0.78rem;
      color: #64748b;
      margin-bottom: 14px;
      line-height: 1.5;
    }

    .proj-desc {
      margin-top: 6px;
    }

    /* ── Project Top Bar ── */
    .project-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 4px;
    }

    .project-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    /* ── Project Switcher Dropdown ── */
    .project-select-wrap {
      position: relative;
      flex: 1;
      min-width: 0;
    }

    .project-switcher {
      width: 100%;
      background: rgba(59, 130, 246, 0.08);
      border: 1.5px solid rgba(59, 130, 246, 0.25);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.88rem;
      font-weight: 700;
      font-family: var(--font-family-title);
      padding: 7px 32px 7px 12px;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      transition: var(--transition-smooth);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .project-switcher:hover {
      border-color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.12);
    }

    .project-switcher:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .select-chevron {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #64748b;
    }

    /* ── Project Action Buttons ── */
    .project-actions-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .progress-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar-track {
      width: 60px;
      height: 5px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .percent-label {
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--accent-purple);
      text-shadow: 0 0 8px var(--accent-purple-glow);
      min-width: 32px;
      font-family: var(--font-family-title);
    }

    .btn-icon-action {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
      padding: 0;
    }

    .btn-new-proj:hover, .btn-new-proj.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--accent-blue);
      color: var(--accent-blue);
      box-shadow: 0 0 10px rgba(59,130,246,0.2);
    }

    .btn-del-proj:hover:not(:disabled) {
      background: rgba(244, 63, 94, 0.15);
      border-color: var(--accent-rose);
      color: var(--accent-rose);
    }

    .btn-del-proj:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    /* ── New Project Form ── */
    .new-project-form {
      background: rgba(59, 130, 246, 0.04);
      border: 1px solid rgba(59, 130, 246, 0.15);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .new-proj-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-blue);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .new-project-form textarea.form-control {
      resize: none;
      font-size: 0.82rem;
    }

    .new-proj-btns {
      display: flex;
      gap: 10px;
    }

    .new-proj-btns button {
      padding: 7px 16px;
      font-size: 0.82rem;
    }

    /* ── Category Legend ── */
    .category-badges {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .badge {
      font-size: 0.62rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 5px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .cat-db  { background: rgba(6,182,212,0.12);   color: #22d3ee; border: 1px solid rgba(6,182,212,0.25); }
    .cat-api { background: rgba(139,92,246,0.12);  color: #c084fc; border: 1px solid rgba(139,92,246,0.25); }
    .cat-be  { background: rgba(59,130,246,0.12);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
    .cat-fe  { background: rgba(236,72,153,0.12);  color: #f472b6; border: 1px solid rgba(236,72,153,0.25); }

    .cat-stat {
      margin-left: auto;
      font-size: 0.72rem;
      color: #475569;
      font-weight: 600;
    }

    /* ── Add Form Shared ── */
    .add-form {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-row { width: 100%; }

    .flex-row {
      display: flex;
      gap: 8px;
    }

    .select-difficulty, .select-category {
      max-width: 120px;
      cursor: pointer;
      background: rgba(13,19,38,0.85);
    }

    .add-form input, .add-form select, .add-form textarea {
      font-size: 0.8rem;
      padding: 7px 10px;
    }

    .add-form button {
      padding: 7px 14px;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    /* ── Scrollable Lists ── */
    .scrollable-list {
      flex-grow: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-right: 4px;
    }

    .empty-state {
      text-align: center;
      color: #334155;
      font-size: 0.82rem;
      margin-top: 30px;
      font-style: italic;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      line-height: 1.6;
    }

    .empty-state p { color: #334155; font-style: italic; }

    /* ── DSA Items ── */
    .dsa-item {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 9px;
      padding: 9px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .dsa-item:hover {
      background: rgba(255,255,255,0.04);
      border-color: rgba(255,255,255,0.08);
    }

    .dsa-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }

    .title-line { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

    .dif-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }
    .dif-dot.easy   { background: var(--accent-emerald); }
    .dif-dot.medium { background: var(--accent-amber); }
    .dif-dot.hard   { background: var(--accent-rose); }

    .prob-name { font-size: 0.86rem; color: #e2e8f0; }

    .difficulty-tag {
      font-size: 0.6rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .difficulty-tag.easy   { background: rgba(16,185,129,0.12); color: #34d399; }
    .difficulty-tag.medium { background: rgba(245,158,11,0.12); color: #fbbf24; }
    .difficulty-tag.hard   { background: rgba(244,63,94,0.12);  color: #f43f5e; }

    .sub-line {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: #64748b;
      flex-wrap: wrap;
    }

    .tag-badge { color: var(--accent-blue); font-weight: 600; }
    .notes-txt { font-style: italic; }
    .date-micro { margin-left: auto; color: #334155; font-size: 0.65rem; }

    /* ── Delete Buttons ── */
    .btn-delete {
      background: transparent;
      border: none;
      color: #334155;
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: var(--transition-smooth);
      flex-shrink: 0;
    }
    .btn-delete:hover {
      color: var(--accent-rose);
      background: rgba(244,63,94,0.1);
    }

    /* ── Task Items ── */
    .task-item {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 9px;
      padding: 9px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .task-item:hover {
      background: rgba(255,255,255,0.04);
      border-color: rgba(255,255,255,0.09);
    }

    .task-item.completed {
      background: rgba(139,92,246,0.02);
      border-color: rgba(139,92,246,0.08);
    }

    .flex-grow { flex-grow: 1; min-width: 0; }

    .task-cat-tag {
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 8px;
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .task-cat-tag.database { background: rgba(6,182,212,0.1);   color: #22d3ee; }
    .task-cat-tag.api      { background: rgba(139,92,246,0.1);  color: #c084fc; }
    .task-cat-tag.backend  { background: rgba(59,130,246,0.1);  color: #60a5fa; }
    .task-cat-tag.frontend { background: rgba(236,72,153,0.1);  color: #f472b6; }

    .task-title-txt { font-size: 0.83rem; color: #cbd5e1; }
    .task-item.completed .task-title-txt {
      color: #475569;
      text-decoration: line-through;
    }
  `]
})
export class DsaProjectsComponent {
  readonly lifestyleService = inject(LifestyleService);

  // ── DSA bindings ──
  newDsaName = '';
  newDsaTag = '';
  newDsaDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  newDsaNotes = '';

  // ── Task bindings ──
  newTaskName = '';
  newTaskCategory: ProjectTask['category'] = 'Backend';

  // ── New project form ──
  showNewProjectForm = signal<boolean>(false);
  newProjectName = '';
  newProjectDesc = '';

  // ── Computed references ──
  dsaList = this.lifestyleService.dsaProblems;

  activeTasks = computed(() => {
    const p = this.lifestyleService.activeProject();
    return p ? p.tasks : [];
  });

  completedTasksCount = computed(() =>
    this.activeTasks().filter(t => t.completed).length
  );

  totalTasksCount = computed(() => this.activeTasks().length);

  projectPercent = computed(() => {
    const total = this.totalTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedTasksCount() / total) * 100);
  });

  // ── DSA Methods ──
  addDsaProblem() {
    if (!this.newDsaName.trim() || !this.newDsaTag.trim()) return;
    this.lifestyleService.addDsaProblem(
      this.newDsaName,
      this.newDsaTag,
      this.newDsaDifficulty,
      this.newDsaNotes || undefined
    );
    this.newDsaName = '';
    this.newDsaTag = '';
    this.newDsaNotes = '';
  }

  deleteDsaProblem(id: string) {
    this.lifestyleService.deleteDsaProblem(id);
  }

  // ── Project Switching ──
  switchProject(id: string) {
    this.lifestyleService.activeProjectId.set(id);
  }

  // ── New Project CRUD ──
  toggleNewProjectForm() {
    this.showNewProjectForm.update(v => !v);
    this.newProjectName = '';
    this.newProjectDesc = '';
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    this.lifestyleService.addProject(this.newProjectName, this.newProjectDesc);
    this.newProjectName = '';
    this.newProjectDesc = '';
    this.showNewProjectForm.set(false);
  }

  deleteActiveProject() {
    const activeId = this.lifestyleService.activeProjectId();
    this.lifestyleService.deleteProject(activeId);
  }

  // ── Task CRUD ──
  addProjectTask() {
    if (!this.newTaskName.trim()) return;
    const projectId = this.lifestyleService.activeProjectId();
    this.lifestyleService.addProjectTask(projectId, this.newTaskName, this.newTaskCategory);
    this.newTaskName = '';
  }

  toggleTask(taskId: string) {
    const projectId = this.lifestyleService.activeProjectId();
    this.lifestyleService.toggleProjectTask(projectId, taskId);
  }

  deleteTask(taskId: string) {
    const projectId = this.lifestyleService.activeProjectId();
    this.lifestyleService.deleteProjectTask(projectId, taskId);
  }
}
