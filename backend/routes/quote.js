import express from 'express';
import { getPrinterById } from '../data/printerData.js';

const router = express.Router();
const materialRatePerKg = {
  'PLA+': 1200,
  PETG: 1450,
  TPU: 2200,
  ABS: 1700,
};

function formatEta(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return '-';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function estimateQuote({ sizeBytes, material, printerId, quality }) {
  const baseWeight = Math.max(15, Math.round(sizeBytes / 14000));
  const supportWeight = Math.round(baseWeight * 0.14);
  const materialUsageGrams = baseWeight + supportWeight;
  const printTimeMinutes = Math.max(45, Math.round(sizeBytes / 180000) * 15 + 30);

  const qualityMultiplier = quality === 'high' ? 1.2 : quality === 'fast' ? 0.88 : 1;
  const effectivePrintTime = Math.round(printTimeMinutes * qualityMultiplier);
  const materialCost = Math.round((materialUsageGrams / 1000) * (materialRatePerKg[material] || 1500));
  const machineCost = Math.round((effectivePrintTime / 60) * 180);
  const handlingFee = 120;
  const total = materialCost + machineCost + handlingFee;

  const printer = getPrinterById(printerId);
  const recommendedPrinter = printer ? printer.name : 'Bambu Lab X1 Carbon';

  return {
    material,
    quality,
    printerId,
    recommendedPrinter,
    materialUsageGrams,
    supportWeightGrams: supportWeight,
    printTimeMinutes: effectivePrintTime,
    printTimeLabel: formatEta(effectivePrintTime),
    materialCost,
    machineCost,
    handlingFee,
    totalCost: total,
  };
}

router.post('/', (req, res) => {
  const { fileName, sizeBytes, material = 'PLA+', printerId, quality = 'standard' } = req.body;

  if (!fileName || !sizeBytes || !printerId) {
    return res.status(400).json({ message: 'fileName, sizeBytes, and printerId are required' });
  }

  const quote = estimateQuote({ sizeBytes: Number(sizeBytes), material, printerId, quality });

  res.json({ quote, file: { fileName, sizeBytes }, requestedPrinter: printerId });
});

export default router;
