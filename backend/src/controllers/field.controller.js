import Field from "../models/field.model.js";
import Task from "../models/task.model.js";
import Drone from "../models/drone.model.js";

export const getAllFields = async (req, res) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fields", error: error.message });
  }
};

export const getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.json(field);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching field", error: error.message });
  }
};

export const createField = async (req, res) => {
  try {
    const fieldData = {
      name: req.body.name,
      boundaries: {
        type: "Polygon",
        coordinates: req.body.coordinates,
      },
      area: req.body.area,
      crops: req.body.crops,
    };

    const field = new Field(fieldData);
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating field", error: error.message });
  }
};

export const updateField = async (req, res) => {
  try {
    const updates = req.body;
    updates.boundaries = {
      type: "Polygon",
      coordinates: req.body.coordinates,
    };
    const field = await Field.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    if (updates.coordinates) {
      // update tasks with the new field coordinates
      const tasks = await Task.find({ fieldId: field._id });
      tasks.forEach(async (task) => {
        task.coverage = {
          type: "Polygon",
          coordinates: updates.coordinates,
        };
        await task.save();
      });
      
    }

    res.json(field);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating field", error: error.message });
  }
};

export const deleteField = async (req, res) => {
  try {
    const field = await Field.findByIdAndDelete(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    
    // update drone status
    const tasks = await Task.find({ fieldId: field._id });
    tasks.forEach(async (task) => {
      const drone = await Drone.findById(task.droneId);
      if (drone) {
        drone.status = "available";
        await drone.save();
      }
    });

    // delete tasks associated with the field
    await Task.deleteMany({ fieldId: field._id });

    res.json(field);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting field", error: error.message });
  }
};

export const updateFieldOperation = async (req, res) => {
  try {
    const { operation, date } = req.body;
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.lastOperation = {
      type: operation,
      date: date || new Date(),
    };

    await field.save();
    res.json(field);
  } catch (error) {
    res.status(400).json({
      message: "Error updating field operation",
      error: error.message,
    });
  }
};
