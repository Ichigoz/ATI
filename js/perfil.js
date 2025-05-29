document.addEventListener('DOMContentLoaded', () => {
    const elementos = {
        nombre: document.querySelector('.nombre'),
        descripcion: document.querySelector('.descripcion'),
        emailTexto: document.querySelector('.texto-email'),
        emailLink: document.querySelector('.correo-link'),
        foto: document.querySelector('.foto'),
        filasDetalle: document.querySelectorAll('.detalle tr')
    };

    function mostrarCargando() {
        elementos.nombre.textContent = 'Cargando perfil...';
    }

    function mostrarError(mensaje) {
        elementos.nombre.textContent = 'Error';
        elementos.descripcion.textContent = mensaje;
    }

    const params = new URLSearchParams(window.location.search);
    const ci = params.get('ci');
    const lang = params.get('lang') || 'ES';
    const rutaConfig = `conf/config${lang.toUpperCase()}.json`;

    if (!ci) {
        mostrarError('No se proporcionó CI en la URL');
        return;
    }

    mostrarCargando();
    Promise.all([
        fetch(rutaConfig).then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la configuración');
            return response.json();
        }),
        fetch(`${ci}/perfil.json`).then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el perfil');
            return response.json();
        })
    ])
    .then(([config, perfil]) => {
        actualizarPerfil(config, perfil, ci);
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError(error.message);
    });

    function actualizarPerfil(config, perfil, ci) {
        elementos.nombre.textContent = perfil.nombre;
        document.title = perfil.nombre;
        elementos.descripcion.textContent = perfil.descripcion;

        elementos.emailTexto.textContent = config.email;
        elementos.emailLink.href = `mailto:${perfil.email}`;
        elementos.emailLink.textContent = perfil.email;

        const img = new Image();
        img.src = `${ci}/${ci}.jpg`;
        img.onload = () => {
            elementos.foto.style.backgroundImage = `url('${ci}/${ci}.jpg')`;
        };
        img.onerror = () => {
            console.warn('No se pudo cargar la imagen del perfil');
        };

        if (elementos.filasDetalle.length >= 7) {
            const detalles = [
                { label: config.genero, value: perfil.genero },
                { label: config.fecha_nacimiento, value: perfil.fecha_nacimiento },
                { label: config.color, value: perfil.color },
                { label: config.libro, value: perfil.libro.join(', ') },
                { label: config.musica, value: perfil.musica.join(', ') },
                { label: config.video_juego, value: perfil.video_juego.join(', ') },
                { label: config.lenguajes, value: perfil.lenguajes.join(', ') }
            ];

            detalles.forEach((detalle, index) => {
                const fila = elementos.filasDetalle[index];
                if (fila) {
                    const labelCell = fila.querySelector('.detalle-label') || fila.cells[0];
                    if (labelCell) {
                        labelCell.textContent = detalle.label;
                    }

                    const valueCell = fila.cells[1];
                    if (valueCell) {
                        if (index === 6) {
                            valueCell.innerHTML = `<strong>${detalle.value}</strong>`;
                        } else {
                            valueCell.textContent = detalle.value;
                        }
                    }
                }
            });
        }
    }
});