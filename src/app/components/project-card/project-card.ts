import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.css']
})
export class ProjectCardComponent {

  @Input() project!: Project;
  @Output() hapusProject = new EventEmitter<number>();
  @Output() ubahStatus = new EventEmitter<number>();

  isDetailVisible = false;

  // ── 5.3: Getter status badge color ───────────────────────
  getStatusClass(status: string) {
    switch (status) {
      case 'On Progress':
        return 'status-progress';

      case 'Selesai':
        return 'status-completed';

      default:
        return '';
  }
}

  // ── 5.3: Getter total task ────────────────────────────────
  get totalTask(): number {
    return this.project.tasks.length;
  }

  // ── 5.3: Getter total subtask semua task ──────────────────
  get totalSubtask(): number {
    return this.project.tasks.reduce(
      (total, task) => total + task.subtasks.length, 0
    );
  }

  // ── 5.3: Getter total estimasi jam ────────────────────────
  get totalEstimasi(): number {
    return this.project.tasks.reduce(
      (total, task) => total + Number(task.estimasiJam), 0
    );
  }

  // ── 5.2: trackBy untuk nested *ngFor di card ─────────────
  trackByIndex(index: number): number {
    return index;
  }

  onToggleDetail(): void {
    this.isDetailVisible = !this.isDetailVisible;
  }

  onHapus(): void {
    this.hapusProject.emit(this.project.id);
  }

  onUbahStatus(): void {
    this.ubahStatus.emit(this.project.id);
  }
}