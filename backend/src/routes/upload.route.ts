import { Router } from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../lib/uploadthing";

const router = Router();

router.use(
    "/uploadthing",
    createRouteHandler({
        router: uploadRouter,
        config: {},
    }),
);

export default router;
