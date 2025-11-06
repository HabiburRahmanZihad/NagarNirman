// Task Model Schema
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'completed', 'cancelled'],
    default: 'pending',
  },
  proofURL: {
    type: String,
    default: null,
  },
  proofDescription: {
    type: String,
    default: null,
  },
  rewardGranted: {
    type: Boolean,
    default: false,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  deadline: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  feedback: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for common queries
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ reportId: 1 });
taskSchema.index({ status: 1, createdAt: -1 });

// Update completedAt when status changes to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
