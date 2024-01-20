document.querySelector('h2').addEventListener('click',registrarUsuario);


function registrarUsuario(e) {
    let user={};
    if (document.getElementById('si').checked) {
        
        user = {
            "name": document.getElementById('nombreCompleto').value,
            "username": document.getElementById('username').value,
            "mail": document.getElementById('mail').value,
            "pass": document.getElementById('password').value,
            "city": document.getElementById('poblacion').value,
            "phone": document.getElementById('telefono').value,
            "club": document.getElementById('organizacion').value,
            "rol": "organizer"
        };
    
    }else{
        user = {
            "name": document.getElementById('nombreCompleto').value,
            "username": document.getElementById('username').value,
            "mail": document.getElementById('mail').value,
            "pass": document.getElementById('password').value,
            "city": document.getElementById('poblacion').value,
            "phone": "",
            "club": "",
            "rol": "user"
        };
    }


    fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    }).then( response => {
        console.log(response);
        if (response.status === 200) location.href = '../landingPage.html'
            else if (response.status === 404) console.log(response.text); 
            else console.log("Todo mal");
    }).then( data => {
        console.log(data);
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







