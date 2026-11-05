# GeoPunto GPS

Aplicación de ejemplo hecha con Ionic, Angular y Capacitor. Solicita permiso de ubicación cuando se pulsa el botón, obtiene la posición actual del teléfono y muestra latitud, longitud, precisión estimada y hora de lectura. La ubicación no se consulta en segundo plano ni se guarda.

## Tecnologías

- Ionic Angular 9
- Angular 22
- Capacitor 8.6.0
- Plugin oficial `@capacitor/geolocation` 8.2.4
- Android Studio y Android SDK para compilar la aplicación nativa

## Cómo funciona

La pantalla inicial presenta el propósito de la app y el botón **Obtener ubicación**. La página comprueba los permisos de ubicación y solicita autorización cuando todavía no se concedió. Después llama a `Geolocation.getCurrentPosition()` en modo de alta precisión y muestra los datos devueltos por el dispositivo. El mismo botón permite actualizar la lectura.

La interfaz distingue estados de espera, éxito y error. Traduce los errores nativos más comunes a mensajes para permisos denegados, servicios de ubicación desactivados y tiempo de espera agotado.

La ubicación se maneja únicamente en el dispositivo durante la consulta. No se envía a un servidor.

## Permisos Android

El manifiesto declara `ACCESS_COARSE_LOCATION` y `ACCESS_FINE_LOCATION` para permitir la ubicación aproximada o precisa, además de una característica GPS opcional. La app solicita el permiso mientras está en uso; no necesita permiso de ubicación en segundo plano.

## Requisitos

- Node.js 22 o posterior y npm.
- Android Studio con Android SDK y Platform-Tools (ADB).
- Teléfono Android con Ubicación/GPS activada para probar en hardware real.

## Instalar dependencias y ejecutar en navegador

Desde la carpeta del proyecto:

```powershell
$npm = 'C:\Program Files\nodejs\npm.cmd'
& $npm install
& $npm start
```

La geolocalización del navegador requiere permiso de ubicación y un contexto seguro (`localhost` cumple ese requisito). La validación principal de la actividad debe realizarse en Android nativo.

## Generar el APK de Android

El JDK incluido en Android Studio es Java 25, mientras que el wrapper Gradle 8.14.3 de esta plataforma necesita un JDK compatible hasta Java 24. Para que la compilación funcione sin cambiar el Java global del equipo, este entorno tiene Temurin JDK 21.0.12.1 extraído localmente en `.tools` (ignorado por Git). Si clonas el repositorio en otro equipo, instala un JDK 21 y ajusta la ruta de `JAVA_HOME`.

```powershell
$env:JAVA_HOME = (Join-Path (Get-Location) '.tools\jdk21\jdk-21.0.12.1+1')
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
& 'C:\Program Files\nodejs\npm.cmd' run build
& '.\node_modules\.bin\cap.cmd' sync android
cd android
.\gradlew.bat assembleDebug
```

El APK de depuración se genera en:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Para instalarlo en un teléfono conectado y autorizado por ADB:

```powershell
adb devices
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
```

También puede compilarse e instalarse directamente con `..\node_modules\.bin\cap.cmd run android` desde la carpeta `android`, después de sincronizar el proyecto.

## Demostración en un teléfono

1. Activa **Opciones de desarrollador** y **Depuración USB** en el teléfono.
2. Conéctalo al equipo y acepta el diálogo de autorización de depuración.
3. Confirma que `adb devices` indique el dispositivo como `device`.
4. Instala y abre GeoPunto GPS.
5. Pulsa **Obtener ubicación** y concede el permiso preciso o aproximado solicitado.
6. Comprueba las coordenadas, la precisión y la hora; pulsa **Actualizar ubicación** para hacer una nueva lectura.
7. Para demostrar errores, puede denegarse el permiso o desactivarse Ubicación/GPS y volver a consultar.

## Diagnóstico

Para ver mensajes de Android durante una demostración:

```powershell
adb logcat
```

Si Gradle indica que no encuentra el SDK, verifica `ANDROID_HOME` y la ubicación del SDK configuradas en Android Studio. Si no se obtiene posición, habilita Ubicación/GPS y prueba al aire libre o cerca de una ventana.

## Plugin

Documentación oficial: https://capacitorjs.com/docs/apis/geolocation
