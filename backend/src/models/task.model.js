import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    droneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    operation: {
      type: String,
      enum: ["seeding", "fertilizing", "spraying"],
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "failed"],
      default: "planned",
    },
    plannedDate: { type: Date, required: true },
    period: { type: Number, required: true },
    completedDate: { type: Date },
    coverage: {
      type: {
        type: String,
        enum: ["Polygon"],
        default: "Polygon",
      },
      coordinates: {
        type: [[[Number]]],
      },
    },
    // data from the drone
    telemetryData: [
      {
        timestamp: Date,
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: [Number],
        },
        altitude: Number,
        speed: Number,
        batteryLevel: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
