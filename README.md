# TOKEN RIOT

Arcade cyberpunk satírico protagonizado por Nano y Pili, con campaña por doce
escenarios, economía de tokens virtuales, aprendizaje y cooperativo local en PC.
Las personas, diálogos y conflictos son representaciones ficticias y satíricas.

- Sitio y juego web: https://www.token-riot.com/ y https://www.token-riot.com/play/.
- Android: descarga directa de APK desde el sitio. No es una publicación de Google Play.
- Sitio de presentación: repositorio separado `marianocarreira/tokenriotwebsite`.
- Store: https://www.token-riot.store/, proyecto y repositorio propietarios separados.
- Único contacto: **contact@token-riot.com**.

## Ejecutar localmente

Requiere Node.js 22 o posterior.

```sh
npm ci
npm start
```

Abrí http://127.0.0.1:4173/. El servidor escucha solamente en loopback.
No requiere una clave de API para jugar. El catálogo público de precios puede
actualizarse por internet; los tokens y su conversión son virtuales.
Controles, idioma y dificultad se muestran en el juego.

## Android

Consultá [ANDROID.md](ANDROID.md) para requisitos, compilación e instalación.
El APK incluye juego y audio, usa almacenamiento privado local y permite un jugador.
El cooperativo de dos jugadores está disponible en PC.

## Verificación

```sh
npm run check
npm test
npm run test:security
npm audit
```

Consultá [SECURITY.md](SECURITY.md) para reportar problemas de seguridad.
El servidor local y el saldo virtual no deben usarse como backend de pagos reales.

## Copyright y licencia

Copyright (C) 2026 Mariano Carreira.

El código original se distribuye bajo **GNU GPL versión 3 exclusivamente**
(`GPL-3.0-only`), sin garantías. Véanse [COPYRIGHT.md](COPYRIGHT.md) y el texto
íntegro en [COPYING](COPYING). La licencia concede permisos y no transfiere
la titularidad del copyright.

Al distribuir derivados cubiertos deben respetarse las condiciones de GPLv3,
incluida la entrega del código fuente correspondiente. GPLv3 permite vender copias.
Los recursos no software y el material de terceros tienen un alcance separado:
[LICENSE-SCOPE.md](LICENSE-SCOPE.md). La store no está incluida en esta licencia.

El código del juego y del sitio se publica en repositorios independientes con
historial saneado. La store permanece privada y propietaria.

## Colaboración y seguridad

Consultá [CONTRIBUTING.md](CONTRIBUTING.md), el borrador [CLA.md](CLA.md) y
[SECURITY.md](SECURITY.md). Reportá vulnerabilidades de forma privada a
contact@token-riot.com.

El historial interno y las capturas de desarrollo no se incluyen en esta publicación.
