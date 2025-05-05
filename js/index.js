document.addEventListener('DOMContentLoaded', () => { 
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang')?.toUpperCase() || 'ES';  // Si no hay lang, usa español

    const configPath = `conf/config${lang}.json`;

    fetch(configPath)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el archivo de configuración');
            return response.json();
        })
        .then(config => {
            renderizarConfig(config);
            cargarEstudiantes();
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.titulo-nav').textContent = "Error cargando configuración";
        });
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
    if (saludoElement) {
        saludoElement.textContent = config.saludo || "Bienvenido";
    }

    const textInput = document.querySelector('.busqueda .text-input');
    const submitBtn = document.querySelector('.busqueda .submit-btn');
    
    if (textInput) textInput.placeholder = config.nombre || "Buscar...";
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
        .then(estudiantes => {
            const lista = document.querySelector('.lista-estudiantes');
            if (lista) {
                estudiantes.forEach(est => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <img src="${est.imagen}" alt="${est.nombre}" class="foto-perfil-grande">
                    <p>${est.nombre}</p>
                    `;
                    lista.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error cargando estudiantes:', error));
}
