import mongoose from 'mongoose';

const pitchSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    required: true,
  },
  keyPoints: {
    type: [String],
    required: true,
  },
  generatedPitch: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Check if model exists before creating
const Pitch = mongoose.models.Pitch || mongoose.model('Pitch', pitchSchema);

export { Pitch }; 