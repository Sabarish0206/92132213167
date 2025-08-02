import express from 'express';
import Log from '../../login.js'; 

const router = express.Router();

// POST /log
router.post('/', async (req, res) => {
  const { stack, level, package: pkg, message } = req.body;

  if (!stack || !level || !pkg || !message) {
    return res.status(400).json({ error: 'All fields are required: stack, level, package, message' });
  }

  try {
    const response = await Log(stack, level, pkg, message);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send log', details: err.message });
  }
});

export default router;
