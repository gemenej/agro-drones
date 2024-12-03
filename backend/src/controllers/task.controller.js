import Task from "../models/task.model.js";
import Drone from "../models/drone.model.js";
import Field from "../models/field.model.js";
import * as logger from "../services/logger.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("droneId")
      .populate("fieldId")
      .then((tasks) => {
        return tasks.map((task) => {
          const { droneId, fieldId, ...rest } = task.toObject();
          return {
            ...rest,
            drone: droneId,
            field: fieldId,
          };
        });
      });

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("droneId")
      .populate("fieldId");
    if (!task) {
      return res.status(404).json({ message: "Завдання не знайдене" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні завдання",
      error: error.message,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const drone = await Drone.findById(req.body.drone);
    if (!drone) {
      return res.status(404).json({ message: "Дрон не знайдений" });
    }
    logger.logInfo(`drone: ${drone}`);

    const field = await Field.findById(req.body.field);
    if (!field) {
      return res.status(404).json({ message: "Поле не знайдене" });
    }

    // transform date from startDate and startTime
    const startDate = new Date(req.body.startTime);
    const startTime = req.body.startHour.split(":");
    startDate.setHours(startTime[0], startTime[1]);

    // transform date to completedDate from startDate and period
    const completedDate = new Date(
      startDate.getTime() + req.body.period * 60 * 60 * 1000
    );

    const taskData = {
      droneId: drone._id,
      fieldId: field._id,
      operation: req.body.operation,
      status: req.body.status,
      plannedDate: startDate,
      period: req.body.period,
      completedDate: completedDate,
    };

    // check drone availability
    const isDroneAvailable = await checkDroneAvailability(taskData, res);
    if (!isDroneAvailable) {
      return res.status(409).json({ message: "Дрон недоступний у цей період" });
    }

    const task = new Task(taskData);
    await task.save();

    // Update field lastOperation
    field.lastOperation = {
      type: req.body.operation,
      date: new Date(),
    };
    await field.save();

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, telemetryData } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Завдання не знайдене" });
    }

    if (status) {
      task.status = status;
      if (status === "completed") {
        task.completedDate = new Date();
      }
    }

    if (telemetryData) {
      task.telemetryData.push(telemetryData);
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task", error: error.message });
  }
};

export const getTaskTelemetry = async (req, res) => {
  try {
    const { telemetryData } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Завдання не знайдене" });
    }

    task.telemetryData.push({
      timestamp: new Date(),
      location: {
        type: "Point",
        coordinates: telemetryData.coordinates,
      },
      altitude: telemetryData.altitude,
      speed: telemetryData.speed,
      batteryLevel: telemetryData.batteryLevel,
    });

    await task.save();
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task telemetry", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Завдання не знайдене" });
    }

    res.json({ message: "Завдання успішно видалене" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updates = req.body;
    logger.logInfo(`updates: ${JSON.stringify(updates)}`);

    // transform date from startDate and startTime
    if (req.body.plannedDate) {
      const startDate = new Date(req.body.plannedDate);
      const startTime = req.body.startHour.split(":");
      startDate.setHours(startTime[0], startTime[1]);
      updates.plannedDate = startDate;
    }

    // transform date to completedDate from startDate and period
    if (req.body.period) {
      const completedDate = new Date(
        updates.plannedDate.getTime() + req.body.period * 60 * 60 * 1000
      );
      updates.completedDate = completedDate;
    }

    if(req.body.drone) {
      const drone = await Drone.findById(req.body.drone);
      if (!drone) {
        return res.status(404).json({ message: "Дрон не знайдений" });
      }
      updates.droneId = drone._id;
    }
    
    // check drone availability
    const isDroneAvailable = await checkDroneAvailability(updates, res);
    if (!isDroneAvailable) {
      return res.status(409).json({ message: "Дрон недоступний у цей період" });
    }

    updates.coverage = {
      type: "Polygon",
      coordinates: req.body.coordinates,
    };

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Завдання не знайдене" });
    }

    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task", error: error.message });
  }
};

// check drone availability depending on the plannedDate & period of tasks
export const checkDroneAvailability = async (task, res) => {
  try {
    const { droneId, plannedDate, period } = task;
    
    const query = task._id ? { droneId: droneId, _id: { $ne: task._id } } : { droneId: droneId };

    const tasks = await Task.find(query);

    if (!tasks.length) {
      return true;
    }

    const plannedTimestamp = getTimestampFromDate(plannedDate);
    const plannedEndTimestamp = plannedTimestamp + period * 60 * 60 * 1000;

    for (let task of tasks) {
      const taskPlannedTimestamp = getTimestampFromDate(task.plannedDate);
      const taskPlannedEndTimestamp = getTimestampFromDate(task.completedDate);
      if (
        (plannedTimestamp >= taskPlannedTimestamp &&
          plannedTimestamp <= taskPlannedEndTimestamp) ||
        (plannedEndTimestamp >= taskPlannedTimestamp &&
          plannedEndTimestamp <= taskPlannedEndTimestamp)
      ) {
        return false;
      }
    }
    return true;
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error checking drone availability",
        error: error.message,
      });
  }
};

// function to get timestamp from date
export const getTimestampFromDate = (date) => {
  return date.getTime();
};
