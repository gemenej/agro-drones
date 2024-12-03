import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  // Отримання списку завдань
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Отримання завдань для конкретного дрону
  getTasksByDrone(droneId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/drone/${droneId}`);
  }

  // Створення нового завдання
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Оновлення завдання
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Оновлення статусу завдання
  updateTaskStatus(id: string, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Видалення завдання
  deleteTask(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }

  getTaskTypeLabel(operation: string): string {
    const labels: { [key: string]: string } = {
      seeding: 'Посів',
      fertilizing: 'Внесення добрив',
      spraying: 'Обприскування',
    };
    return labels[operation] || operation;
  }

  getTaskStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      planned: 'Заплановано',
      in_progress: 'В процесі',
      completed: 'Виконано',
      failed: 'Не вдалося',
    };
    return labels[status] || status;
  }

  getTypeClass(operation: string): string {
    return `task-type-${operation}`;
  }

  getStatusClass(status: string): string {
    return `task-status-${status}`;
  }
}
