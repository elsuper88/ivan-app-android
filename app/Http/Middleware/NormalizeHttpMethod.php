<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NormalizeHttpMethod
{
    public function handle(Request $request, Closure $next): Response
    {
        $method = $request->server->get('REQUEST_METHOD', '');

        if ($method === '' || $method === null) {
            $uri = $request->getRequestUri() ?? '/';
            $hasLivewireHeader = $request->hasHeader('X-Livewire');

            if (str_contains($uri, '/livewire/update') && $hasLivewireHeader) {
                $request->server->set('REQUEST_METHOD', 'POST');
                $request->setMethod('POST');
            } else {
                $request->server->set('REQUEST_METHOD', 'GET');
                $request->setMethod('GET');
            }
        }

        return $next($request);
    }
}
