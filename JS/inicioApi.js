document.getElementById('mensajePrincipal').addEventListener('click',iniciarSesion);


function iniciarSesion(e) {
    console.log('Holaaaaa');
    let user={
        "username" : document.getElementById('user').value,
        "pass" : document.getElementById('pass').value
    };

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(user)
    }).then( response => {
        console.log(response);
        if (response.status === 200) location.href = '../PAGINAS/inicio.html'
            else if (response.status === 404) console.log(response.text); 
            else console.log("Todo mal");
    }).then( data => {
        console.log(data);
    }).catch ( error => {
        console.log(error);
    })

}