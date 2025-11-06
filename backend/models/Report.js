// Report Model Schema
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const historySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'road_infrastructure',
      'lighting_electrical',
      'garbage_sanitation',
      'water_supply',
      'public_facilities',
      'environmental',
      'safety',
      'health_hygiene',
      'transport',
      'other'
    ],
  },
  subcategory: {
    type: String,
    default: null,
  },
  photoURL: {
    type: String,
    required: [true, 'Photo is required'],
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]',
      },
    },
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'resolved'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  history: [historySchema],
  upvotes: {
    type: Number,
    default: 0,
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
reportSchema.index({ 'location.coordinates': '2dsphere' });

// Index for common queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ 'location.district': 1, status: 1 });
reportSchema.index({ createdBy: 1 });

// Add to history when status changes
reportSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.history.push({
      status: this.status,
      updatedBy: this.assignedTo || this.createdBy,
      date: new Date(),
    });
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
