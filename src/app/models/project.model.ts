export interface Subtask {
  namaSubtask: string;
}

export interface Task {
  namaTask: string;
  estimasiJam: number;
  subtasks: Subtask[];
}

export interface Project {
  id: number;
  namaProject: string;
  namaKlien: string;
  deadline: string;
  status: 'On Progress' | 'Selesai';
  tasks: Task[];
}