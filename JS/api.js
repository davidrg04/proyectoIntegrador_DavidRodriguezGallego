document.getElementById('boton').addEventListener('click',registrarUsuario);

let fetchDireccion = "localhost";



function registrarUsuario(e) {
    e.preventDefault();
    let user={};
    if (document.getElementById('si').checked) {
        
        user = {
            "nombreCompleto": document.getElementById('nombreCompleto').value,
            "username": document.getElementById('username').value,
            "mail": document.getElementById('mail').value,
            "password": document.getElementById('password').value,
            "poblacion": document.getElementById('poblacion').value,
            "telefono": document.getElementById('telefono').value,
            "nombreOrg": document.getElementById('organizacion').value,
            "fotoPerfil" : "perfil.png"
        };
    
    }else{
        user = {
            "nombreCompleto": document.getElementById('nombreCompleto').value,
            "username": document.getElementById('username').value.toLowerCase(),
            "mail": document.getElementById('mail').value,
            "password": document.getElementById('password').value,
            "poblacion": document.getElementById('poblacion').value,
            "fotoPerfil" : "perfil.png"
        };
    }


    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/registro.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    }).then( response => {
        console.log(response);
        if (response.status === 200) return response.json();
            else if (response.status === 404) console.log(response.text); 
            else console.log("Todo mal");
    }).then( data => {
        console.log(data);
        location.href = "../landingPage.html";
    }).catch ( error => {
        console.log(error);
    })

}





// fetch("http://localhost:3000/api/user/register", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json;charset=utf-8"
//         },
//         body: JSON.stringify(user)
//     }).then( response => {
//         console.log(response);
//         if (response.status === 200) return response.json()
//             else if (response.status === 404) console.log(response.text); 
//             else console.log("Todo mal");
//     }).then( data => {
//         console.log(data);
//     }).catch ( error => {
//         console.log(error);
// })







