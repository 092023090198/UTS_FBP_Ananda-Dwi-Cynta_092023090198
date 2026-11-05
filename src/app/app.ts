import { Component, signal } from '@angular/core';
import { ProjectListComponent } from './components/project-list/project-list';

@Component({
  imports: [ProjectListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  protected readonly title = signal('uts-fbp-freeloancer-board');
}
