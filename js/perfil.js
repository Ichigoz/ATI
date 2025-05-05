document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get('ci');
    const lang = params.get('lang') || 'ES';

    const rutaConfig = `conf/config${lang.toUpperCase()}.json`;

    fetch(rutaConfig)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el archivo de configuración');
            return response.json();
        })
        .then(config => {
            if (!ci) throw new Error('No se proporcionó CI en la URL');
            cargarPerfil(ci, config);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function cargarPerfil(ci, config) {
    fetch(`${ci}/perfil.json`)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el perfil');
            return response.json();
        })
        .then(perfil => {
            document.title = perfil.nombre;
            document.querySelector('.nombre').textContent = perfil.nombre;
            document.querySelector('.descripcion').textContent = perfil.descripcion;

            document.querySelector('.email').innerHTML = `${config.email} 
                <a href="mailto:${perfil.email}" class="correo-link">${perfil.email}</a>`;

            document.querySelector('.foto').style.backgroundImage = `url('${ci}/${ci}.jpg')`;

            const filas = document.querySelectorAll('.detalle tr');
            if (filas.length >= 5) {
                filas[0].children[0].textContent = config.color;
                filas[0].children[1].textContent = perfil.color;

                filas[1].children[0].textContent = config.libro;
                filas[1].children[1].textContent = perfil.libro.join(', ');

                filas[2].children[0].textContent = config.musica;
                filas[2].children[1].textContent = perfil.musica.join(', ');

                filas[3].children[0].textContent = config.video_juego;
                filas[3].children[1].textContent = perfil.video_juego.join(', ');

                filas[4].children[0].innerHTML = `<strong>${config.lenguajes}</strong>`;
                filas[4].children[1].innerHTML = perfil.lenguajes.map(l => `<strong>${l}</strong>`).join(', ');
            }
        })
        .catch(error => console.error('Error al mostrar perfil:', error));
}