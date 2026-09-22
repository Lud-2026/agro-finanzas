# AGRO FINANZAS

Aplicación para organizar y analizar las finanzas de proyectos productivos rurales. Funciona como Progressive Web App (PWA): instalable y con soporte básico sin conexión.

## 1. Ejecutar localmente

Los Service Workers no funcionan abriendo `index.html` con doble clic (`file://`). Sirve la carpeta con un servidor local, por ejemplo:

```bash
# con Python
python -m http.server 8000

# o con la extensión "Live Server" de VS Code
```

Luego abre `http://localhost:8000` en Chrome.

## 2. Probar el Service Worker

1. Abre la app en `http://localhost:8000`.
2. Abre DevTools → pestaña **Application** → **Service Workers**. Debe aparecer `service-worker.js` como "activated and running".
3. En la consola deberías ver el mensaje `Service Worker registrado: ...`.

## 3. Probar el funcionamiento sin conexión

1. Con la app ya cargada una vez (para que se cacheen los archivos), ve a DevTools → pestaña **Network** → marca **Offline** (o desactiva el wifi).
2. Recarga la página: debe seguir mostrando la interfaz y tus proyectos guardados.
3. Nota: exportar a PDF usa una librería externa (jsPDF) que se descarga de un CDN; solo estará disponible sin conexión si ya la usaste una vez estando en línea (el Service Worker la guarda en caché después del primer uso).

## 4. Instalar la PWA desde Chrome

- **Escritorio:** con la app abierta, haz clic en el ícono de instalación en la barra de direcciones (o menú ⋮ → "Instalar AGRO FINANZAS").
- **Android:** menú ⋮ → "Agregar a pantalla de inicio" / "Instalar app".

## 5. Despliegue con HTTPS

El registro del Service Worker requiere un contexto seguro: HTTPS en producción, o `http://localhost` para pruebas locales (Chrome lo permite como excepción de desarrollo).

HTTPS depende del servicio de alojamiento, no del código. Opciones sencillas y gratuitas:

- **GitHub Pages:** sube la carpeta a un repositorio y activa Pages en la configuración del repositorio.
- **Netlify** o **Vercel:** arrastra la carpeta del proyecto a su panel, o conecta el repositorio; ambos sirven el sitio con HTTPS automáticamente.

No se necesita configuración adicional en el código: basta con subir los archivos tal como están.

## 6. Datos guardados en el dispositivo

Los proyectos, movimientos y categorías se guardan con `localStorage`, únicamente en el navegador y dispositivo donde se use la app. Todavía no hay sincronización entre dispositivos ni cuentas de usuario: si cambias de navegador o de equipo, no verás los mismos datos.

## 7. Actualizar la versión de la caché

Cuando cambies `index.html`, `manifest.json` o los íconos, sube el nombre de la caché en `service-worker.js`:

```js
const CACHE_NAME = 'agro-finanzas-v1'; // cámbialo, por ejemplo, a 'agro-finanzas-v2'
```

Así, la próxima vez que se active el Service Worker, borrará la caché anterior y guardará los archivos actualizados.

## 8. Limitaciones actuales

- Los datos viven solo en `localStorage` de un dispositivo/navegador; no hay respaldo en la nube ni sincronización.
- Exportar a PDF depende de una librería externa (CDN); requiere haberla usado antes en línea para funcionar sin conexión.
- No incluye créditos, pagos, bancos, IA, ni integración con precios de mercado (fuera del alcance de este MVP).
