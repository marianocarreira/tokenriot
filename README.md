# TOKEN RIOT

A satirical cyberpunk arcade adventure starring Nano and Pili, with twelve
stages, a virtual-token economy, learning centers and local desktop co-op.
Characters, dialogue and conflicts are fictional and satirical.

- Website: https://www.token-riot.com/
- Browser game: https://www.token-riot.com/play/
- Android: direct APK download from the website; not a Google Play release.
- Website source: https://github.com/marianocarreira/tokenriotwebsite
- Store: https://www.token-riot.store/, a separate proprietary project.
- Sole contact: **contact@token-riot.com**.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173/. The server listens only on loopback. No API key is
required to play. The public model-price catalog can update online; tokens and
their USD conversion are entirely virtual.

## Languages

The game supports English (default), Spanish and Simplified Chinese. Select a
language in Settings; the choice is saved locally. Menus, dialogue, console
messages, original study notes and all provider-specific learning questions are
localized. Console commands, identifiers and proper names are preserved.
The browser edition also inherits the site's language on first use when no
separate game language has been saved. Documentation is English only.

## Android

See [ANDROID.md](ANDROID.md) for requirements and build instructions. Version
0.1.16 includes the three languages, touch controls and local private storage.
Android supports one player; desktop supports local two-player co-op.

## Validation

```sh
npm run check
npm test
npm run test:security
npm run test:mobile
npm audit
```

The tests cover reversible language switching, Chinese text wrapping,
curriculum coverage, gameplay, token accounting, saves and local HTTP security.
The local server and virtual balances must not be used as a real-payment backend.

## Copyright and licensing

Copyright (C) 2026 Mariano Carreira. Original software is licensed under
**GNU GPL version 3 only (GPL-3.0-only)** without warranty. See COPYRIGHT.md,
LICENSE, COPYING and LICENSE-SCOPE.md. Licensing does not transfer ownership.
Covered distributed derivatives must comply with GPLv3, including corresponding
source obligations. Commercial use is allowed. Separate media and third-party
components retain their own rights. Store software is excluded.

The public repository starts from sanitized source and does not include private
development history or captures. See CONTRIBUTING.md, CLA.md and SECURITY.md.

## Book and comic

These are separate products in the proprietary Store:

- [Book: the making of TOKEN RIOT (register interest)](https://www.token-riot.store/?product=14-libro-filosofia-0&lang=en).
- [Comic: view available PDF editions](https://www.token-riot.store/?product=15-comic-0&lang=en).

Choose the publication language separately from the interface language. The
website passes its selected language to the Store; unavailable editions cannot
be ordered. A preorder interest registration does not charge the visitor.
