import mongoose from "mongoose";
const Schema = mongoose.Schema;

const droneSchema = new Schema(
  {
    name: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    batteryLevel: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "in_mission", "charging", "maintenance"],
      default: "available",
    },
    lastMission: { type: Date },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Drone", droneSchema);
