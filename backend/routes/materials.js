import express from 'express';
import Material from '../models/Material.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  const material = await Material.create(req.body);
  res.json(material);
});

router.get('/', async (req, res) => {
  const materials = await Material.find();
  res.json(materials);
});

export default router;