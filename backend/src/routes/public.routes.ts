import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { getMasterdata } from '../controllers/publicController';

const publicRouter = express.Router();

// GET MASTER DATA
publicRouter.get('/master-data', asyncHandler(getMasterdata));

export default publicRouter;