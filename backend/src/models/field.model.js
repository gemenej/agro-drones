import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fieldSchema = new Schema(
  {
    name: { type: String, required: true },
    boundaries: {
      type: {
        type: String,
        enum: ["Polygon"],
        default: "Polygon",
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of coordinates forming a polygon
        required: true,
      },
    },
    area: { type: Number, required: true }, // in hectares
    crops: { type: String },
    lastOperation: {
      type: { type: String, enum: ["seeding", "fertilizing", "spraying"] },
      date: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Field", fieldSchema);
