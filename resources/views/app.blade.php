<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
    <meta name="theme-color" content="#0F172A">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>NativeInvoice</title>
    @filamentStyles
    @vite('resources/css/app.css')
</head>
<body class="antialiased">
    {{ $slot }}
    @filamentScripts
    @vite('resources/js/app.js')
</body>
</html>
