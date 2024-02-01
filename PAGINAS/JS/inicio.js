//Mostrar username
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


