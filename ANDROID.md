# TOKEN RIOT — Android 0.1.16

The Android application uses Capacitor 8.5.3 and includes the game and audio.
It runs without the desktop server. English is the default; Spanish and
Simplified Chinese can be selected in Settings and are remembered locally.

- Single-player touch joystick, action buttons and touch-to-advance scenes.
- The terminal button opens the console with the Android keyboard.
- Private SQLite storage keeps controls, language, saves and learning progress.
- Each new campaign starts with zero virtual tokens.
- Offline play is supported. Final valuation uses included verified prices and
  attempts an online refresh when a connection is available.

## Build on Windows

Install Node.js 22+, JDK 21 and Android SDK platform 36 with build tools.
Set JAVA_HOME and ANDROID_HOME for your installation. Local portable tooling,
credentials and signing keys are not distributed with the repository.

```powershell
npm ci
npm run android:apk
```

The build script bundles resources, synchronizes Capacitor and builds
`dist/TOKEN-RIOT-android-v0.1.16.apk`.

## Install and verify

Copy the APK to the phone and open it. Android may require allowing installation
from the file manager. This is a directly installed beta, not a Google Play
release. No physical Android device was connected for this build's verification.

Run `npm run test:mobile` and `npm test`. Tests cover save persistence, input,
token accounting, offline parity and all three language catalogs.

App and WebView debugging are disabled, cleartext HTTP and backup are disabled,
and FileProvider is restricted to the shared cache subdirectory. The package
does not include the Node server, API keys, private desktop saves or local tools.
