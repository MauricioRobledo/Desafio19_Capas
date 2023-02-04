import Yargs from 'yargs';
import express from 'express';
import { logger } from '../../logger.js';
import os from "os"

const router = express.Router();

const numeroCPUs = os.cpus().length
// RUTA INFO
router.get("/info",(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    // console.log({argumentos: process.argv,
    //     plataforma: process.plataform,
    //     versionNode: process.versions.node,
    //     rss: process.memoryUsage.rss(),
    //     path: process.env.npm_execpath,
    //     processID: process.pid,
    //     carpetaProyecto: process.env.path,
    //     numeroCPUs: numeroCPUs})
    res.send({
        argumentos: process.argv,
        plataforma: process.plataform,
        versionNode: process.versions.node,
        rss: process.memoryUsage.rss(),
        path: process.env.npm_execpath,
        processID: process.pid,
        carpetaProyecto: process.env.path,
        numeroCPUs: numeroCPUs
    })
})

export {router as infoRouter}