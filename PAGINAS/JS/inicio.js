let fetchDireccion = "localhost";
//Mostrar username
localStorage.removeItem('nombreCarrera');
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

if(!localStorage.getItem('jwt')) {
    localStorage.setItem('rol', 'invitado');
}
if (localStorage.getItem('rol') === 'organizer'){
    let enlaceFavoritos = document.querySelector('#desplegable a[href="./perfil.html#sectionFavoritos"]');
    enlaceFavoritos.insertAdjacentHTML('afterend', '<a href="./perfil.html#racesEditor">EDITAR CARRERAS</a>');

}
if (localStorage.getItem('jwt')) {
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
   
    
    document.getElementById("cerrarSesionDesplegable").addEventListener('click', cerrarSesion);

    function cerrarSesion(e) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        localStorage.removeItem('rol');
        window.location.reload();
    }
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
document.getElementById("filter").addEventListener('click', function(){
    document.getElementById("desplegableOrdenar").classList.toggle('mostrarDesplegable');
});

if (localStorage.getItem('rol') === 'invitado') {
    document.getElementById('username').style.display = 'none';
    document.getElementById('desplegable').style.display = 'none';

    document.getElementById('datosUsuario').innerHTML = 
    `
        <div id="divIniciarSesion">INICIAR SESIÓN</div>
    `;

   

    document.getElementById('divIniciarSesion').addEventListener('click', abrirInicioSesion);
    function abrirInicioSesion(e) {
        e.preventDefault();
        document.getElementById('miModal').style.display = 'block';
    }

    document.querySelector('.cerrar').addEventListener('click', cerrarModal);
    function cerrarModal(e) {
        document.getElementById('miModal').style.display = 'none';
    }

    let inicioCompletado = false;

    document.getElementById('inputModalUsuario').addEventListener('blur', validarCampos);
    document.getElementById('inputModalContraseña').addEventListener('blur', validarCampos);
    
    function validarCampos() {
        const usuario = document.getElementById('inputModalUsuario').value.trim();
        const contraseña = document.getElementById('inputModalContraseña').value.trim();
    
        inicioCompletado = usuario !== "" && contraseña !== "";

        if (inicioCompletado) {
            document.getElementById('guardarPerfil').removeAttribute('disabled','');
        }else{
            document.getElementById('guardarPerfil').setAttribute('disabled','');
        }
    }
    

    document.getElementById('guardarPerfil').addEventListener('click', iniciarSesionInvitado);
    
    function iniciarSesionInvitado(e) {
        let user={
            "username" : document.getElementById('inputModalUsuario').value.trim(),
            "password" : document.getElementById('inputModalContraseña').value.trim()
        };
    
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/iniciarSesion.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(user)
        }).then( response => {
            
            if (response.status === 200) return response.json()
                else if (response.status === 404) console.log(response.text); 
                else console.log("Todo mal");
        }).then( data => {
            if (data && data.token) {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('rol', data.rol)
                window.location.reload();
            }
        }).catch ( error => {
            console.log(error);
        })
    }


    
}






let posicionOriginalMenu = document.getElementById('menu').offsetTop;
window.addEventListener('scroll', function() {
    let menu = document.getElementById('menu');

    if (window.scrollY > posicionOriginalMenu) {
        menu.classList.add('fijo');
    } else {
        menu.classList.remove('fijo');
    }
});

provincias.sort((a, b) => {
    return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
  });

let selectProvincias=document.getElementById('lugarCarrera');

selectProvincias.options[selectProvincias.options.length] = new Option('PROVINCIA', '');
for (let provincia of provincias) {
    selectProvincias.options[selectProvincias.options.length] = new Option(provincia.label, provincia.label);
}

//MOSTRAR CARRERAS
let carreras = [];
let carrerasOriginal = [];
function generarCarreras() {
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerCarreras.php`, {
        method: "GET",
    }).then( response => {
        if (response.status === 200) return response.json() 
            else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
    }).then( data => {
        carreras = [...data];
        carrerasOriginal = [...data];
        renderCarreras();
    }).catch ( error => {
        console.log(error);
    })



}
let divCarreras = document.getElementById('rejillaCarreras');
generarCarreras();

let filter = "";
let provincia = "";
let finalizada = "";
let currentPage = 0;
let elementsPerPage = 8;
let paginasTotales = Math.ceil((carreras.length / elementsPerPage));
document.getElementById("buscar").addEventListener('click', clickBuscar);

function renderCarreras() {
    divCarreras.innerHTML="";
    carreras
        .filter(({nombre}) => nombre.toLowerCase().includes(filter))
        .filter(({localizacion}) => localizacion.includes(provincia))
        .filter(({fecha}) =>  finalizada != "" ? fecha < finalizada : true)
        .filter((item,index) =>{
            return Math.trunc(index/elementsPerPage) == currentPage;
        })
        .forEach( ({nombre, id_usuario,portada, fecha, localizacion, distancia}) => {
        divCarreras.innerHTML += `
        <div class="tarjetaCarrera">
                    <div class="fotoPortada">
                        <p>${nombre}</p>
                        <img src="../API/users/user${id_usuario}/carreras/imagenes/${portada}" alt="Foto de la carrera">
                    </div>
                    <div class="datosCarrera">
                        <span class="fecha"><i class="bi bi-calendar-fill"></i>${fecha}</span>
                        <span class="localidad"><i class="bi bi-geo-alt-fill"></i>${localizacion}</span>
                        <span class="distancia"><i class="bi bi-info-circle-fill"></i></i>${distancia}KM</span>
                        <a href="./masInformacion.html" class="enlaceCarrera"><div class="detallesCarrera" data-nombrecarrera="${nombre}">MAS INFORMACIÓN</div></a>
                    </div>
                </div>
        `
    })
    paginasTotales = Math.ceil((carreras.filter(({ nombre }) => nombre.toLowerCase().includes(filter)).length) / elementsPerPage);
    document.getElementById("paginaActual").textContent = `Pagina ${currentPage + 1} de ${paginasTotales}`;
    Array.from(document.getElementsByClassName("detallesCarrera")).forEach( (element) => {
        element.addEventListener('click', guardarNombreCarrera);
    });

    if (localStorage.getItem('rol') === 'invitado') {
        document.querySelectorAll('.enlaceCarrera').forEach( (element) => {
            element.addEventListener('click', abrirInicioSesion);
        });
        function abrirInicioSesion(e) {
            e.preventDefault();
            document.getElementById('miModal').style.display = 'block';
        }
    }
  
   
}
document.querySelector("#divPaginacion .first").addEventListener('click', ()=>{
    currentPage = 0;
    renderCarreras();
});
document.querySelector("#divPaginacion .next").addEventListener('click', ()=>{
    currentPage = (currentPage < paginasTotales - 1) ? currentPage+1 : currentPage;
    renderCarreras();
});
document.querySelector("#divPaginacion .prev").addEventListener('click', ()=>{
    currentPage = (currentPage > 0) ? currentPage-1 : currentPage;
    renderCarreras();
})
document.querySelector("#divPaginacion .last").addEventListener('click',() =>{
    currentPage = paginasTotales - 1;
    renderCarreras();
});
document.getElementById('porNombre').addEventListener('click', (e) => {
    
    document.getElementById('porFecha').classList.remove('seleccionado');
    document.getElementById('porDistancia').classList.remove('seleccionado');


    document.getElementById('porNombre').classList.toggle('seleccionado');

    if (e.target.classList.contains('seleccionado')) {
        carreras.sort((a, b) => {
            return a.nombre.localeCompare(b.nombre, undefined, { sensitivity: 'base' });
          });
          renderCarreras();
    }else{
        carreras = [...carrerasOriginal];
        renderCarreras();
    }
    
});
document.getElementById('porFecha').addEventListener('click', (e) => {
    document.getElementById('porNombre').classList.remove('seleccionado');
    document.getElementById('porDistancia').classList.remove('seleccionado');

    document.getElementById('porFecha').classList.toggle('seleccionado');

    if (e.target.classList.contains('seleccionado')) {
        carreras.sort((a, b) => {
            return new Date(a.fecha) - new Date(b.fecha);
            });
            renderCarreras();
    }else{
        carreras = [...carrerasOriginal];
        renderCarreras();
    }

});
document.getElementById('porDistancia').addEventListener('click', (e) => {
    document.getElementById('porNombre').classList.remove('seleccionado');
    document.getElementById('porFecha').classList.remove('seleccionado');

    document.getElementById('porDistancia').classList.toggle('seleccionado');

    if (e.target.classList.contains('seleccionado')) {
        carreras.sort((a, b) => {
            return a.distancia - b.distancia;
            });
            renderCarreras();
    }else{
        carreras = [...carrerasOriginal];
        renderCarreras();
    }
});

function clickBuscar(e) {
    let fechaActual = new Date();
    filter = document.getElementById("raceName").value.trim().toLowerCase();
    provincia = selectProvincias.value;
    finalizada = (document.getElementById("finalizada").checked) ? fechaActual.toISOString().split('T')[0] : "";
    currentPage = 0;
    renderCarreras();
}




function guardarNombreCarrera(e) {
    let nombreCarrera = e.target.closest('.detallesCarrera').dataset.nombrecarrera;
    localStorage.setItem('nombreCarrera', nombreCarrera);
}

document.getElementById("mapaCarreras").addEventListener('click', mapaCarreras);

function mapaCarreras(e) {
   document.getElementById('miModalMapa').style.display = 'block';

   document.getElementById('cerrarMapa').addEventListener('click', cerrarModalMapa);
    function cerrarModalMapa(e) {
         document.getElementById('miModalMapa').style.display = 'none';
    }
    let coordenadas = [];
    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/devolverCoordenadas.php`, {
        method: "GET",
    }).then( response => {
        if (response.status === 200) return response.json() 
            else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
    }).then( data => {
        coordenadas = data;
        renderMapa();
    }).catch ( error => {
        console.log(error);
    })
    
    function renderMapa() {
        
          let mapa = L.map('map').setView([40.46, -3.74], 6);

          L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', 
            {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            }).addTo(mapa); 

            
            
            coordenadas.forEach( carrera => {
                let coordenadasMapa = JSON.parse(carrera.track);
                
                const marker = L.marker([coordenadasMapa[0][1], coordenadasMapa[0][0]], {title: `${carrera.nombre}`}).addTo(mapa);
            });

    }


}




