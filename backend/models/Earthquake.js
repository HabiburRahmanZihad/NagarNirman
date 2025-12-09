import mongoose from 'mongoose';

const earthquakeSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    magnitude: {
      type: Number,
      required: true,
      min: 0,
      max: 9.9,
    },
    depth: {
      type: Number,
      required: true,
      description: 'Depth in kilometers',
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    intensity: {
      type: String,
      enum: ['Not Felt', 'Weak', 'Light', 'Moderate', 'Strong', 'Very Strong', 'Severe', 'Violent', 'Extreme'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    affectedAreas: [{
      type: String,
    }],
    reportedDamage: {
      type: String,
      enum: ['None', 'Minor', 'Moderate', 'Severe', 'Unknown'],
      default: 'Unknown',
    },
    casualties: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: 'USGS',
    },
    alertLevel: {
      type: String,
      enum: ['Green', 'Yellow', 'Orange', 'Red'],
      default: 'Green',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location queries
earthquakeSchema.index({ 'coordinates.coordinates': '2dsphere' });
earthquakeSchema.index({ timestamp: -1 });
earthquakeSchema.index({ magnitude: -1 });
earthquakeSchema.index({ alertLevel: 1 });

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

export default Earthquake;
