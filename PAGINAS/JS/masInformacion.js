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
    fetch("http://localhost/proyectoIntegrador_DavidRodriguezGallego/API/obtenerDatosCarreras.php", {
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
   console.log(datosCarreras);
}

obtenerDatosCarrera();