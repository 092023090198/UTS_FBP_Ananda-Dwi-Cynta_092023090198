
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectFormComponent } from '../project-form/project-form';
import { ProjectCardComponent } from '../project-card/project-card';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectFormComponent,
    ProjectCardComponent
  ],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {

  projectList: Project[] = [];
  isFormVisible = false;
  private nextId = 1;

  // Mengambil data saat halaman pertama kali dibuka
  ngOnInit(): void {
    this.loadProjects();
  }

  // Mengambil data dari LocalStorage
  loadProjects(): void {
    const savedProjects = localStorage.getItem('rencanaku_projects');

    if (savedProjects) {
      try {
        this.projectList = JSON.parse(savedProjects);

        // Melanjutkan ID dari project terakhir
        this.nextId = this.projectList.length > 0
          ? Math.max(...this.projectList.map(p => p.id)) + 1
          : 1;

      } catch (error) {
        console.error('Gagal membaca data project:', error);
        this.projectList = [];
      }
    }
  }

  // Menyimpan data ke LocalStorage
  saveProjects(): void {
    localStorage.setItem(
      'rencanaku_projects',
      JSON.stringify(this.projectList)
    );
  }

  // Mengecek apakah daftar proyek kosong
  get isProjectEmpty(): boolean {
    return this.projectList.length === 0;
  }

  // Menghitung project yang sedang berjalan
  get totalProgress(): number {
    return this.projectList.filter(
      project => project.status === 'On Progress'
    ).length;
  }

  // Menghitung project yang sudah selesai
  get totalSelesai(): number {
    return this.projectList.filter(
      project => project.status === 'Selesai'
    ).length;
  }

  // Menghitung seluruh task dari semua project
  get totalTask(): number {
    return this.projectList.reduce(
      (total, project) => total + project.tasks.length,
      0
    );
  }

  // Optimasi tampilan daftar proyek
  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  // Menampilkan form tambah proyek
  onTambahProject(): void {
    this.isFormVisible = true;
  }

  // Menyimpan proyek baru
  onSimpanProject(data: any): void {
    const newProject: Project = {
      id: this.nextId++,
      namaProject: data.namaProject,
      namaKlien: data.namaKlien,
      deadline: data.deadline,
      status: 'On Progress',
      tasks: data.tasks || []
    };

    this.projectList.push(newProject);

    // Simpan perubahan
    this.saveProjects();

    this.isFormVisible = false;
  }

  // Membatalkan form
  onBatalForm(): void {
    this.isFormVisible = false;
  }

  // Menghapus proyek
  onHapusProject(id: number): void {
    this.projectList = this.projectList.filter(
      p => p.id !== id
    );

    // Simpan perubahan
    this.saveProjects();
  }

  // Mengubah status proyek
  onUbahStatus(id: number): void {
    const project = this.projectList.find(
      p => p.id === id
    );

    if (!project) return;

    project.status =
      project.status === 'On Progress'
        ? 'Selesai'
        : 'On Progress';

    // Simpan perubahan
    this.saveProjects();
  }

}
