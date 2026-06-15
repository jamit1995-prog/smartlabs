import express from 'express';
import { getPrinterById, getLiveState } from '../data/printerData.js';

const router = express.Router();

router.get('/:printerId', (req, res) => {
  const printer = getPrinterById(req.params.printerId);

  if (!printer) {
    return res.status(404).json({ message: 'Printer not found' });
  }

  const liveFeed = getLiveState(req.params.printerId);

  res.json({ printer, liveFeed });
});

export default router;
