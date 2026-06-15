import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: String,
  color: String,
  stock: Number,
  pricePerKg: Number,
});

export default mongoose.model('Material', materialSchema);