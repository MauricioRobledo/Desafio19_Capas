import express from 'express';
import { ContenedorMongo } from '../../persistence/managers/contenedorMongo.js';
import { logger } from '../../logger.js';
import { productModel } from '../../persistence/models/modelProduct.js';
const router = express.Router();

// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorMongo(productModel)


router.get('/productos/:id',async(req,res)=>{
    const productId = req.params.id;
    const product = await productosApi.getById(parseInt(productId));
    if(product){
        return res.send(product)
    } else{
        logger.error("Producto no encontrado")
        return res.send({error : 'producto no encontrado'})
    }
})

router.post('/productos',async(req,res)=>{
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    if(!result){
        logger.error("Error al crear el producto")
        res.send("No se pudo crear el producto")
    }else{
        res.send(result);
    }
})

router.put('/productos/:id',async(req,res)=>{
    const cambioObj = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId),cambioObj);
    if(!result){
        logger.error("Error al actualizar el producto")
        res.send("No se pudo actualizar el producto")
    }else{
        res.send(result);
    }
})

router.delete('/productos/:id',async(req,res)=>{
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    if(!result){
        logger.error("Error al eliminar producto")
        res.send("No se pudo eliminar el producto")
    }else{
        res.send(result);
    }
    
})

router.get('/productos', async(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    res.render('products',{products: await productosApi.getAll()})
})

router.get("/productos-test",async(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    res.render('products',{
        products: randomProducts()
    })
})


export {router as productRouter};