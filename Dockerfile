# Imagen oficial de Apache
FROM httpd:2.4
WORKDIR /usr/local/apache2/htdocs/

# Copia todos los archivos
COPY ./ ./

# Puerto 80
EXPOSE 80

# Descripcion de los pasos:
# 1. Creamos el archivo Dockerfile en la carpeta con el contenido de la web
# 2. Ubicamos la carpeta en la terminal
# 3. Creamos la imagen (docker build -t mi-web-apache .)
# 4. Ejecutamos un contenedor a partir de la imagen creada anteriormente (mi-web-apache) apuntando al puerto 80 
# (docker run -d -p 8080:80 --name web-apache mi-web-apache)
# 5. Verificamos que se creo en la terminal (docker ps)
# 6. Por ultimo lo cargamos en el navegador (http://localhost:8080)