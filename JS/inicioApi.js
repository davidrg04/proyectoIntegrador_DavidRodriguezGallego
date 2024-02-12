localStorage.clear();
document.getElementById('entrar').addEventListener('click',iniciarSesion);
let fetchDireccion = "localhost";

function iniciarSesion(e) {
    document.getElementById('inicioIncorrecto').style.display = "none";
    document.getElementById('inicioIncorrecto').innerHTML = "";
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
        if (response.status === 200){
            return response.json()
        }else{
            document.getElementById('inicioIncorrecto').textContent = "Usuario o contraseña incorrectos";
            document.getElementById('inicioIncorrecto').style.display = "block";
        } 
            
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


document.getElementById('invitado').addEventListener('click',entrarInvitado);

function entrarInvitado(e) {
    localStorage.setItem('rol', 'invitado');
    location.href = "./PAGINAS/inicio.html";
}