import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drone } from '../models/drone.model';

@Injectable({
  providedIn: 'root'
})
export class DroneService {
  private apiUrl = 'http://localhost:3000/api/drones'; // Базовий URL вашого backend API

  constructor(private http: HttpClient) {}

  // Отримання списку всіх дронів
  getDrones(): Observable<Drone[]> {
    return this.http.get<Drone[]>(this.apiUrl);
  }

  // Отримання конкретного дрону за ID
  getDroneById(id: string): Observable<Drone> {
    return this.http.get<Drone>(`${this.apiUrl}/${id}`);
  }

  // Створення нового дрону
  createDrone(drone: Partial<Drone>): Observable<Drone> {
    return this.http.post<Drone>(this.apiUrl, drone);
  }

  // Оновлення інформації про дрону
  updateDrone(id: string, drone: Partial<Drone>): Observable<Drone> {
    return this.http.put<Drone>(`${this.apiUrl}/${id}`, drone);
  }

  // Оновлення статусу дрону
  updateDroneStatus(id: string, status: string): Observable<Drone> {
    return this.http.patch<Drone>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Оновлення місцезнаходження дрону
  updateDroneLocation(id: string, location: { lat: number, lng: number }): Observable<Drone> {
    return this.http.patch<Drone>(`${this.apiUrl}/${id}/location`, location);
  }

  // Видалення дрону
  deleteDrone(id: string): Observable<Drone> {
    return this.http.delete<Drone>(`${this.apiUrl}/${id}`);
  }
}
