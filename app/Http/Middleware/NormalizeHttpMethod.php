<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NormalizeHttpMethod
{
    private const VALID_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    private const PHANTOM_HEADERS = [
        'X-Livewire',
        'X-Inertia',
        'X-Inertia-Version',
        'X-Inertia-Partial-Data',
        'X-Inertia-Partial-Component',
        'X-Inertia-Partial-Except',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // NativePHP Android WebView sends X-Livewire, X-Inertia etc. with
        // EMPTY values on ALL requests (navigation AND real Livewire AJAX).
        // We must distinguish between the two:
        //
        // - Navigation (GET pages): Remove empty phantom headers so Livewire's
        //   isLivewireRequest() returns false, preventing PersistentMiddleware
        //   from running makeFakeRequest() with null path/method → crash.
        //
        // - Real Livewire updates (POST /livewire/update): Restore X-Livewire
        //   with a truthy value so Livewire correctly identifies the request,
        //   skips payload-tampering middleware (TrimStrings, ConvertEmptyStringsToNull),
        //   and returns JSON responses instead of HTTP redirects.
        $isLivewireUpdate = $request->isMethod('POST')
            && str_contains($request->getRequestUri() ?? '', '/livewire/update');

        if ($isLivewireUpdate) {
            $request->headers->set('X-Livewire', 'true');
        } else {
            foreach (self::PHANTOM_HEADERS as $header) {
                if ($request->hasHeader($header) && ($request->header($header) === '' || $request->header($header) === null)) {
                    $request->headers->remove($header);
                }
            }
        }

        // Normalize empty/invalid HTTP method at ALL layers.
        $method = $request->getMethod();

        if ($method === '' || !in_array($method, self::VALID_METHODS, true)) {
            $normalizedMethod = 'GET';

            $_SERVER['REQUEST_METHOD'] = $normalizedMethod;
            $request->server->set('REQUEST_METHOD', $normalizedMethod);
            $request->setMethod($normalizedMethod);
        }

        return $next($request);
    }
}
