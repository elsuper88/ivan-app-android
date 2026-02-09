# Errores y Soluciones: NativePHP + Filament v4 Android

> Ultima actualizacion: 2026-02-09

---

## 1. MethodNotAllowedHttpException al renderizar sidebar Filament

### Error
```
Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException
The GET method is not supported for route livewire/update. Supported methods: POST.
```

### Causa raiz
NativePHP Android WebView envia headers `X-Livewire`, `X-Inertia`, etc. con **valores vacios** en cada request de navegacion. Livewire verifica solo existencia del header (`request()->hasHeader('X-Livewire')` en `HandleRequests.php:97`), no su valor. Resultado: `isLivewireRequest()` retorna TRUE para requests normales, disparando `PersistentMiddleware::makeFakeRequest()` con `path=null`, `method=null` (primer render sin snapshot).

### Cadena de fallo
1. `isLivewireRequest()` = TRUE (header existe aunque vacio)
2. `SupportServiceProvider.php:129` llama `PersistentMiddleware::makeFakeRequest()`
3. `$this->path` = null, `$this->method` = null
4. `makeFakeRequest()` crea request con `REQUEST_METHOD = null` para ruta `/`
5. `ParameterBag::get('REQUEST_METHOD', 'GET')` retorna null (key existe con valor null)
6. `strtoupper(null)` = `""`
7. Route matching falla

### Solucion
Middleware `NormalizeHttpMethod` elimina headers fantasma vacios en requests de navegacion (GET). Ver archivo `app/Http/Middleware/NormalizeHttpMethod.php`.

---

## 2. Login/Save se congela (Livewire AJAX no completa)

### Error
Al hacer login o crear un cliente, el boton de submit queda cargando indefinidamente. La operacion SI se ejecuta en el servidor, pero la UI no responde.

### Causa raiz
El middleware eliminaba el header `X-Livewire` de TODOS los requests, incluyendo requests AJAX reales de Livewire (POST a `/livewire/update`). Sin el header:

1. `isLivewireRequest()` retorna FALSE
2. `SupportRedirects.php:58` hace `abort(redirect($to))` — redirect HTTP completo
3. Livewire JS espera respuesta JSON, recibe redirect HTTP — se congela
4. `HandleRequests.php:74-80` no salta `TrimStrings`/`ConvertEmptyStringsToNull`, corrompiendo el payload JSON

### Solucion
El middleware ahora detecta requests Livewire reales (POST a `/livewire/update`) y restaura `X-Livewire: "true"` en vez de eliminarlo.

```php
$isLivewireUpdate = $request->isMethod('POST')
    && str_contains($request->getRequestUri() ?? '', '/livewire/update');

if ($isLivewireUpdate) {
    $request->headers->set('X-Livewire', 'true');
} else {
    // Eliminar phantom headers vacios solo en navegacion
}
```

---

## 3. RootTagMissingFromViewException al borrar registros

### Error
```
Livewire\Exceptions\RootTagMissingFromViewException
Livewire encountered a missing root tag when trying to render a component.
```

### Causa raiz
Misma causa que #2. Sin el header `X-Livewire`, Livewire no identifica el request como AJAX. El redirect post-delete se ejecuta como HTTP abort, generando respuesta sin HTML valido. `Utils::insertAttributesIntoHtmlRoot()` no encuentra root tag en HTML vacio.

### Solucion
Misma solucion que #2 — restaurar `X-Livewire: "true"` en requests POST a `/livewire/update`.

---

## 4. REQUEST_METHOD vacio

### Error
PHP recibe `REQUEST_METHOD = ""` o `null` porque `php_bridge.c` de NativePHP ejecuta `setenv("REQUEST_METHOD", "", 1)`.

### Solucion (dos capas)

**Capa 1 — bootstrap/app.php** (antes de `Application::configure()`):
```php
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] === '') {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}
```

**Capa 2 — Middleware** normaliza `$_SERVER`, `$request->server` y `$request->setMethod()`.

---

## 5. RuntimeException: Extension "intl" requerida

### Error
```
RuntimeException: The "intl" PHP extension is required to use the [format] method.
```

### Causa raiz
NativePHP embebe PHP sin extension `intl` por defecto. Filament usa `Number::format()` y `Number::currency()` extensivamente.

### Solucion
Instalar NativePHP con binarios ICU:
```bash
php artisan native:install --with-icu --force
```
Esto descarga `jniLibsF.zip` (~30MB extra) con ICU habilitado y crea flag `nativephp/android/.icu-enabled`.

**IMPORTANTE:** Despues de `native:install --force`, re-aplicar:
- `org.gradle.java.home` en `gradle.properties`
- Signing config en `gradle.properties`

---

## 6. Seeder no ejecuta en dispositivo

### Error
El usuario admin no existe al instalar la app en el dispositivo.

### Causa raiz
NativePHP solo ejecuta `migrate --force` al iniciar la app (`LaravelEnvironment.kt:696`). No ejecuta `db:seed`.

### Solucion
Crear migraciones dedicadas para seed data:
```php
// database/migrations/2026_02_09_203907_seed_default_admin_user.php
DB::table('users')->insertOrIgnore([
    'name' => 'Admin',
    'email' => 'admin@admin.com',
    'password' => Hash::make('password'),
    // ...
]);
```

---

## 7. Gradle requiere JDK 17

### Error
```
Dependency requires at least JVM runtime version 11
```

### Causa raiz
macOS tiene Java 8 por defecto. Gradle/Android build requiere JDK 17.

### Solucion
Agregar en `nativephp/android/gradle.properties`:
```
org.gradle.java.home=/opt/homebrew/Cellar/openjdk@17/17.0.18/libexec/openjdk.jdk/Contents/Home
```

---

## 8. Carga inicial lenta (primera apertura)

### Comportamiento
La app se queda cargando en la primera apertura. Al cerrar y reabrir, funciona.

### Causa raiz
Comportamiento NORMAL de NativePHP. En el primer inicio, `LaravelEnvironment.kt` ejecuta:
1. `extractLaravelBundle()` — descomprime ZIP
2. `optimize:clear` — limpia caches
3. `storage:link` — crea symlinks
4. `migrate --force` — ejecuta TODAS las migraciones

### No requiere fix
Es un proceso de inicializacion unico. Subsequentes aperturas son rapidas.

---

## Arquitectura de la solucion

```
bootstrap/app.php          → Fix global $_SERVER['REQUEST_METHOD']
                               ↓
NormalizeHttpMethod.php    → Detecta tipo de request:
  ├─ POST /livewire/update → Restaura X-Livewire: "true"
  └─ Navegacion (GET)      → Elimina phantom headers vacios
                               ↓
native:install --with-icu  → PHP con extension intl
                               ↓
Migraciones para seed data → NativePHP solo ejecuta migrate
```
