let fetchDireccion = "localhost";
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
        return [coord[1], coord[0]]; // Invierte los elementos
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
        let puestos = [];
        let selectCategoria=document.getElementById('selectCategoria');
        
        selectCategoria.options[selectCategoria.options.length] = new Option('CATEGORÍAS', '');
        let idCategorias = [];
        for (let categoria of datosCarreras[2]) {
            idCategorias.push(categoria.id);
            selectCategoria.options[selectCategoria.options.length] = new Option(categoria.nombre, categoria.nombre);
        }

        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/obtenerClasificacionCarreras.php`, {
        method: "POST",
        body: JSON.stringify(idCategorias),
        }).then( response => {
            if (response.status === 200) return response.json() 
                else alert("NO SE PUEDEN CARGAR LAS CARRERAS");
        }).then( data => {
            puestos = data;
            mostrarClasificaion();
        }).catch ( error => {
            console.log(error);
        })


        function mostrarClasificaion() {
            
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