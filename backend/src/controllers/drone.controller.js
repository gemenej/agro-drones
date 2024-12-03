import Drone from "../models/drone.model.js";
import Task from "../models/task.model.js";

export const getAllDrones = async (req, res) => {
  try {
    const drones = await Drone.find();
    const count = await Drone.countDocuments();
    res.json({
        drones,
        total: count
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drones", error: error.message });
  }
};

export const getDroneById = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone) {
      return res.status(404).json({ message: "Дрон не знайдений" });
    }
    res.json(drone);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drone", error: error.message });
  }
};

export const createDrone = async (req, res) => {
  try {
    const droneData = {
      name: req.body.name,
      serialNumber: req.body.serialNumber,
      batteryLevel: req.body.batteryLevel,
      status: req.body.status,
      location: {
        type: "Point",
        coordinates: req.body.coordinates,
      },
    };

    const drone = new Drone(droneData);
    await drone.save();
    res.status(201).json(drone);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating drone", error: error.message });
  }
};

export const updateDrone = async (req, res) => {
  try {
    const updates = req.body;
    const drone = await Drone.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!drone) {
      return res.status(404).json({ message: "Дрон не знайдений" });
    }
    res.json(drone);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating drone", error: error.message });
  }
};

export const deleteDrone = async (req, res) => {
  try {
    const tasks = await Task.find({ droneId: req.params.id });
    if (tasks.length > 0) {
      return res
        .status(409)
        .json({ message: "Дрон має завдання, спочатку видаліть їх" });
    }
    const drone = await Drone.findByIdAndDelete(req.params.id);
    if (!drone) {
      return res.status(404).json({ message: "Дрон не знайдений" });
    }
    res.json({ message: "Дрон успішно видалений" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting drone", error: error.message });
  }
};

export const updateDroneStatus = async (req, res) => {
  try {
    const { status, batteryLevel, coordinates } = req.body;
    const drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({ message: "Дрон не знайдений" });
    }

    if (status) drone.status = status;
    if (batteryLevel) drone.batteryLevel = batteryLevel;
    if (coordinates) {
      drone.location = {
        type: "Point",
        coordinates: coordinates,
      };
    }

    await drone.save();
    res.json(drone);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating drone status", error: error.message });
  }
};
