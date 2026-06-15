import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: String,
  printer: String,
  printerId: String,
  material: String,
  slot: String,
  date: String,
  fileName: String,
  quote: {
    materialUsageGrams: Number,
    supportWeightGrams: Number,
    printTimeMinutes: Number,
    printTimeLabel: String,
    materialCost: Number,
    machineCost: Number,
    handlingFee: Number,
    totalCost: Number,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

export default mongoose.model('Booking', bookingSchema);