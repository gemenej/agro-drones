import { Drone } from "./drone.model";

export interface Task {
  _id: string;
  drone: Drone;
  field: {
    _id: string;
    name: string;
  };
  fieldId: {
    _id: string;
    name: string;
  };
  operation: 'seeding' | 'fertilizing' | 'spraying';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  plannedDate: Date;
  startHour?: string;
  period?: number;
  completedDate?: Date;
}
