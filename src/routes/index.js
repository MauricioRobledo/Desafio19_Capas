import express from "express";
import { viewsRouter } from "./api/viewsRouter.js";
import { productRouter } from "./api/productsRouter.js";
import { infoRouter } from "./api/infoRouter.js";


const router = express.Router()
router.use("/",viewsRouter)
router.use("/",productRouter)
router.use("/",infoRouter)

export {router as apiRouter}