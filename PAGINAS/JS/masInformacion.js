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