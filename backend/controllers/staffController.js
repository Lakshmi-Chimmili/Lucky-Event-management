const User = require('../models/User');
const StaffProfile = require('../models/StaffProfile');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Admin or Staff)
const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await User.find({ role: 'staff' }).select('-passwordHash');
    const staffProfiles = await StaffProfile.find().populate('user', '-passwordHash');

    const combined = staffMembers.map(member => {
      const profile = staffProfiles.find(p => p.user && p.user._id.toString() === member._id.toString());
      return {
        _id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone || (profile ? profile.phone : ''),
        isActive: member.isActive,
        specialization: profile ? profile.specialization : 'Event Coordinator',
        experience: profile ? profile.experience : '2+ Years',
        skills: profile ? profile.skills : [],
        availability: profile ? profile.availability : true,
        profileId: profile ? profile._id : null,
        createdAt: member.createdAt
      };
    });

    return res.status(200).json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching staff members'
    });
  }
};

// @desc    Create a new staff member & profile
// @route   POST /api/staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const staffUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      phone: phone || '',
      role: 'staff'
    });

    const staffProfile = await StaffProfile.create({
      user: staffUser._id,
      phone: phone || '',
      specialization: specialization || 'Event Manager',
      experience: experience || '3+ Years',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Management', 'Coordination'])
    });

    return res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: {
        _id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        specialization: staffProfile.specialization,
        experience: staffProfile.experience,
        skills: staffProfile.skills
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating staff member'
    });
  }
};

// @desc    Update staff profile
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
  try {
    const { name, phone, specialization, experience, skills, isActive, availability } = req.body;

    const staffUser = await User.findById(req.params.id);
    if (!staffUser || staffUser.role !== 'staff') {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    if (name) staffUser.name = name;
    if (phone !== undefined) staffUser.phone = phone;
    if (isActive !== undefined) staffUser.isActive = isActive;
    await staffUser.save();

    let profile = await StaffProfile.findOne({ user: staffUser._id });
    if (!profile) {
      profile = new StaffProfile({ user: staffUser._id });
    }

    if (phone !== undefined) profile.phone = phone;
    if (specialization) profile.specialization = specialization;
    if (experience) profile.experience = experience;
    if (skills) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (availability !== undefined) profile.availability = availability;
    if (isActive !== undefined) profile.isActive = isActive;

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating staff member'
    });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff
};
