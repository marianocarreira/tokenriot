# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot
$portableNode=Get-ChildItem -Path '.android-tools/node-v22*/node.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
$taskNode=if($portableNode){$portableNode.FullName}else{(Get-Command node).Source}
$version=& $taskNode -p 'parseInt(process.versions.node)'
if([int]$version -lt 22){throw 'Android packaging requires Node 22 or newer.'}
$portableJdk=Get-ChildItem -LiteralPath '.android-tools' -Directory -ErrorAction SilentlyContinue | Where-Object Name -Like 'jdk-*' | Select-Object -First 1
if($portableJdk){$env:JAVA_HOME=$portableJdk.FullName}
if(-not $env:ANDROID_HOME){$env:ANDROID_HOME=Join-Path $taskRoot '.android-tools/sdk'}
if(-not (Test-Path -LiteralPath (Join-Path $env:ANDROID_HOME 'platforms/android-36/android.jar'))){throw 'Install Android SDK platform 36 first.'}
if(-not $env:GRADLE_USER_HOME){$env:GRADLE_USER_HOME=Join-Path $taskRoot '.android-tools/gradle-cache'}
[IO.File]::WriteAllText((Join-Path $taskRoot 'android/local.properties'),'sdk.dir='+$env:ANDROID_HOME.Replace('\','/')+"`n")
& $taskNode scripts/build-mobile.mjs
if($LASTEXITCODE -ne 0){throw 'Web bundle build failed.'}
& $taskNode node_modules/@capacitor/cli/bin/capacitor sync android
if($LASTEXITCODE -ne 0){throw 'Android sync failed.'}
& ./android/gradlew.bat -p android assembleDebug --no-daemon --console=plain
if($LASTEXITCODE -ne 0){throw 'APK compilation failed.'}
New-Item -ItemType Directory -Force -Path dist | Out-Null
Copy-Item -LiteralPath android/app/build/outputs/apk/debug/app-debug.apk -Destination dist/TOKEN-RIOT-android-v0.1.16.apk -Force
Write-Host 'APK: dist/TOKEN-RIOT-android-v0.1.16.apk'
