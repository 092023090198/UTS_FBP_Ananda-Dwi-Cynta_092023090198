import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.css']
})
export class ProjectFormComponent implements OnInit {

  @Output() simpanProject = new EventEmitter<Project>();
  @Output() batalForm = new EventEmitter<void>();

  projectForm!: FormGroup;
  readonly MAX_JAM = 100;
  readonly MAX_TASK = 10;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      namaProject: ['', Validators.required],
      namaKlien:   ['', Validators.required],
      deadline:    ['', Validators.required],
      tasks:       this.fb.array([])
    });
  }

  // ── Getter akses FormArray tasks ─────────────────────────
  get tasks(): FormArray {
    return this.projectForm.get('tasks') as FormArray;
  }

  // ── Getter akses subtasks per task ───────────────────────
  getSubtasks(taskIndex: number): FormArray {
    return this.tasks.at(taskIndex).get('subtasks') as FormArray;
  }

  // ── 5.1: Tambah baris task baru ──────────────────────────
  onTambahTask(): void {
    const taskGroup = this.fb.group({
      namaTask:    ['', Validators.required],
      estimasiJam: [0, [Validators.required, Validators.min(1)]],
      subtasks:    this.fb.array([])
    });
    this.tasks.push(taskGroup);
  }

  // ── 5.1: Hapus task di index tertentu ────────────────────
  onHapusTask(index: number): void {
    this.tasks.removeAt(index);
  }

  // ── 5.1: Tambah subtask ke task tertentu ─────────────────
  onTambahSubtask(taskIndex: number): void {
    const subtaskGroup = this.fb.group({
      namaSubtask: ['', Validators.required]
    });
    this.getSubtasks(taskIndex).push(subtaskGroup);
  }

  // ── 5.1: Hapus subtask di index tertentu ─────────────────
  onHapusSubtask(taskIndex: number, subtaskIndex: number): void {
    this.getSubtasks(taskIndex).removeAt(subtaskIndex);
  }

  // ── 5.1: Cross-validation cek duplikasi namaTask ─────────
  isDuplicateTask(index: number): boolean {
    const current = this.tasks.at(index)
      .get('namaTask')?.value?.trim().toLowerCase();
    if (!current) return false;

    return this.tasks.controls.some((ctrl, i) => {
      if (i === index) return false;
      const other = ctrl.get('namaTask')?.value?.trim().toLowerCase();
      return other === current;
    });
  }

  // ── 5.1: Hitung total estimasi jam semua task ─────────────
  get totalEstimasiJam(): number {
    return this.tasks.controls.reduce((total, ctrl) => {
      const jam = Number(ctrl.get('estimasiJam')?.value) || 0;
      return total + jam;
    }, 0);
  }

  // ── 5.1: Cross-validation cek total melebihi batas ───────
  get isTotalOverLimit(): boolean {
    return this.totalEstimasiJam > this.MAX_JAM;
  }

  // ── 5.2: trackBy untuk optimasi *ngFor ───────────────────
  trackByIndex(index: number): number {
    return index;
  }

  // ── 5.3: Getter untuk *ngIf — cek task limit ─────────────
  get isTaskLimitReached(): boolean {
    return this.tasks.length >= this.MAX_TASK;
  }

  // ── 5.3: Getter validasi form keseluruhan ─────────────────
  get isFormValid(): boolean {
    return this.projectForm.valid && !this.isTotalOverLimit;
  }

  // ── Simpan project ────────────────────────────────────────
  onSimpanProject(): void {
    if (!this.isFormValid) return;
    this.simpanProject.emit(this.projectForm.value);
    this.projectForm.reset();
    this.tasks.clear();
  }

  // ── Batal ─────────────────────────────────────────────────
  onBatalForm(): void {
    this.batalForm.emit();
  }
}