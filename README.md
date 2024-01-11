# Widget Precios de Granos - Bolsa de Comercio de Rosario

## Descripción del Proyecto

Este proyecto presenta un widget que muestra en tiempo real los precios de granos obtenidos a través del protocolo GIX de la Bolsa de Comercio de Rosario. Para utilizarlo, es necesario solicitar un API Key y Secret Token mediante el formulario en [https://api.bcr.com.ar/form](https://api.bcr.com.ar/form). 
Una vez recibidos por correo electrónico, configura estos valores en el archivo `script.js` (renombrado a `script.example.js` sin las credenciales) y el widget estará listo para funcionar.

## Características

- **Datos en Tiempo Real:** El widget utiliza el protocolo GIX de la Bolsa de Comercio de Rosario para obtener y mostrar los precios de granos más recientes.
- **Solicitud de API Key y Secret Token:** Para acceder a la API, se debe solicitar el API Key y Secret Token a través del formulario en [https://api.bcr.com.ar/form](https://api.bcr.com.ar/form).
- **Fácil Implementación:** Diseñado para ser fácilmente integrado en cualquier sitio web. Solo necesitas incluir el código en tu proyecto y configurar las claves de API.

## Cómo Implementar

1. **Solicitar Claves de API:**
   - Ve a [https://api.bcr.com.ar/form](https://api.bcr.com.ar/form) y completa el formulario para obtener tu API Key y Secret Token.
   - Recibirás las claves por correo electrónico.

2. **Renombrar el Archivo `script.example.js`:**
   - Cambia el nombre del archivo `script.example.js` a `script.js` (está de esta forma para evitar la exposición accidental de las credenciales).
  
3. **Configurar Claves de API en `script.js`:**
   - Abre el archivo `script.js` y configura las claves de API y Secret Token que recibiste por correo electrónico (se puede crear un archivo .env para no filtrar las credenciales es el frontend).

4. **¡Listo para Usar!:**
   - Guarda los cambios y carga tu página web. Ahora deberías ver el widget mostrando los precios de granos en tiempo real.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras errores, mejoras o nuevas características que puedan beneficiar al widget, no dudes en abrir un issue o enviar un pull request. Trabajemos juntos para hacer que este widget sea aún más útil y versátil.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE), lo que significa que puedes usar, modificar y distribuir el código según tus necesidades. Agradecemos cualquier atribución que elijas proporcionar.

¡Gracias por utilizar el Widget Precios de Granos - Bolsa de Comercio de Rosario! Esperamos que sea de utilidad para tu proyecto.

Alejo :)
