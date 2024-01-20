function checkMediaQuery() {
    if (window.matchMedia('(max-width: 530px)').matches) {
        document.querySelector('.divAbajo p:last-child').textContent = '';
    }else if (window.matchMedia('(min-width: 531px) and (max-width: 1230px)').matches) {
        
        document.querySelector('.divAbajo p:last-child').textContent = 'Si eres un apasionado de desafiar los límites entre el cielo y la tierra, ¡has llegado al lugar indicado!';
    }else {
        document.querySelector('.divAbajo p:last-child').textContent = `Si eres un apasionado de desafiar los límites entre el cielo y la tierra, ¡has llegado al lugar indicado! En nuestra plataforma, sumérgete en un universo de emocionantes carreras de montaña que despiertan tu espíritu aventurero. Desde senderos sinuosos hasta ascensos desafiantes, cada ruta es una historia por descubrir.
                            
                            Únete a nosotros y comienza tu viaje hacia emociones inigualables en las cimas. ¡La aventura te espera!`;
    }
}


window.onload = checkMediaQuery;
window.onresize = checkMediaQuery;
