const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const cors = require('cors');
const shortid = require('shortid');
const mongoose = require('./db/mongodb-connect');
const {mongo} = require('mongoose');
const multer  = require('multer');
const path = require('path');
const socketIo = require('socket.io');
app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(cors());




//Multer
const storage = multer.diskStorage({ 
    destination: (req,file, cb) => {
        cb(null, process.cwd()+"/upfiles/");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname) )
    }

})

const upload = multer({storage: storage})

let listSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        unique: true
    },
    tipo:{
        type: String,
        required: true,
    },
    descripcion:{
        type: String
    },
    imagen:{
        type: String
    },
    elementos:{
        type: Array
    },
    id:{
        type: String, 
        unique: true
    },
    user:{
        type: String
    }
      
})

listSchema.statics.actualizarLista = async function(datos, id){
    try {
        await List.findOneAndUpdate(
            {id},
            {$set:datos},
            {new:true,
            useFindAndModify:false})
        return true
    } catch (error) {
        console.log("actualizando lista");
        console.log(error);
        return false
    }
    
}

listSchema.statics.añadirElementos= async function(datos, id){
    try {
        console.log(datos);
        await List.findOneAndUpdate(
            {id},
            {$push: {'elementos':datos}},
            {new:true,
            useFindAndModify:false})
        return true
    } catch (error) {
        console.log("Error actualizando lista");
        console.log(error);
        return false
    }
    
}

const List = mongoose.model('listas', listSchema);

let userSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true,
    },
    correo:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    img:{
        type: String,
        required: false,
    },
    sexo:{
        type: String,
        required: true,
    },
    id:{
        type: String,
        required: true,
    }
      
})

userSchema.statics.actualizarUsuario= async function(datos, id){
    try {
        await User.findOneAndUpdate(
            {id},
            {$set:datos},
            {new:true,
            useFindAndModify:false})
        return true
    } catch (error) {
        console.log(error);
        return false
    }
    
}

const User = mongoose.model('usuarios',userSchema);

app.route('/api/registro')
    .post( async (req, res)=>{
        let finder= await searchRegistro(req.body.nombre,req.body.apellido,req.body.correo)
        if(finder==1){
            req.body.id=shortid.generate()
            let {nombre, apellido, correo, password, img, sexo, id} = req.body;
            let newUser = User({nombre, apellido, correo, password, img, sexo, id})
            let resp = await saveUser(newUser)
            res.status(201).send("Usuario guardado")
        }else{
            res.status(400).send("Este usuario ya existe")
        }      
    })

app.route('/api/login')
    .post( async (req, res)=>{
        let finder = await searchLogin(req.body.correo, req.body.password);
        if(finder!=""&&finder!=null){
            res.status(200).send(finder.id);
        }else{
            res.status(400).send("El correo o la contraseña no son corectas");
        }
    })

app.route('/api/perfil/:id')
    .get(async (req,res)=>{
        let finder = await searchUser(req.params.id);
        if(finder!=""&&finder!=null){
            res.status(200).send(finder);
        }else{
            res.status(404).send("No se ha encontrado a este usuario");
        } 
    })

    

app.route('/api/editar/:id')
.put( async (req,res)=>{    
    try{
     let doc = await searchUser(req.params.id);
     if(doc){
        let x = await User.actualizarUsuario(req.body, req.params.id);
        if(x==true){
            res.status(200).send("Se actualizó con exito")
        }else{
            res.status(400).send("No se modificó el usuario")
        }
        console.log(x);
        
     }
    }catch(err){
        console.log(err);
        res.status(404).send({error:"No se encontró el usuario"})
    }

})

app.route('/api/getList/:user')
    .get( async (req,res) =>{
        let finder = await searchList(req.params.user);
        if(finder!=""&&finder!=null){
            res.status(200).send(finder);
        }else{
            console.log(finder);
            res.status(400).send("No hay coincidencias");
        }
    })

app.route('/api/getSingle/:id')
    .get(async (req,res) =>{
        let finder = await searchSingle(req.params.id);
        if(finder!=""&&finder!=null){
            res.status(200).send(finder);
        }else{
            res.status(400).send("nothing here");
        }
    })

app.route('/api/crearL')
    .post( async (req, res)=>{
        req.body.id=shortid.generate()
        let {nombre, tipo, descripcion, imagen, elementos, id, user} = req.body;
        let newList = List({nombre, tipo, descripcion, imagen, elementos, id, user})
        let resp = await saveList(newList)
        if(resp){
            res.status(200).send("Lista creada con exito");
        }else{
            res.status(404).send("Ya existe esta lista");
        }
    })

app.route('/api/borrarL/:id')
    .delete(async(req,res)=>{
        let finder = await deleteList(req.params.id)
        if(finder){
            res.status(200).send("Lista borrada con exito");
        }else{
            res.status(404).send("No existe esta lista");
        }
        
    })


    app.route('/api/elementos/:id')
    .put(async(req,res)=>{
        try{
             let doc = await searchList(req.params.id);
             if(doc){
                console.log(req.body);
                console.log(req.body.elementos);
                console.log(typeof req.body.elementos);
                let x = await List.añadirElementos(req.body.elementos, req.params.id);
                if(x==true){
                    res.status(200).send("Se añadio con exito")
                }else{
                    res.status(400).send("No se modifico la lista")
                }
                
             }
            }catch(err){
                console.log(err);
                res.status(404).send({error:"No se encontró la lista"})
            }
    })


app.get("/upload", (req,res) => {
    res.render("upload");
});


app.post("/upload", upload.single("doc"), (req, res)  =>{
    console.log("file added!")
    res.send("file uploaded!");
});

async function deleteList(id){
    try{
        let borrado = await List.findOneAndDelete({id})   
        return(borrado);
    }catch(e){
        return(e);
    } 
}

async function searchUser(id){
    try{
        let resp = await User.findOne({id})
        return(resp);
    }catch(e){
        return(e);
    }
}
    
async function searchList(user){
    try{
        let resp = await List.find({user});
        console.log(resp);
        return(resp);
        
    }catch(e){
        console.log(resp);
        return(e)
    }
}

async function searchSingle(id){
    try{
        let resp = await List.findOne({id});
        console.log(resp);
        return(resp);
    }catch(e){
        console.log(resp);
        return(e);
    }
}

async function searchLogin(correo, password){
    try{
        let resp1 = await User.findOne({correo})
        let resp2 = await User.findOne({password})
        if((JSON.stringify(resp1) == JSON.stringify(resp2))&&(JSON.stringify(resp1)!='[]')){
            return(resp1);
        }else{
            return(null)
        }
            
    }catch(e){
        return(e);
    }
}
    
async function searchRegistro(nombre, apellido, correo){
    try{
        let x=0
        let resp1 = await User.find({nombre});
        let resp2 = await User.find({apellido});
        let resp3 = await User.find({correo});
        if((JSON.stringify(resp1)!='[]')&&(JSON.stringify(resp2)!='[]')){
            x++;
        }
        if((JSON.stringify(resp3)!='[]')){
            x++;
        }
        if(x==0){
            return (1);
        }else{
            return (0);
        }
            
    }catch(e){
        return(e);
    }
}

async function saveList(newList){
    let lista =List(newList)
    let doc = await lista.save()
    console.log(doc);
    let resp = await List.find();
    return (resp)
}

async function saveUser(newUser){
    let usuario =User(newUser)
    let doc = await usuario.save()
    console.log(doc);
    let resp = await User.find();
    return (resp)
}

    


app.route('/api/editL/:id')
    .put( async (req,res)=>{    
            try{
             let doc = await searchList(req.params.id);
             if(doc){
                let x = await List.actualizarLista(req.body, req.params.id);
                if(x==true){
                    res.status(200).send("Se actualizo con exito")
                }else{
                    console.log(x)
                    res.status(400).send("No se modifico la lista")
                }
                console.log(x);
                
             }
            }catch(err){
                console.log(err);
                res.status(404).send({error:"No se encontró la lista"})
            }
        
    })

const server = app.listen(port, () => {
    console.log(`ejecutando en http://localhost:${port}/`)
})

    // Socket.io
const io = socketIo(server, {
    cors: {
      origin: '*'
    }
  });
io.on('connection', socket => {
    console.log('A user connected');
    socket.on('login', data => {
        console.log('A user just logged in. - ID: ', data);
    })
})