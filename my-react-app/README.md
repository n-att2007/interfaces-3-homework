# Comando de la plataforma si trabajamos con chip M1
docker pull --platform linux/x86_64 ...

# Ejecución del contenedor para solamente el front
docker build -t my-first-container:latest . 
docker run -d -p 3000:80 --name my-app my-first-container