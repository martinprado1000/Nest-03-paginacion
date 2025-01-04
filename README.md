<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Stack usado

*Nest

*Mongo


# Ejecutar en desarrollo
1. Clonar el repositorio

2. Tener Nest CLI instalado:
```
npm i -g @nest/cli
```

3. Levantar la base de datos
```
docker-compose up -d
```

# Load user superadmin

```
http://localhost:3000/seed
```

# Construir y ejecutar para producción
```bash
# Construir
$ npm run build

# Ejecutar
$ npm run start:prod
```

### Si no levanto la base de datos de docker-compose lo puedo levantar de forma local.


