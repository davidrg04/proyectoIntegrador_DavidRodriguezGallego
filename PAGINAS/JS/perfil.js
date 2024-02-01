

function generarHtml() {
    document.getElementById("username").innerHTML = `${localStorage.username.toUpperCase()}`;
    if (localStorage.getItem('rol') == 'organizer') {
        document.getElementById("textoBienvenida").innerHTML = "¡Bienvenido a su centro personal! Aquí puede editar su perfil, explorar las carreras que ha marcado como favoritas y donde podrá gestionar sus eventos. Descubra las posibilidades y personalice su experiencia con nosotros.";
        document.getElementById('racesEditor').style.display="block";
        let divPhone = document.createElement('div');
        divPhone.innerHTML = `<p>Teléfono</p>
                              <span id="phone"></span>
                              <i class="bi bi-caret-right-fill abrirModal" data-parametro="telefono"></i>`;
        let divNombreOrg = document.createElement('div');
        divNombreOrg.innerHTML = `<p>Nombre Organización</p>
                                    <span id="nombreOrg"></span>
                                    <i class="bi bi-caret-right-fill abrirModal" data-parametro="nombreOrg"></i>`;
        document.getElementById('datosUsuario').append(divPhone);
        document.getElementById('datosUsuario').append(divNombreOrg);
    }

     document.querySelectorAll(".abrirModal").forEach(btn =>{
        btn.addEventListener('click', abrirModal);
     });

    
}


generarHtml();
let modal = document.getElementById('miModal');
function abrirModal(e){
    document.getElementById('miModal').style.display='block';

    if (e.target.dataset.parametro == 'username') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE USERNAME";
        document.querySelector('#miModal label').innerHTML = "Escriba su nuevo nombre de usuario. Deberá volver a iniciar sesión";
        document.getElementById("guardar").dataset.parametro = "username";
    }else if (e.target.dataset.parametro == 'password') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE CONTRASEÑA";
        document.querySelector('#miModal label').innerHTML = "Escriba su nueva contraseña. Deberá volver a iniciar sesión";
        document.getElementById("guardar").dataset.parametro = "password";
    }else if (e.target.dataset.parametro == 'poblacion') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE LOCALIDAD";
        document.querySelector('#miModal label').innerHTML = "Escriba su nueva localidad. Deberá volver a iniciar sesión";
        document.getElementById("guardar").dataset.parametro = "poblacion";
    }else if (e.target.dataset.parametro == 'telefono') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE TELÉFONO";
        document.querySelector('#miModal label').innerHTML = "Escriba su nuevo número de teléfono. Deberá volver a iniciar sesión";
        document.getElementById("guardar").dataset.parametro = "telefono";
    }else if (e.target.dataset.parametro == 'nombreOrg'){
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE ORGANIZACIÓN";
        document.querySelector('#miModal label').innerHTML = "Escriba su nueva organización. Deberá volver a iniciar sesión";
        document.getElementById("guardar").dataset.parametro = "nombreOrg";
    }else{
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE FOTO DE PERFIL";
    }

}

document.querySelector(".sidebar").addEventListener('mouseover',mousenter);
document.querySelector(".sidebar").addEventListener('mouseout',mouseleave);


let modalCuenta = document.getElementById('miModalBorrarCuenta');
document.getElementById('borrarCuenta').addEventListener('click', abrirModalCuenta);

function abrirModalCuenta(e) {
    console.log('hola');
    modalCuenta.style.display = 'block';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
window.onclick = function(event) {
    if (event.target == modalCuenta) {
        modalCuenta.style.display = "none";
    }
}
document.getElementById("cancelar").addEventListener('click', cerrarModal)
document.querySelector("span.cerrar").addEventListener('click', cerrarModal);
document.getElementById("cancelarCuenta").addEventListener('click', cerrarModalCuenta)
document.querySelector("#cerrarCuentaX").addEventListener('click', cerrarModalCuenta);
function cerrarModal() {
    modal.style.display = "none";
    document.getElementById('inputModal').value = "";
    document.getElementById('inputModal').classList.remove("incorrecto");
    document.getElementById('inputModal').classList.remove("correcto");
    document.getElementById('alertMessage').style.display = "none";
    document.getElementById('alertMessage').innerHTML = "";
    document.getElementById('guardar').setAttribute('disabled','');

}
function cerrarModalCuenta() {
    modalCuenta.style.display = "none";
    
}
// document.getElementById('borrarCuenta').addEventListener('click',abrirModalBorrarCuenta)
// function abrirModalBorrarCuenta() {
    
// }
function mousenter(e) {
    document.getElementById('saves').innerHTML="GUARDADOS";
    document.getElementById('settings').innerHTML="PERFIL";
    document.getElementById('saves').textContent="GUARDADOS";
    document.getElementById('deleteMyAccount').textContent="BORRAR CUENTA";
    document.getElementById('home').textContent="INICIO";
    document.getElementById('logout').textContent="CERRAR SESION";
}

function mouseleave(e) {
    document.getElementById('saves').innerHTML="";
    document.getElementById('settings').innerHTML="";
    document.getElementById('saves').textContent="";
    document.getElementById('deleteMyAccount').textContent="";
    document.getElementById('home').textContent="";
    document.getElementById('logout').textContent="";
}

//VERIFICAR CAMPOS DE EDITAR PERFIL
let spanAlerta = document.getElementById("alertMessage");

document.getElementById('inputModal').addEventListener('blur',comprobarDatos);
function comprobarDatos(e) {
    let boton = document.getElementById('guardar');

    if (boton.dataset.parametro == "username") {
        if (/^[a-zA-Z0-9]{4,16}$/.test(e.target.value)) {
            e.target.classList.remove("incorrecto");
            e.target.classList.add("correcto");
            spanAlerta.style.display='none';
            spanAlerta.textContent ="";
            boton.removeAttribute("disabled");
        } else {
            e.target.classList.remove("correcto");
            e.target.classList.add("incorrecto");
            spanAlerta.innerHTML="Por favor, escriba un nombre de usuario que contenga entre 4 y 16 caracteres. Solo permitimos números y letras."
            spanAlerta.style.display='block';
            boton.setAttribute('disabled','');
        }
    }else if (boton.dataset.parametro == "password"){
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(e.target.value)) {
            e.target.classList.remove("incorrecto");
            e.target.classList.add("correcto");
            spanAlerta.style.display = 'none';
            spanAlerta.textContent = "";
            boton.removeAttribute("disabled");
        } else {
            e.target.classList.remove("correcto");
            e.target.classList.add("incorrecto");
            spanAlerta.innerHTML = "Por favor, la contraseña debe contener, al menos una letra minúscula, una letra mayúscula, un número y ser superior a ocho caracteres.";
            spanAlerta.style.display = 'block';  
            boton.setAttribute('disabled','');
        }
    }else if(boton.dataset.parametro == "poblacion"){
        if (e.target.value != "") {
            boton.removeAttribute('disabled');
        }else{
            boton.setAttribute('disabled','');
        }
    }else if(boton.dataset.parametro == "telefono"){
        if (/^[1-9][0-9]{8}$/.test(e.target.value)) {
            e.target.classList.remove("incorrecto");
            e.target.classList.add("correcto");
            spanAlerta.style.display = 'none';
            spanAlerta.textContent = "";
            boton.removeAttribute("disabled");
           
        } else {
            e.target.classList.remove("correcto");
            e.target.classList.add("incorrecto");
            spanAlerta.innerHTML="Por favor, escriba un teléfono válido."
            spanAlerta.style.display = 'block';  
            boton.setAttribute('disabled','');
        }
    }else if (boton.dataset.parametro == "nombreOrg") {
        if (e.target.value != "") {
            boton.removeAttribute('disabled');
        }else{
            boton.setAttribute('disabled','');
        }
    }else{
        console.log("CONFIGURAR FOTO DE PERFIL");
    }
}


//LLAMADA API OBTENER LOS DATOS DEL PERIFL

function obtenerDatosPerfil() {
    let jwt = localStorage.getItem('jwt')
    fetch("http://localhost/proyectoIntegrador_DavidRodriguezGallego/API/getDatosPerfil.php", {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Authorization': `Bearer ${jwt}`    
        },
    }).then( response => {
        if (response.status === 200) return response.json()
            else if (response.status === 404) console.log(response.text); 
            else console.log("Todo mal");
    }).then( data => {
        if (localStorage.getItem('rol') == "organizer") {
            document.getElementById("nombreUsuario").innerHTML = `${data.username}`;
            document.getElementById("localidad").innerHTML = `${data.poblacion}`;
            document.getElementById("phone").innerHTML = `${data.telefono}`;
            document.getElementById("nombreOrg").innerHTML = `${data.nombreOrg}`;
        } else {
            document.getElementById("nombreUsuario").innerHTML = `${data.username}`;
            document.getElementById("localidad").innerHTML = `${data.poblacion}`;
        }
    }).catch ( error => {
        console.log(error);
    })
}

obtenerDatosPerfil();




// LLAMADA API BORRAR CUENTA 
document.getElementById('borrarCuentaModal').addEventListener('click', eliminarCuenta);
function eliminarCuenta(e) {
    let jwt = localStorage.getItem('jwt');
    fetch("http://localhost/proyectoIntegrador_DavidRodriguezGallego/API/borrarCuenta.php", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Authorization': `Bearer ${jwt}` 
        },
    }).then(response => {
        if (response.status === 200) {
            location.href = "../../landingPage.html";
        } else if (response.status === 404) {
            console.log("No encontrado");
        } else {
            console.log("Error en la solicitud");
        }
    }).catch(error => {
        console.log(error);
    });
}

//LLAMADA API CAMBIAR DATOS USUARIO
document.getElementById('guardar').addEventListener('click', cambiarDatos);
function cambiarDatos(e) {
    let spanAlert = document.getElementById("alertMessage");
    let datos = {
        "tipo" : e.target.dataset.parametro,
        "parametro" : document.getElementById('inputModal').value,
    };

    let jwt = localStorage.getItem('jwt');
    fetch("http://localhost/proyectoIntegrador_DavidRodriguezGallego/API/cambiarDatosPerfil.php", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Authorization': `Bearer ${jwt}` 
        },
        body: JSON.stringify(datos)
    }).then(response => {
        if (response.status === 204) {
            location.href = "../../landingPage.html";
        } else if (response.status === 409) {
            return response.json();
        } else {
            console.log("Error en la solicitud");
        }
    }).then( data => {
        if (data.error == "username") {
            spanAlert.innerHTML = "El username introducido ya existe.";
            spanAlert.style.display = "block";
        }else{
            spanAlert.innerHTML = "El teléfono introducido ya existe.";
            spanAlert.style.display = "block";
        }
    }).catch ( error => {
        console.log(error);
    })
}

//LLAMADA API NUEVA CARRERA
document.getElementById('nuevaCarrera').addEventListener('click', modalNuevaCarrera);

function modalNuevaCarrera(e) {
    document.getElementById('miModalNuevaCarrera').style.display = 'block';
    document.querySelector('#cerrarCarreraX i').addEventListener('click', cerrarModalCarrera);
    function cerrarModalCarrera(e) {
        document.getElementById('miModalNuevaCarrera').style.display = 'none';
        document.querySelectorAll('#miModalNuevaCarrera input').forEach( input => {
            input.value = "";
        });
        document.querySelectorAll('#miModalNuevaCarreraModalidades input').forEach( input => {
            input.value = "";
            input.checked = false;

        });
        document.getElementById('premios').innerHTML = "";  
        document.getElementById('modalidadesSeleccionadas').style.display = "none";
        document.getElementById('selectModalidadCategoria').style.display = "block";
    }

    document.getElementById('modalidades').addEventListener('click', mostrarModalidades);
    function mostrarModalidades(e) {
        document.getElementById('miModalNuevaCarreraModalidades').style.display = 'block';
        document.getElementById('guardarModalidad').addEventListener('click', esconderModalidad);
        function esconderModalidad(e) {
            document.getElementById('selectModalidadCategoria').classList.remove('desdeArriba');
            document.getElementById('selectModalidadCategoria').style.display = 'none';

            document.getElementById('añadirModalidad').addEventListener('click', abrirModalidad);
            function abrirModalidad(e) {
                document.getElementById('selectModalidadCategoria').style.display = 'block';
                document.getElementById('selectModalidadCategoria').classList.add('desdeArriba');
            }
        }
        document.querySelector('#cerrarModalidadX i').addEventListener('click', cerrarModalidad);
        function cerrarModalidad(e) {
            document.getElementById('miModalNuevaCarreraModalidades').style.display = 'none';
        }
    }
}

                                            //GENERACION DE MODALIDADES
        let modalidadElegida = "";
        document.querySelectorAll('input[name="tipoModalidad"]').forEach( modalidad => {
            modalidad.addEventListener('click', seleccionarModalidad);
        });
        
         
        function seleccionarModalidad(e) {
            modalidadElegida = e.target.value;
        }
        
        document.getElementById('guardarModalidad').addEventListener('click', generacionModalidad);
        function generacionModalidad(e){
            document.getElementById("modalidadesSeleccionadas").style.display = "block";
            document.getElementById("modalidadEscogida").textContent = modalidadElegida.toUpperCase();
            document.getElementById('premios').innerHTML ="";
            document.querySelectorAll('input[name="tipoCategoria[]"]:checked').forEach( categoria => {
                console.log("hola");
                document.getElementById('premios').innerHTML +=
                `<div class="premioCategoria" data-categoria="${categoria.value}">
                    <p class="premiosNombreCategoria">${categoria.value.toUpperCase()} ${document.getElementById('sexo').value}</p>
                    <div><label for="posicion1">1.</label><input type="text" class="posicion1" name="posicion1" title="Premio primera posicion" placeholder="Pj. 300€"></div>
                    <div><label for="posicion2">2.</label><input type="text" class="posicion2" name="posicion2" title="Premio segunda posicion" placeholder="Pj. 200€"></div>
                    <div><label for="posicion3">3.</label><input type="text" class="posicion3" name="posicion3" title="Premio tercera posicion" placeholder="Pj. 100€"></div>
                </div>`;
            });
        }


                                        //MANDAR DATOS A LA API

        document.querySelector('#miModalNuevaCarrera .crearCarreraBoton').addEventListener('click', enviarCarrera);
        function enviarCarrera(e){
            let modalidades = [
                {
                    'modalidad' : modalidadElegida,
                    'sexo' : document.getElementById('sexo').value,
                    'categorias' : []
                }
            ];

            document.querySelectorAll('.premioCategoria').forEach( categoria => {
                let categorias = {};
                categorias.nombre = categoria.dataset.categoria;
                categorias.premios = [];
                categoria.querySelectorAll('input[type="text"]').forEach( premio => {
                    categorias.premios.push(premio.value);
                });
                modalidades[0].categorias.push(categorias);
        });
        console.log(modalidades);

       

       

            let coorReducidas = [];
            let desnivelPositivo = 0;
            let desnivelNegativo = 0;
            let desnivel =0;
            const file = document.getElementById('track').files[0];
            if (file) {
                const fileReader = new FileReader();
                const r = fileReader.readAsText(file);
                fileReader.onload = event => {
                    const textContent = event.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(textContent, "application/xml");
                    const json = toGeoJSON.gpx(xmlDoc);
                    const coor = json.features[0].geometry.coordinates;
                    let numeroPorCarrera = 100;
                    let intervalo = Math.ceil(coor.length/numeroPorCarrera);
                    
                    coorReducidas = coor.reduce((coordenadas, coordenada, index) => {
                        if (index % intervalo === 0 || index === coor.length - 1) {
                            coordenadas.push(coordenada);
                        }
                        return coordenadas;
                    }, []);

                    console.log(coorReducidas);

                    coor.forEach( (coordenada, index) => {
                        if (index > 0) {
                            let diferencia = coordenada[2] - coor[index-1][2];
                            (diferencia>0) ? desnivelPositivo +=diferencia : desnivelNegativo += diferencia;
                        }
            
                    });
                    desnivel = desnivelPositivo+desnivelNegativo;

                    let carrera = new FormData();
                    carrera.append('nombre', document.getElementById('nombreCarrera').value);
                    carrera.append('fecha', document.getElementById('fecha').value);
                    carrera.append('localizacion', document.getElementById('localizacion').value);
                    carrera.append('web', document.getElementById('webOrganizacion').value);
                    carrera.append('distancia', document.getElementById('distancia').value);
                    carrera.append('desnivel',desnivel);
                    carrera.append('coordenadas',JSON.stringify(coorReducidas));

                    let portada = document.getElementById('portada').files[0];
                    
                    if (portada) {
                        carrera.append('fotoPortada', portada);
                    }
                    let reglamento = document.getElementById('reglamento').files[0];
                    
                    if (reglamento) {
                        carrera.append('reglamento', reglamento);
                    }

                    let imagenesCarrera = document.getElementById('imagenesCarrera').files;

                    if(imagenesCarrera){
                        Array.from(imagenesCarrera).forEach((foto)=>{
                            carrera.append('fotos[]',foto);
                        });
                    }
                    modalidades.forEach((modalidad, index) => {
                        carrera.append(`modalidades[${index}]`, JSON.stringify(modalidad));
                    });
                    
                    for (let [clave, valor] of carrera.entries()) {
                        console.log(clave, valor);
                    }
                }
                

            }

            
        }



