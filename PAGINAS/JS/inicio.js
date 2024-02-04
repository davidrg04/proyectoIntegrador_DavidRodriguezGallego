//Mostrar username
localStorage.removeItem('nombreCarrera');

let username = localStorage.getItem('username');
function mostrarUsername() {
    
    document.getElementById("username").innerHTML = `${username}
    <i class="bi bi-caret-down-fill"></i>
    `;
}

mostrarUsername()



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
document.getElementById("filter").addEventListener('click', function(){
    document.getElementById("desplegableOrdenar").classList.toggle('mostrarDesplegable');
});


//Mostrar menu fijado

let posicionOriginalMenu = document.getElementById('menu').offsetTop;
window.addEventListener('scroll', function() {
    let menu = document.getElementById('menu');

    if (window.scrollY > posicionOriginalMenu) {
        menu.classList.add('fijo');
    } else {
        menu.classList.remove('fijo');
    }
});

//SELECT DE LAS PROVINCIAS
// provincias.sort((a, b) => {
//     const labelA = a.label.toLowerCase();
//     const labelB = b.label.toLowerCase();
  
//     if (labelA < labelB) {
//       return -1;
//     }
//     if (labelA > labelB) {
//       return 1;
//     }
//     return 0;
//   });
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

function generarCarreras() {
    fetch("http://localhost/proyectoIntegrador_DavidRodriguezGallego/API/obtenerCarreras.php", {
        method: "GET",
    }).then( response => {
        if (response.status === 200) return response.json() 
            else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
    }).then( data => {
        carreras = data;
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
}

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
