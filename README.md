# JAD

Diany Enamorado 

angel

Jhair Rios
Buenas

## Despliegue en hosting (Linux/cPanel/AES)

- Ubicación de archivos: sube el contenido del proyecto manteniendo la misma estructura de carpetas. Coloca `index.html` en la carpeta pública del hosting (por ejemplo `public_html`, `wwwroot` o la raíz del dominio/subdominio).
- Carpetas obligatorias: `CSS/`, `JS/`, `json/`, `images/`, `iconos/`, `imagenesCarrucel/`. Sin ellas, habrá 404 en recursos.
- Sensibilidad a mayúsculas: en Linux el sistema distingue mayúsculas/minúsculas. La carpeta se llama `CSS` (no `css`) y las rutas deben coincidir exactamente.
- Separador de rutas: usa `/` (barra normal). Se corrigieron imágenes del carrusel que usaban `\`.
- JSON y SVG: asegúrate que el hosting sirve `.json` y `.svg`. Si tu hosting no lo hace, agrega un `.htaccess` con:

```
AddType application/json .json
AddType image/svg+xml .svg .svgz
```

- Subcarpeta: si publicas en `tudominio.com/tienda/`, las rutas relativas del proyecto funcionan tal cual, no necesitas cambiar nada.
- JS faltante: se eliminó la referencia a `JS/AgregarProducto.js` porque no existe en el repo. Si quieres esa función, crea `JS/AgregarProducto.js` y enlázalo de nuevo en `index.html`.

### Comprobaciones rápidas

- Estilos no cargan: verifica que `CSS/bootstrap-3.4.1-dist/` y `CSS/fontawesome/` estén subidos y las rutas en `index.html` apunten a `CSS/...` (con mayúsculas).
- Carrusel sin imágenes: confirma que `imagenesCarrucel/` está subida y que las rutas usan `/` (no `\`).
- Productos no aparecen: revisa en consola si hay 404 a `json/diccionario.json`. Debe existir en `json/` y el servidor debe permitir servir JSON.
- Íconos FontAwesome: valida que `CSS/fontawesome/webfonts/` esté subido; de lo contrario los íconos no se ven.

### Cómo probar

1) Sube todos los archivos al hosting en la carpeta pública.
2) Abre la URL del sitio y presiona F12 → Consola para ver si hay 404/errores.
3) Si hay errores por rutas, compáralas con la estructura del proyecto y corrige mayúsculas y `/`.