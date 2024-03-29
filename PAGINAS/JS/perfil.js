localStorage.removeItem('nombreCarrera');

let fetchDireccion = "localhost";
if (localStorage.getItem('rol') === 'invitado' || !localStorage.getItem('rol')) {
    location.href = "../landingPage.html";
}

function verificarYRenovarToken() {
    let token = localStorage.getItem('jwt');
    if (token) {
        let payload = JSON.parse(atob(token.split('.')[1]));
        let tiempoRestante = payload.exp - Math.floor(Date.now() / 1000);
        let expirado = payload.exp < Math.floor(Date.now() / 1000);
        if (expirado) {
            alert("Tu sesión ha caducado. Por favor, inicia sesión de nuevo.");
            location.href = "../landingPage.html";
        }

        if (tiempoRestante < 300) {
            fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/renovarToken.php`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => {
                return response.json()
            }).then(data => {
                if (data && data.token) {
                    localStorage.setItem('jwt', data.token);
                }
            }).catch(error => console.error("Error al renovar el token", error));
        }
    }
}

setInterval(verificarYRenovarToken, 300000);

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
        document.getElementById('enlaceEditarCarreras').style.display = "block";
    }

     document.querySelectorAll(".abrirModal").forEach(btn =>{
        btn.addEventListener('click', abrirModal);
     });

     mostrarFavoritos();
     let jwt = localStorage.getItem('jwt');
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerFotoPerfil.php`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
        }).then( response => {
            if (response.status === 200){
                return response.json();
            }else{
                alert("NO SE PUEDE MOSTRAR LA FOTO DE PERFIL");
            }
        }).then( data => {
            document.getElementById("cabeceraFotoPerfil").src = `../API/users/user${data.id}/fotos/${data.fotoPerfil}`;
            
        }).catch ( error => {
            console.log(error);
        })
    
}


generarHtml();

function mostrarFavoritos() {
    let favoritos = document.getElementById('rejillaCarreras')
    favoritos.innerHTML = "";
    
    let carreras = [];
    let jwt = localStorage.getItem('jwt');
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerFavoritos.php`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${jwt}`
        }
    }).then( response => {
        if (response.status === 200) return response.json() 
            else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
    }).then( data => {
        carreras = data;
        renderCarreras();
    }).catch ( error => {
        console.log(error);
    })

    let currentPage = 0;
    let elementsPerPage = 3;
    let paginasTotales = Math.ceil((carreras.length / elementsPerPage));
    function renderCarreras() {
        if (carreras.length > 0) {
            favoritos.innerHTML = "";
            carreras
                    .filter((item,index) =>{
                        return Math.trunc(index/elementsPerPage) == currentPage;
                    })
                    .forEach( ({nombre, id_usuario,portada, fecha, localizacion, distancia}) => {
                        favoritos.innerHTML += `
                        <div class="tarjetaCarrera">
                                <div class="fotoPortada">
                                    <p>${nombre}</p>
                                    <img src="../../API/users/user${id_usuario}/carreras/imagenes/${portada}" alt="Foto de la carrera">
                                </div>
                                <div class="datosCarrera">
                                    <span class="fecha"><i class="bi bi-calendar-fill"></i>${fecha}</span>
                                    <span class="localidad"><i class="bi bi-geo-alt-fill"></i>${localizacion}</span>
                                    <span class="distancia"><i class="bi bi-info-circle-fill"></i></i>${distancia}KM</span>
                                    <a href="./masInformacion.html" class="enlaceCarrera"><div class="detallesCarrera" data-nombrecarrera="${nombre}">MAS INFORMACIÓN</div></a>
                                </div>
                            </div>
                        `;
            });
            paginasTotales = Math.ceil((carreras.length / elementsPerPage));
            document.getElementById("paginaActual").textContent = `${currentPage + 1} / ${paginasTotales}`;
            Array.from(document.getElementsByClassName("detallesCarrera")).forEach( (element) => {
                element.addEventListener('click', guardarNombreCarrera);
            });
        
            
        }else{
            favoritos.innerHTML = "<h2>No tienes carreras favoritas</h2>";
            document.getElementById('divPaginacion').style.display = "none";
            favoritos.style.display = "flex";
            favoritos.style.justifyContent = "center";
            favoritos.style.alignItems = "center";
            document.querySelector('#rejillaCarreras h2').style.fontSize = "2rem";
        }
        
        
    }
    document.querySelector("#divPaginacion .next").addEventListener('click', ()=>{
        currentPage = (currentPage < paginasTotales - 1) ? currentPage+1 : currentPage;
        renderCarreras();
    });
    document.querySelector("#divPaginacion .prev").addEventListener('click', ()=>{
        currentPage = (currentPage > 0) ? currentPage-1 : currentPage;
        renderCarreras();
    })
  
   
  


    function guardarNombreCarrera(e) {
        localStorage.setItem('nombreCarrera', e.target.dataset.nombrecarrera);
        
    }
}

let modal = document.getElementById('miModal');
function abrirModal(e){
    document.getElementById('miModal').style.display='block';

    if (e.target.dataset.parametro == 'username') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE USERNAME";
        if (document.getElementById("foto")) {
            document.getElementById("foto").setAttribute('id','inputModalPerfil');
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }else{
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }
        

        document.querySelector('#miModal label').innerHTML = "Escriba su nuevo nombre de usuario. Deberá volver a iniciar sesión";
        document.getElementById("guardarPerfil").dataset.parametro = "username";
    }else if (e.target.dataset.parametro == 'password') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE CONTRASEÑA";
        if (document.getElementById("foto")) {
            document.getElementById("foto").setAttribute('id','inputModalPerfil');
            document.getElementById("inputModalPerfil").setAttribute('type','password');
        }else{
            document.getElementById("inputModalPerfil").setAttribute('type','password');
        }

        document.querySelector('#miModal label').innerHTML = "Escriba su nueva contraseña. Deberá volver a iniciar sesión";
        document.getElementById("guardarPerfil").dataset.parametro = "password";
    }else if (e.target.dataset.parametro == 'poblacion') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE LOCALIDAD";
        if (document.getElementById("foto")) {
            document.getElementById("foto").setAttribute('id','inputModalPerfil');
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }else{
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }

        document.querySelector('#miModal label').innerHTML = "Escriba su nueva localidad. Deberá volver a iniciar sesión";
        document.getElementById("guardarPerfil").dataset.parametro = "poblacion";
    }else if (e.target.dataset.parametro == 'telefono') {
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE TELÉFONO";
        if (document.getElementById("foto")) {
            document.getElementById("foto").setAttribute('id','inputModalPerfil');
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }else{
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }

        document.querySelector('#miModal label').innerHTML = "Escriba su nuevo número de teléfono. Deberá volver a iniciar sesión";
        document.getElementById("guardarPerfil").dataset.parametro = "telefono";
    }else if (e.target.dataset.parametro == 'nombreOrg'){
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE ORGANIZACIÓN";
        if (document.getElementById("foto")) {
            document.getElementById("foto").setAttribute('id','inputModalPerfil');
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }else{
            document.getElementById("inputModalPerfil").setAttribute('type','text');
        }

        document.querySelector('#miModal label').innerHTML = "Escriba su nueva organización. Deberá volver a iniciar sesión";
        document.getElementById("guardarPerfil").dataset.parametro = "nombreOrg";
    }else{
        document.querySelector('#miModal h2').innerHTML = "CAMBIO DE FOTO DE PERFIL";
        document.querySelector('#miModal label').innerHTML = "Seleccione una foto de perfil nueva";
        if (document.getElementById("inputModalPerfil")) {
            document.getElementById("inputModalPerfil").setAttribute('type','file');
            document.getElementById("inputModalPerfil").setAttribute('accept','.png, .jpg');
            document.getElementById("inputModalPerfil").setAttribute('id','foto');
            document.getElementById('foto').addEventListener('change',comprobarDatos);
        }
        
        document.getElementById("guardarPerfil").dataset.parametro = "fotoPerfil";
    }

}

document.querySelector(".sidebar").addEventListener('mouseover',mousenter);
document.querySelector(".sidebar").addEventListener('mouseout',mouseleave);


let modalCuenta = document.getElementById('miModalBorrarCuenta');
document.getElementById('borrarCuenta').addEventListener('click', abrirModalCuenta);

function abrirModalCuenta(e) {
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
    if (document.getElementById('inputModalPerfil')) {
        document.getElementById('inputModalPerfil').value = "";
        document.getElementById('inputModalPerfil').classList.remove("incorrecto");
        document.getElementById('inputModalPerfil').classList.remove("correcto");
    }else{
        document.getElementById('foto').value = "";
    }
    
    
    document.getElementById('alertMessage').style.display = "none";
    document.getElementById('alertMessage').innerHTML = "";
    document.getElementById('guardarPerfil').setAttribute('disabled','');

}
function cerrarModalCuenta() {
    modalCuenta.style.display = "none";
    
}

function mousenter(e) {
    document.getElementById('saves').innerHTML="GUARDADOS";
    if (localStorage.getItem('rol')== 'organizer') {
        document.getElementById('textoEditarCarreras').textContent="EDITAR CARRERAS";
    }
    document.getElementById('settings').innerHTML="PERFIL";
    
    document.getElementById('saves').textContent="GUARDADOS";
    document.getElementById('deleteMyAccount').textContent="BORRAR CUENTA";
    document.getElementById('home').textContent="INICIO";
    document.getElementById('logout').textContent="CERRAR SESION";
}

function mouseleave(e) {
    document.getElementById('saves').innerHTML="";
    document.getElementById('settings').innerHTML="";
    if (localStorage.getItem('rol')== 'organizer') {
        document.getElementById('textoEditarCarreras').textContent="";
        
    }
    document.getElementById('saves').textContent="";
    document.getElementById('deleteMyAccount').textContent="";
    document.getElementById('home').textContent="";
    document.getElementById('logout').textContent="";
}

//VERIFICAR CAMPOS DE EDITAR PERFIL
let spanAlerta = document.getElementById("alertMessage");

document.getElementById('inputModalPerfil').addEventListener('blur',comprobarDatos);

function comprobarDatos(e) {
    
    let boton = document.getElementById('guardarPerfil');

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
        const file = document.getElementById('foto').files[0];
        if (file) {
            boton.removeAttribute('disabled');
        }else{
            boton.setAttribute('disabled','');
        }
    }
}


//LLAMADA API OBTENER LOS DATOS DEL PERIFL

function obtenerDatosPerfil() {
    let jwt = localStorage.getItem('jwt')
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/getDatosPerfil.php`, {
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
            document.getElementById("fotoPerfil").innerHTML = `<img src="../../API/users/user${data.id}/fotos/${data.fotoPerfil}" alt="Foto de perfil">`;
            document.getElementById("nombreUsuario").innerHTML = `${data.username}`;
            document.getElementById("localidad").innerHTML = `${data.poblacion}`;
            document.getElementById("phone").innerHTML = `${data.telefono}`;
            document.getElementById("nombreOrg").innerHTML = `${data.nombreOrg}`;
        } else {
            document.getElementById("fotoPerfil").innerHTML = `<img src="../../API/users/user${data.id}/fotos/${data.fotoPerfil}" alt="Foto de perfil">`;
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
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/borrarCuenta.php`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Authorization': `Bearer ${jwt}` 
        },
    }).then(response => {
        if (response.status === 200) {
            location.href = "../../landingPage.html";
        } else if (response.status === 500) {
            console.log("Error al borrar directorios");
        } else {
            console.log("Error en la solicitud");
        }
    }).catch(error => {
        console.log(error);
    });
}

//LLAMADA API CAMBIAR DATOS USUARIO
document.getElementById('guardarPerfil').addEventListener('click', cambiarDatos);
function cambiarDatos(e) {
    if (e.target.dataset.parametro == "fotoPerfil") {
        let fotoPerfil = document.getElementById('foto').files[0];
        let foto = new FormData();
        foto.append('fotoPerfil', fotoPerfil);
        let jwt = localStorage.getItem('jwt');
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/cambiarFotoPerfil.php`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwt}` 
            },
            body: foto
        }).then(response => {
            if (response.status === 204) {
                window.location.reload();
            } else if (response.status === 404) {
                alert("Error en la solicitud");
            } else {
                console.log("Error en la solicitud");
            }
        })
    }else{
        let spanAlert = document.getElementById("alertMessage");
        let datos = {
            "tipo" : e.target.dataset.parametro,
            "parametro" : document.getElementById('inputModalPerfil').value,
        };
        let jwt = localStorage.getItem('jwt');
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/cambiarDatosPerfil.php`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                'Authorization': `Bearer ${jwt}` 
            },
            body: JSON.stringify(datos)
        }).then(response => {
            if (response.status === 204) {
                spanAlert.style.display = "none";
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
                document.getElementById('inputModalPerfil').classList.add("incorrecto");
            }else{
                spanAlert.innerHTML = "El teléfono introducido ya existe.";
                spanAlert.style.display = "block";
                document.getElementById('inputModalPerfil').classList.add("incorrecto");
            }
        }).catch ( error => {
            console.log(error);
        })
    }
    
}

//LLAMADA API NUEVA CARRERA
document.getElementById('nuevaCarrera').addEventListener('click', modalNuevaCarrera);

function modalNuevaCarrera(e) {
    document.getElementById('miModalNuevaCarrera').style.display = 'block';
    provincias.sort((a, b) => {
        return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
      });
    
    let selectProvincias=document.getElementById('localizacion');
    
    selectProvincias.options[selectProvincias.options.length] = new Option('PROVINCIA', '');
    for (let provincia of provincias) {
        selectProvincias.options[selectProvincias.options.length] = new Option(provincia.label, provincia.label);
    }
    document.querySelector('#cerrarCarreraX i').addEventListener('click', cerrarModalCarrera);
    function cerrarModalCarrera(e) {
        document.getElementById('miModalNuevaCarrera').style.display = 'none';
        document.querySelectorAll('#miModalNuevaCarrera input').forEach( input => {
            input.value = "";
        });
        document.getElementById('localizacion').options[0].selected = true;
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
        document.getElementById('crearModalidades').addEventListener('click', cerrarModalidad);
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

        document.querySelector('#miModalNuevaCarrera .crearCarreraBoton').addEventListener('click', comprobarDatosCarrera);
        
        function comprobarDatosCarrera(e) {
            
            let campos = ['portada', 'nombreCarrera', 'fecha', 'localizacion', 'track', 'webOrganizacion', 'distancia', 'reglamento', 'imagenesCarrera'];

            let todosCompletos = true; 

            campos.forEach( campo => {
                var campoInput = document.getElementById(campo);
                if (campoInput.type === 'file') {
                    if (campoInput.files.length === 0) {
                        todosCompletos = false;
                    }
                    
                } else {
                    if (campoInput.value.trim() === '') {
                        todosCompletos = false;
                    }
                }
            });

            if (!document.querySelector('input[name="tipoModalidad"]:checked')) {
                todosCompletos = false;
            }
        
            if (!document.querySelector('input.categoria:checked')) {
                todosCompletos = false;
            }
        
            (todosCompletos) ? enviarCarrera(e) : alert('Debe completar todos los campos.');
        }
        
        
        
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
        

       

       

            let coorReducidas = [];
            let desnivelPositivo = 0;
            let desnivelNegativo = 0;
            let desnivel =0;
            const file = document.getElementById('track').files[0];
            if (file) {
                let carrera = new FormData();
                const fileReader = new FileReader();
                const r = fileReader.readAsText(file);
                fileReader.onload = event => {
                    const textContent = event.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(textContent, "application/xml");
                    const json = toGeoJSON.gpx(xmlDoc);
                    const coor = json.features[0].geometry.coordinates;
                    let numeroPorCarrera = 200;
                    let intervalo = Math.ceil(coor.length/numeroPorCarrera);
                    
                    coorReducidas = coor.reduce((coordenadas, coordenada, index) => {
                        if (index % intervalo === 0 || index === coor.length - 1) {
                            coordenadas.push(coordenada);
                        }
                        return coordenadas;
                    }, []);

                    // console.log(coorReducidas);

                    coor.forEach( (coordenada, index) => {
                        if (index > 0) {
                            let diferencia = coordenada[2] - coor[index-1][2];
                            (diferencia>0) ? desnivelPositivo +=diferencia : desnivelNegativo += diferencia;
                        }
            
                    });
                    desnivel = desnivelPositivo+desnivelNegativo;

                    
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
                   
                        carrera.append(`modalidades`, JSON.stringify(modalidades));
                   
                    // for (let [key, value] of carrera.entries()) {
                    //     console.log(key, value);
                    // }
                    let jwt = localStorage.getItem('jwt');
                    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/registroCarrera.php`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    body: carrera,
                    }).then( response => {
                        if (response.status === 201) return response.json();
                            else if (response.status === 400) console.log("error"); 
                            else console.log("Todo mal");
                    })
                    .then( data => {
                        console.log("created");
                    })
                    .catch ( error => {
                        console.log(error);
                    })
                

                }
                    
                    
                }
                
        }

        //EDITAR CARRERAS
        document.getElementById('mostrarCarrerasPropias').addEventListener('click', mostrarCarrerasPropias);

        function mostrarCarrerasPropias(e) {
            document.getElementById('miModalMostrarCarreras').style.display = 'block';

            document.querySelector('#cerrarMostrarCarrerasX i').addEventListener('click', cerrarModalCarreras);
            document.getElementById('cancelarMostrarCarreras').addEventListener('click', cerrarModalCarreras);
            function cerrarModalCarreras(e) {
                document.getElementById('miModalMostrarCarreras').style.display = 'none';
            }

            document.querySelector('#miModalMostrarCarreras .modal-cuerpo').innerHTML = "";

            let jwt = localStorage.getItem('jwt');
            let carreras = [];
            fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerCarrerasOrganizador.php`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Authorization": `Bearer ${jwt}`
                }
            }).then( response => {
                if (response.status === 200) return response.json() 
                    else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
            }).then( data => {
                carreras = data;
                renderCarrerasOrganizador();
            }).catch ( error => {
                console.log(error);
            })

            let currentPage = 0;
            let elementsPerPage = 3;
            let paginasTotales = Math.ceil((carreras.length / elementsPerPage));
            function renderCarrerasOrganizador() {
                let divCarreras = document.querySelector('#miModalMostrarCarreras .modal-cuerpo');
                divCarreras.innerHTML = "";
                carreras
                        .filter((item,index) =>{
                            return Math.trunc(index/elementsPerPage) == currentPage;
                        })
                        .forEach( ({nombre, id_usuario,portada, fecha, localizacion, distancia}) => {
                            divCarreras.innerHTML += `
                            <div class="tarjetaCarrera">
                                    <div class="fotoPortada">
                                        <p>${nombre}</p>
                                        <img src="../../API/users/user${id_usuario}/carreras/imagenes/${portada}" alt="Foto de la carrera">
                                    </div>
                                    <div class="datosCarrera">
                                        <span class="fecha"><i class="bi bi-calendar-fill"></i>${fecha}</span>
                                        <span class="localidad"><i class="bi bi-geo-alt-fill"></i>${localizacion}</span>
                                        <span class="distancia"><i class="bi bi-info-circle-fill"></i></i>${distancia}KM</span>
                                        <div class="detallesCarrera editarCarrera" data-nombrecarrera="${nombre}">EDITAR</div>
                                        <div class="detallesCarrera borrarCarrera" data-nombrecarrera="${nombre}">BORRAR</div>
                                    </div>
                                </div>
                            `;
                });
                paginasTotales = Math.ceil((carreras.length / elementsPerPage));
                document.getElementById("paginaActualMostrarCarreras").textContent = `${currentPage + 1} / ${paginasTotales}`;
                Array.from(document.getElementsByClassName("editarCarrera")).forEach( (element) => {
                    element.addEventListener('click', modalEditarCarrera);
                });
                Array.from(document.getElementsByClassName("borrarCarrera")).forEach( (element) => {
                    element.addEventListener('click', modalBorrarCarrera);
                });

            }
            document.querySelector("#divPaginacionMostrarCarreras .next").addEventListener('click', ()=>{
                currentPage = (currentPage < paginasTotales - 1) ? currentPage+1 : currentPage;
                renderCarrerasOrganizador();
            });
            document.querySelector("#divPaginacionMostrarCarreras .prev").addEventListener('click', ()=>{
                currentPage = (currentPage > 0) ? currentPage-1 : currentPage;
                renderCarrerasOrganizador();
            })

        }
        function modalBorrarCarrera(e) {
            document.getElementById('miModalBorrarCarrera').style.display = 'block';
            document.getElementById('cancelarBorrarCarrera').addEventListener('click', cerrarModalBorrarCarrera);
            document.getElementById('cerrarBorrarCarreraX').addEventListener('click', cerrarModalBorrarCarrera);
            function cerrarModalBorrarCarrera(e) {
                document.getElementById('miModalBorrarCarrera').style.display = 'none';
            }
            document.getElementById('borrarCarreraModal').dataset.nombrecarrera = e.target.dataset.nombrecarrera;
            document.getElementById('borrarCarreraModal').addEventListener('click', borrarCarrera);
            
            
            
            function borrarCarrera(e) {
                
                fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/borrarCarrera.php`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify({'nombreCarrera': e.target.dataset.nombrecarrera}),
                }).then(response => {
                    if (response.status === 200) {
                        window.location.reload();
                    } 
                }).catch(error => {
                    console.log(error);
                });    
            }
        }
        let datosCarrera = [];
        function modalEditarCarrera(e) {
            provincias.sort((a, b) => {
                return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
              });
            
            let selectProvincias=document.getElementById('editarLocalizacion');
            
            selectProvincias.options[selectProvincias.options.length] = new Option('PROVINCIA', '');
            for (let provincia of provincias) {
                selectProvincias.options[selectProvincias.options.length] = new Option(provincia.label, provincia.label);
            }

            //RELLENAR DATOS DE LA CARRERA
            
            let nombreCarrera = e.target.dataset.nombrecarrera;
            fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerDatosCarreras.php`, {
            method: "POST",
            body: JSON.stringify({'nombre': nombreCarrera}),
            }).then( response => {
                if (response.status === 200) return response.json() 
                    else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
            }).then( data => {
                datosCarrera = data;
                rellenarDatos();
            }).catch ( error => {
                console.log(error);
            })

            function rellenarDatos() {
                document.getElementById('editarNombreCarrera').value = datosCarrera[0].nombre;
                document.getElementById('editarFecha').value = datosCarrera[0].fecha;
                document.getElementById('editarLocalizacion').value = datosCarrera[0].localizacion;
                document.getElementById('editarWebOrganizacion').value = datosCarrera[0].enlaceWeb;
                document.getElementById('editarDistancia').value = datosCarrera[0].distancia;

            }

            document.getElementById('miModalEditarCarrera').style.display = 'block';
            document.querySelector('#cerrarEditarCarreraX i').addEventListener('click', cerrarModalCarrera);
            function cerrarModalCarrera(e) {
                document.getElementById('miModalEditarCarrera').style.display = 'none';
                document.querySelectorAll('#miModalEditarCarrera input').forEach( input => {
                    input.value = "";
                });
                document.querySelectorAll('#miModalEditarCarreraModalidades input').forEach( input => {
    
                    (input.type === "text") ? input.value = "" : input.checked = false;

                });
                document.getElementById('editarPremios').innerHTML = "";  
                document.getElementById('editarModalidadesSeleccionadas').style.display = "none";
                document.getElementById('editarSelectModalidadCategoria').style.display = "block";
            }

            document.getElementById('editarModalidades').addEventListener('click', mostrarModalidades);
            function mostrarModalidades(e) {
                document.getElementById('editarSexo').value = datosCarrera[0].sexo;
                document.querySelector("#editarSelectModalidadCategoria input[value='"+datosCarrera[0].modalidad+"']").checked = true;
                datosCarrera[2].forEach(categoria => {
                    document.querySelector("#editarSelectModalidadCategoria input[value='"+categoria.nombre+"']").checked = true;
                });
                document.getElementById("editarModalidadEscogida").textContent = datosCarrera[0].modalidad.toUpperCase();

                document.getElementById('miModalEditarCarreraModalidades').style.display = 'block';
                document.getElementById('editarGuardarModalidad').addEventListener('click', esconderModalidad);
                function esconderModalidad(e) {
                    document.getElementById('editarSelectModalidadCategoria').classList.remove('desdeArriba');
                    document.getElementById('editarSelectModalidadCategoria').style.display = 'none';

                    document.getElementById('editarModalidad').addEventListener('click', abrirModalidad);
                    function abrirModalidad(e) {
                        document.getElementById('editarSelectModalidadCategoria').style.display = 'block';
                        document.getElementById('editarSelectModalidadCategoria').classList.add('desdeArriba');
                    }
                }
                document.querySelector('#editarCerrarModalidadX i').addEventListener('click', cerrarModalidad);
                document.getElementById('editarCrearModalidades').addEventListener('click', cerrarModalidad);
                function cerrarModalidad(e) {
                    document.getElementById('miModalEditarCarreraModalidades').style.display = 'none';
                }
            }
        }

        let editarModalidadElegida = "";
        document.querySelectorAll('input[name="tipoModalidad"]').forEach( modalidad => {
            modalidad.addEventListener('click', editarSeleccionarModalidad);
        });
        
         
        function editarSeleccionarModalidad(e) {
            editarModalidadElegida = e.target.value;
        }
        
        document.getElementById('editarGuardarModalidad').addEventListener('click', generacionEditarModalidad);
        function generacionEditarModalidad(e){
            document.getElementById("editarModalidadesSeleccionadas").style.display = "block";
          
            document.getElementById('editarPremios').innerHTML ="";
            document.querySelectorAll('input[name="tipoCategoria[]"]:checked').forEach( categoria => {
                document.getElementById('editarPremios').innerHTML +=
                `<div class="premioCategoria" data-categoria="${categoria.value}">
                    <p class="premiosNombreCategoria">${categoria.value.toUpperCase()} ${document.getElementById('sexo').value}</p>
                    <div><label for="posicion1">1.</label><input type="text" class="posicion1" name="posicion1" title="Premio primera posicion" placeholder="Pj. 300€"></div>
                    <div><label for="posicion2">2.</label><input type="text" class="posicion2" name="posicion2" title="Premio segunda posicion" placeholder="Pj. 200€"></div>
                    <div><label for="posicion3">3.</label><input type="text" class="posicion3" name="posicion3" title="Premio tercera posicion" placeholder="Pj. 100€"></div>
                </div>`;

            });
            
            datosCarrera[2].forEach(categoria => {
                let premioCategoriaDiv = document.querySelector(`#editarPremios .premioCategoria[data-categoria='${categoria.nombre}']`);
                if (premioCategoriaDiv) {
                    premioCategoriaDiv.querySelector("input[name='posicion1']").value = categoria.primero;
                    premioCategoriaDiv.querySelector("input[name='posicion2']").value = categoria.segundo;
                    premioCategoriaDiv.querySelector("input[name='posicion3']").value = categoria.tercero;
                }
            });
        }


        









        //LLAMADA API EDITAR CARRERA
        document.querySelector('#miModalEditarCarrera .crearCarreraBoton').addEventListener('click', comprobarDatosEditarCarrera);
        
        function comprobarDatosEditarCarrera(e) {
            
            let campos = ['editarNombreCarrera', 'editarFecha', 'editarLocalizacion', 'editarWebOrganizacion', 'editarDistancia'];

            let todosCompletos = true; 

            campos.forEach( campo => {
                let campoInput = document.getElementById(campo);
                    if (campoInput.value.trim() === '') {
                        todosCompletos = false;
                    }  
            });

            

            if (!document.querySelector('input[data-editarCarreraModalidad="modalidad"]:checked')) {
                todosCompletos = false;
            }
        
            if (!document.querySelector('input[data-editarCarrera="categoria"]:checked')) {
                todosCompletos = false;
            }
            
            (todosCompletos) ? enviarEditarCarrera(e) : alert('Complete los campos necesarios.');
        }
        
        
        
        function enviarEditarCarrera(e){
            
            let modalidades = [
                {
                    'modalidad' : (editarModalidadElegida == "") ? datosCarrera[0].modalidad : editarModalidadElegida,
                    'sexo' : document.getElementById('editarSexo').value,
                    'categorias' : []
                }
            ];

            document.querySelectorAll('#miModalEditarCarrera .premioCategoria').forEach( categoria => {
                let categorias = {};
                categorias.nombre = categoria.dataset.categoria;
                categorias.premios = [];
                categoria.querySelectorAll('input[type="text"]').forEach( premio => {
                    categorias.premios.push(premio.value);
                });
                modalidades[0].categorias.push(categorias);
            });
        

            let carreraEditar = new FormData();
            carreraEditar.append('nombreAntiguo', datosCarrera[0].nombre);
            carreraEditar.append('nombre', document.getElementById('editarNombreCarrera').value);
            carreraEditar.append('fecha', document.getElementById('editarFecha').value);
            carreraEditar.append('localizacion', document.getElementById('editarLocalizacion').value);
            carreraEditar.append('web', document.getElementById('editarWebOrganizacion').value);
            carreraEditar.append('distancia', document.getElementById('editarDistancia').value);
            carreraEditar.append(`modalidades`, JSON.stringify(modalidades));

            if (document.getElementById('editarPortada').files[0]) {
                carreraEditar.append('fotoPortada', document.getElementById('editarPortada').files[0]);
            }
            if (document.getElementById('editarReglamento').files[0]) {
                carreraEditar.append('reglamento', document.getElementById('editarReglamento').files[0]);
            }
            if (document.getElementById('editarImagenesCarrera').files) {
                Array.from(document.getElementById('editarImagenesCarrera').files).forEach((foto)=>{
                    carreraEditar.append('fotos[]',foto);
                });
            }
            carreraEditar.append(`modalidades`, JSON.stringify(modalidades));

            (document.getElementById('editarTrack').files[0]) ? añadirTrack() : fetchActualizarCarrera();
                
            
            function añadirTrack() {
            let coorReducidas = [];
            let desnivelPositivo = 0;
            let desnivelNegativo = 0;
            let desnivel =0;
            const file = document.getElementById('editarTrack').files[0];
            if (file) {
                
                const fileReader = new FileReader();
                const r = fileReader.readAsText(file);
                fileReader.onload = event => {
                    const textContent = event.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(textContent, "application/xml");
                    const json = toGeoJSON.gpx(xmlDoc);
                    const coor = json.features[0].geometry.coordinates;
                    let numeroPorCarrera = 200;
                    let intervalo = Math.ceil(coor.length/numeroPorCarrera);
                    
                    coorReducidas = coor.reduce((coordenadas, coordenada, index) => {
                        if (index % intervalo === 0 || index === coor.length - 1) {
                            coordenadas.push(coordenada);
                        }
                        return coordenadas;
                    }, []);

                    // console.log(coorReducidas);

                    coor.forEach( (coordenada, index) => {
                        if (index > 0) {
                            let diferencia = coordenada[2] - coor[index-1][2];
                            (diferencia>0) ? desnivelPositivo +=diferencia : desnivelNegativo += diferencia;
                        }
            
                    });
                    desnivel = desnivelPositivo+desnivelNegativo;

                    
                    
                    carreraEditar.append('desnivel',desnivel);
                    carreraEditar.append('coordenadas',JSON.stringify(coorReducidas));
                    
                    fetchActualizarCarrera();
                

                 }
                    
                    
                }

            }

            function fetchActualizarCarrera() {
                    let jwt = localStorage.getItem('jwt');
                    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/actualizarCarreras.php`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    body: carreraEditar,
                    }).then( response => {
                        if (response.status === 200){
                            window.location.reload();
                           
                        }else{
                            return response.json();
                        };
                    })
                    .then( data => {
                        console.log("created");
                    })
                    .catch ( error => {
                        console.log(error);
                    })
            }
        }



        




