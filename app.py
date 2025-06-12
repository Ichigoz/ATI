from flask import Flask, request, abort, send_file, make_response
import os
import json

app = Flask(__name__)
BASE_PATH = os.path.abspath(os.path.dirname(__file__))
PORT = 8082

def cargar_json(ruta):
    with open(ruta, encoding='utf-8') as f:
        return json.load(f)

@app.route('/inicio')
def pagina_inicio():
    idioma = request.args.get('lan', 'ES').upper()
    if idioma not in ['ES', 'EN', 'PT']:
        idioma = 'ES'

    try:
        config = cargar_json(os.path.join(BASE_PATH, 'conf', f'config{idioma}.json'))
        estudiantes = cargar_json(os.path.join(BASE_PATH, 'datos', 'index.json'))
    except FileNotFoundError as e:
        return f"Archivo no encontrado: {e.filename}", 404
    except Exception as e:
        return f"Error inesperado: {str(e)}", 500

    lista_estudiantes = ""
    for est in estudiantes:
        lista_estudiantes += f"""
        <li onclick="window.location.href='/perfil?ci={est["ci"]}&lan={idioma}'">
            <img class="foto-perfil-grande" src="{est["imagen"]}" alt="Foto de {est["nombre"]}">
            <img class="foto-perfil-pequena" src="{est["imagen"]}" alt="Foto de {est["nombre"]}">
            <p>{est["nombre"]}</p>
        </li>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="{idioma.lower()}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{config['sitio'][0]} {config['sitio'][1]} {config['sitio'][2]}</title>
        <link rel="stylesheet" href="/CSS/style.css">

    </head>
    <body>
    <header>
    <nav>
        <ul class="header-container">
            <!-- Título principal: ATI, UCV, Escuela -->
            <li class="titulo-nav">
                <span class="main-text">{config['sitio'][0]}</span>
                <small class="ucv">{config['sitio'][1]}</small>
                <span class="secondary-text">{config['sitio'][2]}</span>
            </li>

            <!-- Saludo dinámico centrado -->
            <li class="saludo-container">
                <span class="Saludo">{config['saludo']}</span>
            </li>

            <!-- Formulario de búsqueda -->
            <li>
                <form class="busqueda">
                    <input type="text" class="text-input" placeholder="Buscar estudiante...">
                    <input type="submit" class="submit-btn" value="Buscar">
                </form>
            </li>
        </ul>
        </nav>
    </header>

    <section>
    <ul class="lista-estudiantes">
        {lista_estudiantes}
        </ul>
    </section>

    <footer><small>{config['copyRight']}</small></footer>
    </body>
    </html>
    """
    response = make_response(html)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

@app.route('/perfil')
def pagina_perfil():
    ci = request.args.get('ci')
    idioma = request.args.get('lan', 'ES').upper()
    if idioma not in ['ES', 'EN', 'PT']:
        idioma = 'ES'

    if not ci:
        abort(400, description="No se proporcionó el CI del estudiante")

    try:
        config = cargar_json(os.path.join(BASE_PATH, 'conf', f'config{idioma}.json'))
        perfil = cargar_json(os.path.join(BASE_PATH, ci, 'perfil.json'))
    except FileNotFoundError as e:
        abort(404, description=f"No encontrado: {e.filename}")
    except Exception as e:
        abort(500, description=f"Error interno: {str(e)}")

    filas = ""
    campos = [
        ('Color Favorito', config['color'], perfil.get('color', '')),
        ('Libro Favorito', config['libro'], perfil.get('libro', '')),
        ('Géneros Musicales', config['musica'], perfil.get('musica', '')),
        ('Videojuegos', config['video_juego'], perfil.get('video_juego', '')),
        ('Género', config['genero'], perfil.get('genero', '')),
        ('Fecha de Nacimiento', config['fecha_nacimiento'], perfil.get('fecha_nacimiento', '')),
        ('Lenguajes de Programación', config['lenguajes'], ', '.join(perfil.get('lenguajes', []))),
    ]
    
    for label, val_config, val_perf in campos:
        filas += f"""
        <tr>
            <td class="detalle-label">{label}</td>
            <td>{val_perf}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="{idioma.lower()}">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <link rel="icon" href="https://yt3.googleusercontent.com/ytc/AIdro_mfJXBLDGHiFqAZzgqU4yPBHccBAJhGKtM6GhovLnWODg=s900-c-k-c0x00ffffff-no-rj">
        <title>Perfil de {perfil.get('nombre', '')}</title>
       <link rel="stylesheet" href="/CSS/style.css">

    </head>
    <body>
        <div class="contenedor-principal">
            <div class="foto">
                <img src="/{ci}/{ci}.jpg" alt="Foto de {perfil.get('nombre','')}" 
                     onerror="this.onerror=null;this.src='/{ci}/{ci}.png'"/>
            </div>
            <div class="contenedor-perfil">
                <div class="info-perfil">
                    <h1 class="nombre">{perfil.get('nombre', 'Sin nombre')}</h1>
                    <p class="descripcion">{perfil.get('descripcion', '')}</p>
                    
                    <table class="detalle">
                        {filas}
                    </table>
                    
                    <div class="email">
                        <span class="texto-email">Contacto:</span>
                        <a href="mailto:{perfil.get('email','')}" class="correo-link">{perfil.get('email','')}</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    response = make_response(html)
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

@app.route('/<path:recurso>')
def archivos_estaticos(recurso):
    ruta = os.path.join(BASE_PATH, recurso)
    if os.path.isfile(ruta):
        return send_file(ruta)
    else:
        abort(404, description="Archivo no encontrado")

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)