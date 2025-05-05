document.addEventListener('DOMContentLoaded', () => {
    const lang = new URLSearchParams(window.location.search).get('lang') || 'ES';
    const configPath = `conf/config${lang.toUpperCase()}.json`;

    let estudiantes = [];
    let mensajeNoResultados = "No hay alumnos que tengan en su nombre: ";

    const searchInput = document.querySelector('.busqueda .text-input');
    const lista = document.querySelector('.lista-estudiantes');
    const mensajeElemento = document.querySelector('.mensaje-no-resultados');

    fetch(configPath)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el JSON');
            return response.json();
        })
        .then(config => {
            renderizarConfig(config);
            mensajeNoResultados = config.noResultados || mensajeNoResultados;
            cargarEstudiantes();
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.titulo-nav').textContent = "Error cargando configuración";
        });

    function renderizarConfig(config) {
        const tituloNav = document.querySelector('.titulo-nav');
        if (tituloNav) {
            const mainText = tituloNav.querySelector('.main-text');
            const ucvText = tituloNav.querySelector('.ucv');
            const secondaryText = tituloNav.querySelector('.secondary-text');

            if (mainText && ucvText && secondaryText) {
                mainText.textContent = config.sitio[0];
                ucvText.textContent = config.sitio[1];
                secondaryText.textContent = config.sitio[2];
            }
        }

        const saludoElement = document.querySelector('.Saludo');
        if (saludoElement) saludoElement.textContent = config.saludo || "Bienvenido";

        if (searchInput) searchInput.placeholder = config.nombre || "Buscar...";
        const submitBtn = document.querySelector('.busqueda .submit-btn');
        if (submitBtn) submitBtn.value = config.buscar || "Buscar";

        const copyright = document.querySelector('.copyright-text');
        if (copyright) copyright.textContent = config.copyRight || "Derechos reservados";
    }

    function cargarEstudiantes() {
        fetch('datos/index.json')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar estudiantes');
                return response.json();
            })
            .then(data => {
                estudiantes = data;
                renderEstudiantes(estudiantes);
                configurarBusqueda();
            })
            .catch(error => console.error('Error cargando estudiantes:', error));
    }

    function renderEstudiantes(listaEstudiantes) {
        lista.innerHTML = '';
        listaEstudiantes.forEach(est => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${est.imagen}" alt="${est.nombre}">
                <p>${est.nombre}</p>
            `;
            lista.appendChild(li);
        });
    }

    function configurarBusqueda() {
        if (!searchInput) return;
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const resultados = estudiantes.filter(est =>
                est.nombre.toLowerCase().includes(query)
            );

            if (resultados.length === 0) {
                lista.innerHTML = '';
                mensajeElemento.textContent = `${mensajeNoResultados}"${query}"`;
                mensajeElemento.style.display = 'block';
            } else {
                mensajeElemento.style.display = 'none';
                renderEstudiantes(resultados);
            }
        });
    }
});