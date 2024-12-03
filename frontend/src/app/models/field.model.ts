export interface Field {
  _id: string;
  name: string;
  area: number;
  boundaries: {
    type: string;
    coordinates: Array<[number, number]>;
  };
  coordinates: Array<[number, number]>;
  lastOperation?: {
    type: string;
    startTime: Date;
  };
}
