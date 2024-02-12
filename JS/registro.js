let validCompleteName = false;
let validUserName= false;
let validMail = false;
let validPass= false;
let validPassComprobation = false;
let validPhone = false;
let validOrgName= false;
// let fetchDireccion = "localhost";
document.getElementById('nombreCompleto').addEventListener('blur',checkCompleteName);
document.getElementById('username').addEventListener('blur',checkUsername);
document.getElementById('mail').addEventListener('blur', checkMail)
document.getElementById("password").addEventListener('blur', checkPassword);
document.getElementById("password2").addEventListener('blur',checkSamePassword);
let selectProvincias = document.getElementById('provincia');
let selectLocalidades = document.getElementById('poblacion');






selectProvincias.options[selectProvincias.options.length] = new Option('', '');
for (let provincia of provincias) {
    selectProvincias.options[selectProvincias.options.length] = new Option(provincia.label, provincia.label);
}

selectProvincias.addEventListener('change', cargarLocalidades);

function cargarLocalidades(e) {
    selectLocalidades.innerHTML='';
    if (selectProvincias.value == '') {
        selectLocalidades.setAttribute('disabled','');
    }else{
        selectLocalidades.options[selectLocalidades.options.length] = new Option('', '');
        let provinciaSelected = provincias.find(provincia => provincia.label === document.getElementById('provincia').value);
        let poblacionesPorProvincia = poblaciones.filter(objeto => objeto.parent_code === provinciaSelected.code);
        for (let localidad of poblacionesPorProvincia) {
            selectLocalidades.options[selectLocalidades.options.length] = new Option(localidad.label, localidad.label);
        }
        selectLocalidades.removeAttribute('disabled');
    }
}

   




function checkCompleteName(e) {
    let spanAlerta = document.getElementById('alertForm');
    if (/^\s*[A-Za-zÁÉÍÓÚÑÜáéíóúñü]+(?:\s[A-Za-zÁÉÍÓÚÑÜáéíóúñü]+)*\s*$/.test(e.target.value)) {
            e.target.classList.remove("incorrecto");
            e.target.classList.add("correcto");
            spanAlerta.style.display = 'none';
            spanAlerta.innerHTML = "";
            validCompleteName= true;
            formComplete();      
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML = "Por favor, escriba un nombre completo válido.";
        
        spanAlerta.style.display = 'block';
        validCompleteName= false;
        formComplete();
    }
}




function checkUsername(e) {
    let spanAlerta = document.getElementById('alertForm');
    
    if (/^[a-zA-Z0-9]{4,16}$/.test(e.target.value)) {
        fetch(`http://${fetchDireccion}/proyectoIntegrador_DavidRodriguezGallego/API/comprobarUsernameExiste.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({'username': e.target.value})
        }).then( response => {
            if (response.status === 200) return response.json() 
            else alert("NO SE PUEDE COMPROBAR EL USERNAME");
        }).then( data => {
            if (data.existe) {
                e.target.classList.remove("correcto");
                e.target.classList.add("incorrecto");
                spanAlerta.innerHTML = "El nombre ya ha sido registrado. Por favor, elija otro.";
                spanAlerta.style.display = 'block';
                validCompleteName= false;
                
            }else{
                e.target.classList.remove("incorrecto");
                e.target.classList.add("correcto");
                spanAlerta.style.display = 'none';
                spanAlerta.innerHTML = "";
                validCompleteName= true;
            }
            formComplete();
        }).catch ( error => {
            console.log(error);
        })
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML="Por favor, escriba un nombre de usuario que contenga entre 4 y 16 caracteres. Solo permitimos números y letras."
        
        spanAlerta.style.display='block';
        validUserName = false;
        formComplete();
    }
}

function checkMail(e) {
    let spanAlerta = document.getElementById('alertForm');
    
    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
        e.target.classList.remove("incorrecto");
        e.target.classList.add("correcto");
        spanAlerta.style.display='none';
        spanAlerta.innerHTML="";
        validMail = true;
        formComplete();
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML="Por favor, escriba un correo electrónico válido."
        
        spanAlerta.style.display='block';
        validMail = false;
        formComplete();
    }
}

function checkPassword(e) {
    

    let spanAlerta = document.getElementById('alertForm');

    document.getElementById("password2").value="";
    document.getElementById("password2").classList.remove("incorrecto","correcto");
    
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(e.target.value)) {
        e.target.classList.remove("incorrecto");
        e.target.classList.add("correcto");
        spanAlerta.style.display = 'none';
        spanAlerta.innerHTML = "";
        validPass = true;
        formComplete();
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML = "Por favor, la contraseña debe contener, al menos una letra minúscula, una letra mayúscula, un número y ser superior a ocho caracteres.";
        
        spanAlerta.style.display = 'block';  
        validPass = false;
        formComplete();
    }
}


function checkSamePassword(e) {
    let spanAlerta = document.getElementById('alertForm');
    if (e.target.value == document.getElementById("password").value && document.getElementById("password").value !="") {
        e.target.classList.remove("incorrecto");
        e.target.classList.add("correcto");
        spanAlerta.style.display='none';
        spanAlerta.innerHTML="";
        validPassComprobation = true;
        formComplete();
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML="Las contraseñas no coinciden"
        
        spanAlerta.style.display='block';
        validPassComprobation = false;
        formComplete();
    }
}
function checkPhone(e) {
    let spanAlerta = document.getElementById('alertForm');


    if (/^[1-9][0-9]{8}$/.test(e.target.value)) {
        e.target.classList.remove("incorrecto");
        e.target.classList.add("correcto");
        spanAlerta.style.display='none';
        spanAlerta.innerHTML="";
        validPhone = true;
        formComplete();
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML="Por favor, escriba un teléfono válido."
        
        spanAlerta.style.display='block';
        validPhone = false;
        formComplete();
    }

}

function checkOrganizacion(e) {
    let spanAlerta = document.getElementById('alertForm');
    if (e.target.value.trim() !== "") {
        e.target.classList.remove("incorrecto");
        e.target.classList.add("correcto");
        spanAlerta.style.display='none';
        spanAlerta.innerHTML="";
        validOrgName = true;
        formComplete();
    } else {
        e.target.classList.remove("correcto");
        e.target.classList.add("incorrecto");
        spanAlerta.innerHTML="Por favor, escriba un nombre de Organización."
        
        spanAlerta.style.display='block';
        validOrgName = false;
        formComplete();
    }
}


document.getElementById("si").addEventListener('change',isOrganizer);

function isOrganizer(e){
    if (e.target.value == 'si') {
        insertDatos();
        formComplete();
    }
}
function insertDatos(){
    let nuevoDiv = document.createElement('div');
    
    nuevoDiv.innerHTML=`
    <div>
        <label for='telefono'>Teléfono</label>
        <input type='text' id='telefono' name='telefono' title='Escribir Telefono' placeholder='Teléfono'>    
    </div>
    <div>
        <label for='organizacion'>Empresa o club organizador</label>
        <input type='text' id='organizacion' name='organizacion' title='Escribir nombre de la organización' placeholder='Nombre Organización'>
    </div>
    `;

    document.getElementById('datosOrganizador').append(nuevoDiv);

    document.getElementById('telefono').addEventListener('blur', checkPhone);
    document.getElementById('organizacion').addEventListener('blur', checkOrganizacion);
}

document.getElementById("no").addEventListener('change', noIsOrganizer);

function noIsOrganizer(e) {
    if (e.target.value=='no') {
        document.getElementById('datosOrganizador').innerHTML="";
        formComplete();
    }
    
}


function formComplete() {
    if (document.getElementById('si').checked) {
        if (validCompleteName && validUserName && validMail && validPass && validPassComprobation && validPhone && validOrgName && document.getElementById('poblacion').value != '' ) {
            document.getElementById('boton').removeAttribute('disabled');
        } else {
            document.getElementById('boton').setAttribute('disabled','');
        }
    } else {
        if (validCompleteName && validUserName && validMail && validPass && validPassComprobation && document.getElementById('poblacion').value != '') {
            document.getElementById('boton').removeAttribute('disabled');
        }else{
            document.getElementById('boton').setAttribute('disabled','');
        }
    }
}