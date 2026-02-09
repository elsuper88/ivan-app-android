<?php

// NativePHP Android WebView sends empty REQUEST_METHOD via php_bridge.c.
// Fix globally BEFORE Request::capture() reads $_SERVER in native.php.
// This must run here (bootstrap/app.php) because native.php calls this file
// at line 27, then calls Request::capture() at line 74.
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] === '') {
    $_SERVER['REQUEST_METHOD'] = 'GET';
}

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(\App\Http\Middleware\NormalizeHttpMethod::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
