import express from  'express';
import { test } from '../controllers/use.controller.js';

const router = express.Router();

router.get('/test-route', test);

export default router;