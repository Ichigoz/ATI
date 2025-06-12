FROM python:3.9-slim
WORKDIR /app
RUN pip install flask

COPY CSS/ ./CSS/
COPY conf/ ./conf/
COPY app.py ./app.py
COPY datos/ ./datos/
COPY 13852255/ ./13852255/
COPY 14444733/ ./14444733/
COPY 18002106/ ./18002106/
COPY 18009154/ ./18009154/
COPY 18110561/ ./18110561/
COPY 18443368/ ./18443368/
COPY 18487832/ ./18487832/
COPY 18819509/ ./18819509/
COPY 18829705/ ./18829705/
COPY 18836874/ ./18836874/
COPY 18938455/ ./18938455/
COPY 19267152/ ./19267152/
COPY 19334139/ ./19334139/
COPY 19371273/ ./19371273/
COPY 19379860/ ./19379860/
COPY 19499302/ ./19499302/
COPY 19558625/ ./19558625/
COPY 19932730/ ./19932730/
COPY 20117857/ ./20117857/
COPY 28309145/ ./28309145/

EXPOSE 8082
CMD ["python", "./app.py"]

# Comandos necesarios en el shell para implementar el contenedor:
# primero entraremos en la carpeta donde se encuentra nuestro proyecto para ejecutar los siguientes comandos:
# docker rm -f flask-contenedor 
# docker build -t contenedorestudiantex .
# docker run -d -p 8082:5000 --name flask-contenedor contenedorestudiantex
# Una vez que el contenedor se haya creado, podemos acceder al url
# Link del index: http://localhost:8082/inicio?
# Link de un perfil especifico: http://localhost:8082/perfil?ci=28309145&lan=ES