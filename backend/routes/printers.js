import express from 'express';
import { printerFleet, printerLiveState, getPrinterById, updateLiveState } from '../data/printerData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ printers: printerFleet });
});

router.get('/:printerId', (req, res) => {
  const printer = getPrinterById(req.params.printerId);

  if (!printer) {
    return res.status(404).json({ message: 'Printer not found' });
  }

  const liveFeed = printerLiveState[req.params.printerId] || null;
  res.json({ printer, liveFeed });
});

router.post('/:printerId/control', (req, res) => {
  const printer = getPrinterById(req.params.printerId);
  const { action } = req.body;

  if (!printer) {
    return res.status(404).json({ message: 'Printer not found' });
  }

  if (!action) {
    return res.status(400).json({ message: 'Action is required' });
  }

  let liveState = printerLiveState[req.params.printerId];

  switch (action) {
    case 'start':
      printer.status = 'Printing';
      liveState = updateLiveState(req.params.printerId, {
        status: 'Printing',
        progress: Math.max(liveState?.progress || 0, 8),
        timeRemaining: liveState?.estimatedTime || '2h 10m',
        statusMessage: 'Print started',
        currentFile: liveState?.currentFile || 'Unknown print file',
        fileInfo: liveState?.fileInfo || 'Layer 1 / TBD',
      });
      break;
    case 'pause':
      printer.status = 'Paused';
      liveState = updateLiveState(req.params.printerId, {
        status: 'Paused',
        statusMessage: 'Print paused',
      });
      break;
    case 'stop':
      printer.status = 'Available';
      liveState = updateLiveState(req.params.printerId, {
        status: 'Available',
        progress: 0,
        timeRemaining: '-',
        currentFile: '-',
        estimatedTime: '-',
        statusMessage: 'Printer idle',
        fileInfo: 'No active file',
      });
      break;
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }

  res.json({ printer, liveFeed: liveState });
});

export default router;
