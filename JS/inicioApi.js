localStorage.clear();
document.getElementById('entrar').addEventListener('click',iniciarSesion);
let fetchDireccion = "localhost";




function iniciarSesion(e) {
    e.preventDefault();
    let user={
        "username" : document.getElementById('user').value,
        "password" : document.getElementById('pass').value
    };

    fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/iniciarSesion.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    }).then( response => {
        console.log(response);
        if (response.status === 200) return response.json()
            else if (response.status === 404) console.log(response.text); 
            else console.log("Todo mal");
    }).then( data => {
        if (data && data.token) {
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('rol', data.rol)
            location.href = "../PAGINAS/inicio.html";
        }
    }).catch ( error => {
        console.log(error);
    })

}