# Backend games

Comandos de interés en Nest:

- Crear nuevo módulo: `nest g module <nombre-del-modulo>`
    - Ejemplo: `nest g module auth`
    - Ejemplo: `nest g module auth/user`

- Crear nuevo service: `nest g service <nombre-del-service>`
    - Ejemplo: `nest g service auth/services/user`
    - Ejemplo: `nest g service auth/services/role`
    - Ejemplo: `nest g service auth/services/auth`
    - Ejemplo: `nest g service auth/services/auth --no-spec` (para no generar el archivo de pruebas)
    - Ejemplo: `nest g service auth/services/*`

- Crear nuevo controller: `nest g controller <nombre-del-controller>`