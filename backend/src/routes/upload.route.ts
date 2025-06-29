import { Router } from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../lib/uploadthing";

export const uploadThingRouter = Router();

uploadThingRouter.use(
    "/uploadthing",
    createRouteHandler({
        router: uploadRouter,
        config: {},
    }),
);