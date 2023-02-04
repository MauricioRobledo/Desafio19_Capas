import mongoose from "mongoose"
import { config } from "./config.js"



export const connectDB = ()=>{
    const mongoUrl = config.mongoUrl
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoUrl,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    },(error)=>{
        if (error) return console.log(`Hubo un error conectandose a la base ${error}`)
        console.log("Conexion exitosa")
    })
}