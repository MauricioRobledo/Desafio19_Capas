import express from 'express';
import passport from "passport"
import {Strategy as localStrategy} from "passport-local"
import bcrypt from "bcrypt"
import { logger } from '../../logger.js';
import { UserModel } from '../../persistence/models/user.js';
import {faker} from "@faker-js/faker"



const router = express.Router();


router.use(passport.initialize())
router.use(passport.session())


passport.serializeUser((user,done)=>{
    done(null, user.id)
});


passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(err, userFound)=>{
        return done(err, userFound)
    })
});

const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    return hash;
}

passport.use("signupStrategy", new localStrategy(
    {
        passReqToCallback: true,
        usernameField: "email",
    },
    (req,username,password,done)=>{
        UserModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"})
            if(userFound) return done(null,null,{message:"El usuario ya existe"})
            const newUser ={
                name:req.body.name,
                username:username,
                password:createHash(password)
            }
            UserModel.create(newUser,(error, userCreated)=>{
                if(error) return done(error,null,{message:"Error al registrar el usuario"})
                return done(null,userCreated)
            })
        })
    }
))

passport.use("loginStrategy", new localStrategy(
    {
        usernameField: "email"
    },
    (username,password,done)=>{
        UserModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"})
            if (!userFound) return done(null,null,{message:"Error este usuario no existe"})
            const igual = bcrypt.compareSync(password, userFound.password)
            console.log(igual)
            if(!igual){
                return done(null,null,{message:"Contraseña incorrecta"})
            }
            return done(null,userFound)
        })
    }
))

const {commerce, image} = faker

const randomProducts = ()=>{
    let products = []
    for(let i=0;i<5;i++){
        products.push({
            title:commerce.product(),
            price:commerce.price(),
            thumbnail:image.imageUrl()
        })
    }
    return products
}


router.get("/signup", (req, res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", {error:errorMessage});
    req.session.messages = [];
})

router.get("/login",(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("login", {error:errorMessage});
    req.session.messages = [];
})

router.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/signup",
    failureMessage:true
}),(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    res.redirect("/")
})

router.post("/login",passport.authenticate("loginStrategy",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureMessage:true
}),(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
})


router.get("/logout",(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    req.session.destroy()
    res.redirect("/login")
})


router.get('/', async(req,res)=>{
    const ruta = req.path
    const metodo = req.method
    logger.info(`Ruta: ${ruta} y metodo: ${metodo}`)
    if(req.isAuthenticated()){
        res.render('home')
    } else{
        res.send("<div>Debes <a href='/login'>inciar sesion</a> o <a href='/signup'>registrarte</a></div>")
    }
})

''

export {router as viewsRouter}