let fetchDireccion = "localhost";

if (localStorage.getItem('rol') === 'invitado' || !localStorage.getItem('rol')) {
    location.href = "../landingPage.html";
}
if (localStorage.getItem('rol') === 'organizer') {
    let enlaceFavoritos = document.querySelector('#desplegable a[href="./perfil.html#sectionFavoritos"]');
    enlaceFavoritos.insertAdjacentHTML('afterend', '<a href="./perfil.html#racesEditor">EDITAR CARRERAS</a>');
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
                response.json()
            }).then(data => {
                if (data && data.token) {
                    localStorage.setItem('jwt', data.token);
                }
            }).catch(error => console.error("Error al renovar el token", error));
        }
    }
}

setInterval(verificarYRenovarToken, 300000);

document.getElementById("cerrarSesionDesplegable").addEventListener('click', cerrarSesion);

function cerrarSesion(e) {
    e.preventDefault();
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    location.href = "./inicio.html";
}


let username = localStorage.getItem('username');
function mostrarUsername() {
    
    document.getElementById("username").innerHTML = `${username}
    <i class="bi bi-caret-down-fill"></i>
    `;
}



mostrarUsername();
document.getElementById("username").addEventListener('click', function(){
    document.getElementById("desplegable").classList.toggle('mostrarDesplegable');
    if (document.getElementById("desplegable").classList.contains("mostrarDesplegable")) {
        document.getElementById("username").innerHTML = `${username}
        <i class="bi bi-caret-up-fill"></i>
    `;
    }else{
        document.getElementById("username").innerHTML = `${username}
        <i class="bi bi-caret-down-fill"></i>
    `;
    }
})

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
            console.log(data);
            document.getElementById("cabeceraFotoPerfil").src = `../API/users/user${data.id}/fotos/${data.fotoPerfil}`;
            
        }).catch ( error => {
            console.log(error);
        })

//Obtener datos de la Carrera
let datosCarreras = [];
function obtenerDatosCarrera() {
    let nombre=localStorage.getItem('nombreCarrera');
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerDatosCarreras.php`, {
        method: "POST",
        body: JSON.stringify({'nombre': nombre}),
    }).then( response => {
        if (response.status === 200) return response.json() 
            else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
    }).then( data => {
        console.log(data);
        datosCarreras = data;
        renderDatos();
    }).catch ( error => {
        console.log(error);
    })
}

function renderDatos() {
    isFavorite();
    



    console.log(datosCarreras);
    document.getElementById('favorito').addEventListener('click', añadirFavorito);
    document.querySelector('#menu span').textContent = datosCarreras[0].nombre;
    document.getElementById('fecha').textContent = datosCarreras[0].fecha;
    document.getElementById('distancia').textContent = datosCarreras[0].distancia;
    document.getElementById('desnivel').textContent = datosCarreras[0].desnivel;
    document.getElementById('modalidad').textContent = (datosCarreras[0].modalidad).toUpperCase();
    document.getElementById('web').textContent = datosCarreras[0].enlaceWeb;
    document.getElementById('web').setAttribute('href', datosCarreras[0].web);
    document.getElementById('lugar').textContent = datosCarreras[0].localizacion;
    document.getElementById('reglamento').setAttribute('href', `../../API/users/user${datosCarreras[0].id_usuario}/carreras/${datosCarreras[0].reglamento}`);
    document.getElementById('reglamento').setAttribute('download', `Reglamento_${datosCarreras[0].nombre}.pdf`);

    
    document.querySelector('.carousel-inner').innerHTML = "";
    for (let imagen of datosCarreras[1]) {
        document.querySelector('.carousel-inner').innerHTML += 
        `<div class="carousel-item active">
            <img src="../API/users/user${datosCarreras[0].id_usuario}/carreras/imagenes/${imagen.nombreFoto}" class="d-block w-100" alt="Imagen de la carrera">
        </div>`;
    }


    document.getElementById('categorias').innerHTML = "";


    let sexos = (datosCarreras[0].sexo == "(M/F)") ? "Masculina y Femenina" : (datosCarreras[0].sexo == "(M)") ? "Masculina" : "Femenina";

    for (let categoria of datosCarreras[2]) {
        document.getElementById('categorias').innerHTML += 
        `
        <div class="categoria">
            <div class="categoriaCabecera">
                <span class="nombreCategoria">CATEGORÍA ${categoria.nombre.toUpperCase()}</span>
                <span class="sexoCategoria">${sexos}</span>
            </div>
            <div class="categoriaCuerpo">
                <span>POSICIONES</span>
                <span id="primero">1. ${categoria.primero}€</span>
                <span id="segund">2. ${categoria.segundo}€</span>
                <span id="tercero">3. ${categoria.tercero}€</span>
            </div>
        </div>
        `;
    }
    //Cargar mapa
    let coordenadas = JSON.parse(datosCarreras[0].track);
    let coordenadasInvertidas = coordenadas.map(function(coord) {
        return [coord[1], coord[0]]; 
      });
    let mapa = L.map('map').setView([coordenadasInvertidas[0][0], coordenadasInvertidas[0][1]], 10);

    L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', 
    {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(mapa); 

    L.control.scale().addTo(mapa)

    
    L.polyline(coordenadasInvertidas,{color: '#283618', weight:5} ).addTo(mapa);


    if (datosCarreras[0].fecha < new Date().toISOString().split('T')[0]) {
        document.getElementById('clasificacionesPasadas').style.display = "block";
        document.getElementById('clasificaciones').style.display = "block";
        let puestos = [];
        let selectCategoria=document.getElementById('selectCategoria');
        
    
        let idCategorias = [];
        for (let categoria of datosCarreras[2]) {
            idCategorias.push(categoria.id);
            selectCategoria.options[selectCategoria.options.length] = new Option(categoria.nombre.toUpperCase(), categoria.nombre);
        }
        cargarClasficaciones();
        if (document.getElementById('selectCategoria')) {
            document.getElementById('selectCategoria').addEventListener('change', cargarClasficaciones);
        }
        function cargarClasficaciones(e) {
            let categoria = document.getElementById('selectCategoria').value;
            let carrera = datosCarreras[2].find(carrera => carrera.nombre == categoria);
            let clasificacion = carrera.clasificacion;

            if (clasificacion.length > 0) {
                document.getElementById('contenedorClasificaciones').innerHTML = 
                `
            <div id="tablaClasificacion">
                <div id="tablaCabecera">
                    <div>
                        <span>PUESTO</span>
                    </div>
                    <div>
                        <span>NOMBRE</span>
                    </div>
                </div>
                <div id="tablaBody">
                    <div class="fila">
                        <div><span>1.</span></div>
                        <div><span id="primero">${clasificacion[0].primero}</span></div>
                    </div>
                    <div class="fila">
                        <div><span>2.</span></div>
                        <div><span id="segundo">${clasificacion[0].segundo}</span></div>
                    </div>
                    <div class="fila">
                        <div><span>3.</span></div>
                        <div><span id="tercero">${clasificacion[0].tercero}</span></div>
                    </div>
                    <div class="fila">
                        <div><span>4.</span></div>
                        <div><span id="cuarto">${clasificacion[0].cuarto}</span></div>
                    </div>
                    <div class="fila">
                        <div><span>5.</span></div>
                        <div><span id="quinto">${clasificacion[0].quinto}</span></div>
                    </div> 
                </div>
            </div>
                
                `;
                
                if (localStorage.getItem('username') === datosCarreras[3].username){
                    document.getElementById('editarClasificacion').style.display = "block";
                }
                document.getElementById('editarClasificacion').addEventListener('click', function(){
                    document.getElementById('miModalEditar').style.display = "block";
                        document.querySelector('.cerrarEditar').addEventListener('click', function(){
                            document.querySelectorAll('#miModalEditar input').forEach(input => {
                                input.value = "";
                            });
                            document.getElementById('miModalEditar').style.display = "none";
                        });
                });

                document.getElementById('editarInputModalPrimero').value = clasificacion[0].primero;
                document.getElementById('editarInputModalSegundo').value = clasificacion[0].segundo;
                document.getElementById('editarInputModalTercero').value = clasificacion[0].tercero;
                document.getElementById('editarInputModalCuarto').value = clasificacion[0].cuarto;
                document.getElementById('editarInputModalQuinto').value = clasificacion[0].quinto;


                document.querySelectorAll('#miModalEditar input').forEach(input => {
                    input.addEventListener('blur', function(){
                        if (document.getElementById('editarInputModalPrimero').value.trim() != "" && document.getElementById('editarInputModalSegundo').value.trim() != "" && document.getElementById('editarInputModalTercero').value.trim() != "" && document.getElementById('editarInputModalCuarto').value.trim() != "" && document.getElementById('editarInputModalQuinto').value.trim() != "") {
                            document.getElementById('editarGuardarPerfil').removeAttribute('disabled');
                        }else{
                            document.getElementById('editarGuardarPerfil').setAttribute('disabled', 'true');
                        }
                    });
                });

                document.getElementById('editarGuardarPerfil').addEventListener('click', editarClasificacion);

                function editarClasificacion() {
                    let tabla = {
                        'idCategoria' : carrera.id,
                        'primero' : document.getElementById('editarInputModalPrimero').value,
                        'segundo' : document.getElementById('editarInputModalSegundo').value,
                        'tercero' : document.getElementById('editarInputModalTercero').value,
                        'cuarto' : document.getElementById('editarInputModalCuarto').value,
                        'quinto' : document.getElementById('editarInputModalQuinto').value
                    }

                    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/editarClasificacion.php`, {
                    method: "PUT",
                    body: JSON.stringify(tabla),
                    }).then( response => {
                        if (response.status === 204) window.location.reload();
                            else alert("NO SE PUEDEN EDITARLAS CARRERAS");
                    }).catch ( error => {
                        console.log(error);
                    })
                }
                
            }else{
                if (localStorage.getItem('username') === datosCarreras[3].username){
                    document.getElementById('editarClasificacion').style.display = "none";
                    document.getElementById('contenedorClasificaciones').style.flexDirection = "column";
                    document.getElementById('contenedorClasificaciones').style.alignItems = "center";
                    document.getElementById('contenedorClasificaciones').innerHTML = 
                    `
                        <p id="mensajeCrearClasificacion">Ya puedes registrar la clasificación de tu carrera</p>
                        
                        <div id="divCrearClasificacion">AÑADIR CLASIFICACIÓN</div>
                    `;
                    
                   
                    document.getElementById('divCrearClasificacion').addEventListener('click', function(){
                        document.getElementById('miModal').style.display = "block";
                        document.querySelector('.cerrar').addEventListener('click', function(){
                            document.querySelectorAll('#miModal input').forEach(input => {
                                input.value = "";
                            });
                            document.getElementById('miModal').style.display = "none";
                        });
                    });

                    document.querySelectorAll('#miModal input').forEach(input => {
                        input.addEventListener('blur', function(){
                            if (document.getElementById('inputModalPrimero').value.trim() != "" && document.getElementById('inputModalSegundo').value.trim() != "" && document.getElementById('inputModalTercero').value.trim() != "" && document.getElementById('inputModalCuarto').value.trim() != "" && document.getElementById('inputModalQuinto').value.trim() != "") {
                                document.getElementById('guardarPerfil').removeAttribute('disabled');
                            }else{
                                document.getElementById('guardarPerfil').setAttribute('disabled', 'true');
                            }
                        });
                    });

                    document.getElementById('guardarPerfil').addEventListener('click', insertarClasificacion);

                    function insertarClasificacion() {
                        let tabla = {
                            'idCategoria' : carrera.id,
                            'primero' : document.getElementById('inputModalPrimero').value,
                            'segundo' : document.getElementById('inputModalSegundo').value,
                            'tercero' : document.getElementById('inputModalTercero').value,
                            'cuarto' : document.getElementById('inputModalCuarto').value,
                            'quinto' : document.getElementById('inputModalQuinto').value
                        }

                        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/insertarClasificacion.php`, {
                        method: "POST",
                        body: JSON.stringify(tabla),
                        }).then( response => {
                            if (response.status === 204) window.location.reload();
                                else alert("NO SE PUEDEN AÑADIR LAS CARRERAS");
                        }).catch ( error => {
                            console.log(error);
                        })
                    }


                }else{  
                    document.getElementById('contenedorClasificaciones').innerHTML = 
                    `
                        <h2>Clasificaciones no disponibles</h2>
                    `;
                }
              
            }
        }


    }




  
}
function isFavorite() {
    let nombreCarrera = localStorage.getItem('nombreCarrera');
    let jwt = localStorage.getItem('jwt');
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/isFavorite.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({'nombreCarrera': nombreCarrera})
        }).then( response => {
            if (response.status==200) {
                return response.json();
            }else{
                alert("ERROR DE PETICION");
            }
        }).then( data => {
            console.log(data);
            if (data.favorito == "true") {
                document.getElementById('favorito').classList.add('favoritoAñadido');
                document.getElementById('favorito').classList.remove('bi-bookmark');
                document.getElementById('favorito').classList.add('bi-bookmark-fill');
            }else{
                document.getElementById('favorito').classList.remove('favoritoAñadido');
                document.getElementById('favorito').classList.add('bi-bookmark');
            }

        }).catch ( error => {
            console.log(error);
        })
}
function añadirFavorito(e) {
    e.target.classList.toggle('favoritoAñadido');
    let nombreCarrera = localStorage.getItem('nombreCarrera');
    if (e.target.classList.contains('favoritoAñadido')) {
        e.target.classList.remove('bi-bookmark');
        e.target.classList.add('bi-bookmark-fill');
        let jwt = localStorage.getItem('jwt');
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/añadirFavoritos.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({'nombreCarrera': nombreCarrera})
        }).then( response => {
            if (response.status==404) {
                alert("NO SE HA PODIDO AÑADIR A FAVORITOS");
            }
        }).catch ( error => {
            console.log(error);
        })
    } else {
        e.target.classList.remove('bi-bookmark-fill');
        e.target.classList.add('bi-bookmark');

        let jwt = localStorage.getItem('jwt')
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/borrarFavorito.php`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({'nombreCarrera': nombreCarrera})
        }).then( response => {
            if (response.status==404) {
                alert("NO SE HA PODIDO AÑADIR A FAVORITOS");
            }
        }).catch ( error => {
            console.log(error);
        })

    }
}

obtenerDatosCarrera();