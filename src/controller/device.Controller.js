import Device from "../models/deviceModel.js";

const addDevice = async (req, res) => {
  const { name, type, status } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name, and type are required" });
  }

  // Generate an 8-digit unique ID
  const unique_id = Math.floor(10000000 + Math.random() * 90000000);

  try {
    const newDevice = new Device({
      unique_id,
      name,
      type,
      status,
    });

    await newDevice.save();
    res.status(201).json({
      success: true,
      message: "Device added successfully",
      device: newDevice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const device = await Device.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Device updated successfully",
      device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // 50 docs per page
    const skip = (page - 1) * limit;

    const totalDevices = await Device.countDocuments();
    const totalPages = Math.ceil(totalDevices / limit);

    // Validate page number
    if (page > totalPages && totalDevices > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
      });
    }

    const devices = await Device.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    res.status(200).json({
      success: true,
      message: "Devices retrieved successfully",
      pagination: {
        currentPage: page,
        totalPages,
        totalDevices,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
        showing: devices.length,
      },
      devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Device retrieved successfully",
      device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Device deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { addDevice, updateDevice, getAllDevices, getDeviceById, deleteDevice };
