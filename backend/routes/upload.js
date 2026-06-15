import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const uploadsDir = path.resolve('uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

function estimateSlice(file, sizeBytes) {
  const realSize = Number(sizeBytes) || 0;
  const modelWeight = Math.max(18, Math.round(realSize / 14000));
  const supportWeight = Math.round(modelWeight * 0.12);
  const printTime = Math.max(40, Math.round(realSize / 165000) * 10 + 25);

  return {
    fileName: file.originalname,
    sizeBytes: realSize,
    materialUsageGrams: modelWeight,
    supportMaterialGrams: supportWeight,
    totalMaterialGrams: modelWeight + supportWeight,
    printTimeMinutes: printTime,
    printTimeLabel: `${Math.floor(printTime / 60)}h ${printTime % 60}m`,
    recommendedPrinter: 'Bambu Lab P1S Combo',
    slicer: 'Bambu Studio CLI',
  };
}

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const analysis = estimateSlice(req.file, req.file.size);

  res.json({
    message: 'File Uploaded Successfully',
    file: req.file,
    analysis,
  });
});

export default router;
