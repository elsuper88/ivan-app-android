# NativePHP + Filament Project Notes

## NativePHP Android: Headers fantasma y REQUEST_METHOD vacío (fix de tres capas)

### Causa raíz REAL: Headers fantasma vacíos

La WebView Android de NativePHP envía headers `X-Livewire`, `X-Inertia`, etc. con **valores vacíos** en CADA request de navegación normal. Livewire verifica solo si el header EXISTE (`request()->hasHeader('X-Livewire')` en `HandleRequests.php:97`), no su valor. Resultado: `isLivewireRequest()` retorna TRUE para requests normales, lo que dispara `PersistentMiddleware::makeFakeRequest()` con `path=null`, `method=null` (primer render sin snapshot) → `MethodNotAllowedHttpException`.

### Capa 1: Middleware con detección inteligente de requests (FIX PRINCIPAL)
`NormalizeHttpMethod` distingue entre dos escenarios:
- **Navegación normal (GET):** Elimina headers fantasma vacíos (`X-Livewire: ""`) para que `isLivewireRequest()` retorne FALSE y PersistentMiddleware no crashee.
- **Livewire AJAX real (POST a `/livewire/update`):** Restaura `X-Livewire: "true"` para que Livewire funcione correctamente (skip TrimStrings/ConvertEmptyStringsToNull, respuestas JSON en vez de HTTP redirects, rendering correcto de partials).

**CRÍTICO:** Sin esta distinción, crear/borrar/editar registros se congela porque `SupportRedirects.php:58` hace `abort(redirect())` cuando `isLivewireRequest()` es FALSE, y Livewire JS espera JSON.

### Capa 2: Fix global en `bootstrap/app.php`
Al inicio del archivo, ANTES de `Application::configure()`:
```php
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] === '') {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}
```
Corre antes de `Request::capture()` en `native.php:74`.

### Capa 3: Middleware normaliza REQUEST_METHOD vacío
Registrado con `prepend()` en `bootstrap/app.php`. Fija `$_SERVER`, `$request->server` y `$request->setMethod()` simultáneamente.

**Siempre mantener LAS TRES capas.**

## NativePHP Android: Seeding de datos

NativePHP **NO ejecuta `db:seed`** en el dispositivo. Solo ejecuta `migrate --force` al iniciar la app (`LaravelEnvironment.kt:696`).

**Para seed data, usar migraciones dedicadas** (documentación oficial: https://nativephp.com/docs/mobile/2/concepts/databases).

Ejemplo: `database/migrations/2026_02_09_203907_seed_default_admin_user.php` inserta el usuario admin por defecto via `DB::table('users')->insertOrIgnore(...)`.

Usar `insertOrIgnore` para evitar duplicados en reinstalaciones o actualizaciones.

## NativePHP Android: Build APK con JDK 17

El sistema tiene Java 8 por defecto. Gradle requiere JDK 17.

**Solución:** Agregar `org.gradle.java.home` en `nativephp/android/gradle.properties`:
```
org.gradle.java.home=/opt/homebrew/Cellar/openjdk@17/17.0.18/libexec/openjdk.jdk/Contents/Home
```

`native:run` no propaga `NATIVEPHP_GRADLE_PATH` correctamente como `JAVA_HOME` a Gradle, por lo que esta propiedad es necesaria.

## NativePHP Android: Extensión intl (ICU) requerida por Filament

Filament requiere la extensión PHP `intl` para `Number::format()`, `Number::currency()`, etc. NativePHP ofrece binarios PHP con ICU habilitado.

**Solución:** Instalar con `php artisan native:install --with-icu --force`. Esto descarga `jniLibsF.zip` (binarios con ICU, ~30MB extra) y crea flag `nativephp/android/.icu-enabled`.

**IMPORTANTE:** Después de cada `native:install --force`, verificar que:
1. Existe `nativephp/android/.icu-enabled`
2. Se re-aplica `org.gradle.java.home` en `gradle.properties` (se pierde con `--force`)
3. Se re-aplica signing config en `gradle.properties` y `build.gradle.kts`

## NativePHP Android: Carga inicial lenta (primera apertura)

Comportamiento NORMAL de NativePHP. En el primer inicio, `LaravelEnvironment.kt` ejecuta: `extractLaravelBundle()` → `optimize:clear` → `storage:link` → `migrate --force`. Esto toma tiempo. Al cerrar y reabrir, todo ya está inicializado. No requiere fix.

## Credenciales de Login (dev)

- Email: admin@admin.com
- Password: password

## Build Commands

```bash
# Regenerar bundle Laravel + placeholders Android
php artisan native:run android --build=release --no-tty --no-interaction

# Si Gradle falla por JDK, ejecutar directamente:
cd nativephp/android && ./gradlew clean assembleRelease

# APK output:
# nativephp/android/app/build/outputs/apk/release/app-release.apk
```

## App Identity

- APP_NAME: FilamentApp
- NATIVEPHP_APP_ID: com.example.filamentapp
- Keystore: credentials/filamentapp-keystore.jks (alias: filamentapp)
