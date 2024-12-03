import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Field } from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private apiUrl = 'http://localhost:3000/api/fields';

  constructor(private http: HttpClient) {}

  // Отримання списку всіх полів
  getFields(): Observable<Field[]> {
    return this.http.get<Field[]>(this.apiUrl);
  }

  // Отримання конкретного поля за ID
  getFieldById(id: string): Observable<Field> {
    return this.http.get<Field>(`${this.apiUrl}/${id}`);
  }

  // Створення нового поля
  createField(field: Partial<Field>): Observable<Field> {
    return this.http.post<Field>(this.apiUrl, field);
  }

  // Оновлення поля
  updateField(id: string, field: Partial<Field>): Observable<Field> {
    return this.http.put<Field>(`${this.apiUrl}/${id}`, field);
  }

  // Отримання геометрії поля для відображення на карті
  getFieldGeometry(id: string): Observable<{ coordinates: Array<[number, number]> }> {
    return this.http.get<{ coordinates: Array<[number, number]> }>(`${this.apiUrl}/${id}/geometry`);
  }

  // Видалення поля
  deleteField(id: string): Observable<Field> {
    return this.http.delete<Field>(`${this.apiUrl}/${id}`);
  }
}
