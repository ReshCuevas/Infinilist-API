function DoctorDeleto(){
    let xhr = new XMLHttpRequest;
    xhr.open('DELETE','/api/borrarL/'+ localStorage.currentlist);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = function(){
        if(xhr.status == 200){
            console.log("Borrado exitoso");
        }
    }
}

function DeletosRevenge(){
    let xhr = new XMLHttpRequest;
    xhr.open('DELETE','/api/borrarU/'+ localStorage.currentUser);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = function(){
        if(xhr.status == 200){
            console.log("Borrado exitoso");
        }
    }
}

function getS(id){
    let xhr = new XMLHttpRequest;
    xhr.open('GET','/api/getSingle/'+ id);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send();
    xhr.onload = function(){
        let databoy = JSON.parse(xhr.response);
        console.log(databoy);
        document.getElementById("ct").innerHTML += `<img src="${databoy.imagen}" alt="">
        <h3>${databoy.nombre}</h3>
        <div id="deL">${databoy.descripcion}</div>`;
        for(let i = 0; i < databoy.elementos.length; i++){
            document.getElementById("elem").innerHTML += `<li>${databoy.elementos[i]}</li> <br>`
        }
    }
}

//getS(localStorage.currentlist);		

function login(){
    //event.preventDefault();
    let datosLogin = {correo:`${document.getElementById("userCR").value}`,password:`${document.getElementById("userPASS").value}`}
    let xhr = new XMLHttpRequest;
    xhr.open('POST','/api/login');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(datosLogin));
    xhr.onload = function(){
        if(xhr.status == 200 ){
            console.log(`Welcome ${document.getElementById("userCR").value}!`);
            localStorage.setItem("currentUser",xhr.response)
            document.getElementById("bod").innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                          <strong>Holy guacamole!</strong> login succesful.
                                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                          </button>
                                                        </div>`;
            location.reload();
        }else{
            console.log("Error de autenticación");
            document.getElementById("bod").innerHTML += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                          <strong>Whoa there!</strong> something is wrong here.
                                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                          </button>
                                                        </div>`
        }
    }
}

function register(){
    var sx;
    event.preventDefault();
    if(document.getElementById("box1").checked == true){
        sx = "M";
    }else{
        sx = "H";
    }
    let newSer = {nombre: `${document.getElementById("nombreUser").value}`, apellido: `${document.getElementById("apeUser").value}` ,correo: `${document.getElementById("correoUser").value}`, password: `${document.getElementById("passUser").value}`, url: `${document.getElementById("imgUser").value}`, sexo: sx};
    let xhr = new XMLHttpRequest;
    xhr.open('POST','/api/registro');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(newSer));
    xhr.onload = function(){
        console.log(xhr.status);
        if(xhr.status == 201){
            console.log("Nuevo usuario creado con exito");
        }else{
            console.log("No se pudo crear el usuario");
        }
    }
    
}

function elementorMaxSteele(id){
    let xhr = new XMLHttpRequest;
    let newEle = {elementos: `${document.getElementById("newUrl").value}`};
    xhr.open('PUT','/api/elementos/' + id);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(newEle));
    document.getElementById("elem").innerHTML += `<li>${document.getElementById("newUrl").value}</li> <br>`

}

function loadUser(id){
    //event.preventDefault();
    let xhr = new XMLHttpRequest;
    xhr.open('GET','/api/perfil/'+ id);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send()
    xhr.onload = function(){
        
        let databoy = JSON.parse(xhr.response)
        let usrN = databoy.nombre + ' ' + databoy.apellido;
        let usrC = databoy.correo;
        var sx;
        if(databoy.sexo == 'H'){
            sx = "Hombre";
        }else{
            sx = "Mujer";
        }
        let usrI = databoy.url;
        document.getElementById("userData").innerHTML = `<h3>${usrN}</h3>
    <br>
    Correo: ${usrC}
    <br>
    Sexo: ${sx}
    <br>`
        document.getElementById("userImg").innerHTML = `<img src="${usrI}"   class="fa fa-align-center " >`;
    
    }
    

}

//loadUser(localStorage.currentUser);


function logOut(){
     localStorage.removeItem('currentUser');
    location.reload();
}

function editUser(id){

    let updator = {nombre: `${document.getElementById("chN").value}`, apellido: `${document.getElementById("chA").value}` ,correo: `${document.getElementById("chC").value}`, url: `${document.getElementById("pfp").value}`};

    let xhr = new XMLHttpRequest;
    xhr.open('PUT','/api/editar/'+ id);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(updator));
    location.reload();
}


