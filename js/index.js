document.addEventListener('DOMContentLoaded', () => {
    aplicarConfiguracion(config);
    mostrarEstudiantes(perfiles);
});

function aplicarConfiguracion(config) {
    const año = document.querySelector('.ano small');
    if (año) año.textContent = config.sitio[2];

    const titulo = document.querySelector('.titulo-nav');
    if (titulo) titulo.insertAdjacentText("afterbegin", `${config.sitio[0]} ${config.sitio[1]} `);

    const saludo = document.querySelector('nav ul li:nth-child(2) strong');
    if (saludo) saludo.textContent = config.saludo;

    const input = document.querySelector('.busqueda input[type="text"]');
    const boton = document.querySelector('.busqueda input[type="submit"]');
    if (input) input.placeholder = config.nombre;
    if (boton) boton.value = config.buscar;

    const footer = document.querySelector('footer strong');
    if (footer) footer.textContent = config.copyRight;
}

function mostrarEstudiantes(perfiles) {
    const lista = document.querySelector('.lista-estudiantes');
    if (!lista) return;

    perfiles.forEach(est => {
        const li = document.createElement('li');
        li.innerHTML = `
            <figure>
                <img src="img/${est.imagen}" alt="${est.nombre}">
                <figcaption>${est.nombre}</figcaption>
            </figure>
        `;
        lista.appendChild(li);
    });
}
