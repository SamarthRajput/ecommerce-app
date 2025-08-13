import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getAllCategory } from "../controllers/category.controller";

const categoryRouter = Router();

// get all category
// /api/v1/category/all
categoryRouter.get("/all", asyncHandler(getAllCategory));


export default categoryRouter;