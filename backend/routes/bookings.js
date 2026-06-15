import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  const booking = await Booking.create({
    user: req.body.user,
    printer: req.body.printer,
    printerId: req.body.printerId,
    material: req.body.material,
    slot: req.body.slot,
    date: req.body.date,
    fileName: req.body.fileName,
    quote: req.body.quote,
    status: 'confirmed',
  });

  res.json(booking);
});

router.get('/', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

export default router;