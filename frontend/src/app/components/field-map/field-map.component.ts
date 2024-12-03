import { Component, OnInit } from '@angular/core';
import { FieldService } from '../../services/field.service';
import { TaskService } from '../../services/task.service';
import * as L from 'leaflet';
import * as LDraw from 'leaflet-draw';

import 'leaflet-draw/dist/leaflet.draw-src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-field-map',
  templateUrl: './field-map.component.html',
  styleUrls: ['./field-map.component.scss'],
})
export class FieldMapComponent implements OnInit {
  private map: L.Map = null!;
  private fieldsLayer: L.LayerGroup = null!;
  private tasksLayer: L.LayerGroup = null!;
  private drawControl: L.Control.Draw = null!;
  private drawnItems: L.FeatureGroup = null!;
  fieldForm: FormGroup | null = null;
  taskForm: FormGroup | null = null;
  private drawPluginOptions: L.Control.DrawConstructorOptions = null!;

  selectedOperation: string = '';
  selectedStatus: string = '';

  activeTasks: any[] = [];

  constructor(
    private fieldService: FieldService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    (window as any).type = undefined;
  }

  ngOnInit() {
    this.initMap();
    this.loadFields();
    this.loadTasks();
    this.initDrawControl();
    this.selectedOperation = 'all';
    this.selectedStatus = 'all';
  }

  private initMap(): void {
    // Ініціалізація карти (центр України)
    this.map = L.map('map').setView([49.0, 32.0], 18);

    // Додавання базового шару карти
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ua', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Створення шарів для полів та завдань
    this.fieldsLayer = L.layerGroup().addTo(this.map);
    this.tasksLayer = L.layerGroup().addTo(this.map);

    // Створення групи для намальованих об'єктів
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: "<strong>Oh snap!<strong> you can't draw that!", // Message that will show when intersect
          },
          shapeOptions: {
            color: '#97009c',
            weight: 1,
          },
          showArea: true,
        },
        // disable toolbar item by setting it to false
        polyline: false,
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: this.drawnItems, //REQUIRED!!
        remove: true,
      },
    };
  }

  private initDrawControl(): void {
    this.drawControl = new L.Control.Draw(this.drawPluginOptions);
    this.map.addControl(this.drawControl);

    this.map.on('draw:created', (e) => {
      let type = (e as L.DrawEvents.Created).layerType,
        layer = (e as L.DrawEvents.Created).layer;
      console.log('Type:', type);

      if (type === 'marker') {
        layer.bindPopup('A popup!');
      }

      this.drawnItems.addLayer(layer);
      this.createFieldForm(layer as L.Polygon);
    });
  }

  private createFieldForm(layer: L.Polygon, id?: string, name?: string): void {
    // Обчислення площі поля
    const area =
      L.GeometryUtil.geodesicArea(layer.getLatLngs()[0] as L.LatLng[]) / 10000; // конвертація м² в гектари

    const latLngs = layer.getLatLngs()[0];
    let coordinates: number[][] = [];

    if (Array.isArray(latLngs)) {
      coordinates = (latLngs as L.LatLng[]).map((latlng: L.LatLng) => [
        latlng.lat,
        latlng.lng,
      ]);
    } else {
      console.error('Expected an array of LatLng objects:', latLngs);
      // Handle the case where latLngs is not an array
    }

    this.fieldForm = this.formBuilder.group({
      id: [id ? id : null],
      name: [name ? name : '', Validators.required],
      area: [area.toFixed(2), [Validators.required, Validators.min(0.01)]],
      coordinates: [coordinates],
    });
  }

  submitField(): void {
    if (this.fieldForm && this.fieldForm.valid) {
      const fieldData = this.fieldForm.value;
      if (fieldData.id) {
        console.log('update field', fieldData);
        this.fieldService.updateField(fieldData.id, fieldData).subscribe({
          next: (updatedField) => {
            this.drawnItems.clearLayers();
            this.fieldsLayer.clearLayers();
            this.tasksLayer.clearLayers();
            this.fieldForm = null;
            this.loadFields();
            this.loadTasks();
            this.snackBar.open('Поле успішно оновлено', 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Помилка оновлення поля:', error);
            this.snackBar.open('Помилка оновлення поля', 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
        });
      } else {
        console.log('create field', fieldData);
        this.fieldService.createField(fieldData).subscribe({
          next: (createdField) => {
            this.drawnItems.clearLayers();
            this.fieldsLayer.clearLayers();
            this.tasksLayer.clearLayers();
            this.fieldForm = null;
            this.loadFields();
            this.loadTasks();
            this.snackBar.open('Поле успішно створено', 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Помилка створення поля:', error);
            this.snackBar.open('Помилка створення поля', 'Закрити', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          },
        });
      }
    }
  }

  cancelField(): void {
    this.fieldForm = null;
  }

  deleteSelectedField(): void {
    // Видалення виділеного поля
    this.drawnItems.eachLayer((layer: L.Layer) => {
      this.drawnItems.removeLayer(layer as L.Layer);
    });
  }

  private loadFields(): void {
    this.fieldService.getFields().subscribe((fields) => {
      fields.forEach((field) => {
        // Створення полігону для кожного поля
        const polygon = L.polygon(field.boundaries.coordinates, {
          //color: this.getFieldColor(field),
          color: 'grey',
          fillOpacity: 0.5,
          weight: 1,
        });

        // Додаємо полігон до drawnItems, щоб активувати редагування
        this.drawnItems.addLayer(polygon);

        // Додаємо шар на карту
        polygon.addTo(this.fieldsLayer);

        this.map.on('draw:edited', (e) => {
          const layers = (e as L.DrawEvents.Edited).layers;

          // get this drawnItems edited layer and update the form
          layers.eachLayer((layer: L.Layer) => {
            if (layer === polygon) {
              console.log('edited', layer);
              this.createFieldForm(layer as L.Polygon, field._id, field.name);
            }
          });
        });

        this.map.on('draw:delete', (e) => {
          console.log('delete', e);
        });

        this.map.on('draw:deleted', (e) => {
          const layers = (e as L.DrawEvents.Deleted).layers;

          // get this drawnItems edited layer and update the form
          layers.eachLayer((layer: L.Layer) => {
            if (layer === polygon) {
              console.log('deleted', layer);
              this.fieldService.deleteField(field._id).subscribe({
                next: (deletedField) => {
                  this.drawnItems.clearLayers();
                  this.fieldsLayer.clearLayers();
                  this.tasksLayer.clearLayers();
                  this.fieldForm = null;
                  this.loadFields();
                  this.loadTasks();
                  this.snackBar.open('Поле успішно видалено', 'Закрити', {
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    duration: 3000,
                  });
                },
                error: (error) => {
                  console.error('Помилка видалення поля:', error);
                  this.snackBar.open('Помилка видалення поля', 'Закрити', {
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    duration: 3000,
                  });
                },
              });
            }
          });
        });

        // Додавання спливаючої підказки з інформацією про поле
        polygon.bindPopup(`
          <b>Назва поля:</b> ${field.name}<br>
          <b>Площа:</b> ${field.area} гектарів<br>
          <b>Остання операція:</b> ${
            field.lastOperation?.type
              ? this.getTaskTypeLabel(field.lastOperation?.type)
              : 'Немає'
          }
        `);

        // Додавання label з назвою поля
        const label = L.divIcon({
          className: 'field-label',
          html: `<span>${field.name}</span>`,
        });
        L.marker(polygon.getBounds().getCenter(), { icon: label }).addTo(
          this.fieldsLayer
        );
      });
      this.centerMap();
    });
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.activeTasks = tasks;
      tasks.forEach((task) => {
        console.log('task', task);
        // Пошук відповідного поля для завдання
        this.fieldService.getFieldById(task.field._id).subscribe((field) => {
          console.log('field', field);
          // Розфарбовування поля залежно від типу завдання
          const taskPolygon = L.polygon(field.boundaries.coordinates, {
            color: this.getTaskColor(task),
            fillOpacity: 0.7,
            weight: 1,
            className: task.status,
          }).addTo(this.tasksLayer);

          // Спливаюча підказка з інформацією про завдання
          taskPolygon.bindPopup(`
            <b>Назва поля:</b> ${field.name}<br>
            <b>Площа:</b> ${field.area} гектарів<br>
            <b>Тип операції:</b> ${this.getTaskTypeLabel(task.operation)}<br>
            <b>Статус:</b> ${this.getTaskStatusLabel(task.status)}<br>
            <b>Час початку:</b> ${new Date(
              task.plannedDate
            ).toLocaleString()}<br>
            <b>Час завершення:</b> ${
              task.completedDate
                ? new Date(task.completedDate).toLocaleString()
                : 'Не вказано'
            }
          `);

          this.map.on('draw:editstart', (e) => {
            console.log('editstart', e);

            taskPolygon.getElement()?.classList.add('hidden');
          });

          this.map.on('draw:editstop', (e) => {
            console.log('editstop', e);

            taskPolygon.getElement()?.classList.remove('hidden');
          });

          this.map.on('draw:deletestart', (e) => {
            console.log('editdelete', e);

            taskPolygon.getElement()?.classList.add('hidden');
          });

          this.map.on('draw:deletestop', (e) => {
            console.log('editdelete', e);

            taskPolygon.getElement()?.classList.remove('hidden');
          });
        });
      });
    });
  }

  private getTaskColor(task: any): string {
    console.log(task);
    switch (task.operation) {
      case 'seeding':
        return 'green';
      case 'fertilizing':
        return 'yellow';
      case 'spraying':
        return 'blue';
      default:
        return 'gray';
    }
  }

  getTaskTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      seeding: 'Посів',
      fertilizing: 'Внесення добрив',
      spraying: 'Обприскування',
    };
    return labels[type] || type;
  }

  private getTaskStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      planned: 'Заплановано',
      in_progress: 'В процесі',
      completed: 'Виконано',
      failed: 'Не вдалося',
    };
    return labels[status] || status;
  }

  // Initiate the center of the map based on the drawn items
  private centerMap(): void {
    if (this.drawnItems.getLayers().length > 0) {
      this.map.fitBounds(this.drawnItems.getBounds());
    }
  }

  // Filter layers by operation
  filterLayersByOperation(operation: string): void {
    this.selectedOperation = operation;
    this.fieldsLayer.eachLayer((layer: L.Layer) => {
      layer.closePopup();
    });
    this.tasksLayer.eachLayer((layer: L.Layer) => {
      layer.closePopup();
      if (layer instanceof L.Polygon) {
        const isStatusMatch =
          layer.options.className === this.selectedStatus ||
          this.selectedStatus === 'all';
        const isOperationMatch =
          layer.options.color === operation || operation === 'all';

        if (isStatusMatch && isOperationMatch) {
          layer.getElement()?.classList.remove('hidden');
        } else {
          layer.getElement()?.classList.add('hidden');
        }
      }
    });
  }

  // Filter layers by status
  filterLayersByStatus(status: string): void {
    this.selectedStatus = status;
    this.fieldsLayer.eachLayer((layer: L.Layer) => {
      layer.closePopup();
    });
    this.tasksLayer.eachLayer((layer: L.Layer) => {
      layer.closePopup();
      if (layer instanceof L.Polygon) {
        const isStatusMatch =
          layer.options.className === status || status === 'all';
        const isOperationMatch =
          layer.options.color === this.selectedOperation ||
          this.selectedOperation === 'all';

        if (isStatusMatch && isOperationMatch) {
          layer.getElement()?.classList.remove('hidden');
        } else {
          layer.getElement()?.classList.add('hidden');
        }
      }
    });
  }
}
