# TOKEN RIOT — Android 0.1.15

Este proyecto incluye una app Android basada en Capacitor 8.5.3.

- Juego y música incluidos dentro del APK; no requiere el servidor de la PC.
- Joystick analógico y botones de acción con íconos. El botón >_ abre la consola desde el centro del grupo de acciones. Tocar la pantalla avanza las escenas.
- Android admite un jugador. El cooperativo de dos jugadores está disponible en PC.
- Consola con teclado de Android y selector táctil de modelos. Configuración permite alternar inglés/español.
- Tokens, controles, idioma y progreso de insignias guardados en SQLite privado (`token-riot.db`). Cada partida nueva sigue empezando en cero tokens.
- Learning Centers con práctica continua por dificultad e insignias virtuales por empresa/nivel.
- Modo inmersivo que oculta las barras de estado y navegación y se restablece al volver a la app o cerrar el teclado. Los gestos del sistema pueden mostrarlas temporalmente.
- Funciona sin conexión. La valoración final usa precios verificados incluidos; intenta actualizarlos al terminar si hay conexión.

## Compilar otra vez en Windows

Se requieren Node 22+, JDK 21 y Android SDK (plataforma 36 y build-tools). Configurá JDK y Android SDK en tu entorno; las herramientas locales de desarrollo no se distribuyen.

```powershell
npm ci
npm run android:apk
```

El script compila los recursos, sincroniza Capacitor y genera `dist/TOKEN-RIOT-android-v0.1.15.apk`.

## Instalar

Copiar el APK al teléfono y abrirlo. Android puede solicitar permitir la instalación desde esa aplicación de archivos. Es una compilación de prueba firmada para instalación directa; no es una publicación de Google Play.

## Verificación

Se ejecutan las pruebas del juego y `offline-economy-test.mjs`, que compara el servicio móvil con el de escritorio: cobro individual de proyectiles, curación paga, saldos separados, restauración de la base, idempotencia y manejo de fallos al guardar.

La compilación no incluye `.env.local`, claves, las partidas privadas del escritorio ni el servidor Node. No se ha probado en un teléfono físico conectado.

## Endurecimiento de la beta

La depuración de la aplicación y del WebView está desactivada incluso en la variante de instalación directa. Se bloquea HTTP claro, se mantiene el backup deshabilitado y el FileProvider solo permite el subdirectorio de caché compartida. El APK sigue siendo una beta firmada para instalación directa, no una publicación de producción en Google Play.
