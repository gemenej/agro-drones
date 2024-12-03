export interface Drone {
  _id: string;
  name: string;
  model: string;
  status: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  batteryLevel: number;
  serialNumber: string;
}
