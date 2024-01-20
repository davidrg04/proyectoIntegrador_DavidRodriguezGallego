function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}


function checkScroll() {
    document.querySelectorAll('.hidden').forEach((elem) => {
        if (isInViewport(elem)) {
            elem.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkScroll);
