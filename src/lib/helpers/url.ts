const PRIMARY_API_URL = 'https://stage.lynxrussia.ru/api';
const FALLBACK_API_URL = 'https://stage-proxy.lynxrussia.ru/api';
const DEFAULT_TIMEOUT_MS = 7000;

let fallbackActivated = false;

type ApiFetchInit = RequestInit & {
    timeoutMs?: number;
    skipFallback?: boolean;
};

const ABSOLUTE_URL_REGEXP = /^https?:\/\//i;

function buildUrl(path: string, baseUrl: string) {
    if (ABSOLUTE_URL_REGEXP.test(path)) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

function isAbortError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const name = (error as { name?: string }).name;
    return name === 'AbortError';
}

function isNetworkError(error: unknown): boolean {
    return error instanceof TypeError;
}

function shouldActivateFallback(error: unknown): boolean {
    return isAbortError(error) || isNetworkError(error);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
    if (timeoutMs <= 0) {
        return fetch(url, init);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const { signal: originalSignal, ...restInit } = init;

    let removeAbortListener: (() => void) | undefined;

    if (originalSignal) {
        if (originalSignal.aborted) {
            controller.abort();
        } else {
            const onAbort = () => controller.abort();
            originalSignal.addEventListener('abort', onAbort);
            removeAbortListener = () => originalSignal.removeEventListener('abort', onAbort);
        }
    }

    try {
        return await fetch(url, { ...restInit, signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
        removeAbortListener?.();
    }
}

export async function apiFetch(path: string, init: ApiFetchInit = {}) {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, skipFallback = false, ...restInit } = init;
    const requestInit = restInit as RequestInit;

    if (skipFallback) {
        return fetch(buildUrl(path, PRIMARY_API_URL), requestInit);
    }

    if (!fallbackActivated) {
        try {
            return await fetchWithTimeout(buildUrl(path, PRIMARY_API_URL), requestInit, timeoutMs);
        } catch (error) {
            if (shouldActivateFallback(error)) {
                fallbackActivated = true;
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('[apiFetch] Switching to fallback API URL due to primary request failure.');
                }
                return fetch(buildUrl(path, FALLBACK_API_URL), requestInit);
            }

            throw error;
        }
    }

    return fetch(buildUrl(path, FALLBACK_API_URL), requestInit);
}

export function getCurrentApiBaseUrl() {
    return fallbackActivated ? FALLBACK_API_URL : PRIMARY_API_URL;
}

export function isFallbackApiActive() {
    return fallbackActivated;
}

export const API_PRIMARY_URL = PRIMARY_API_URL;
export const API_FALLBACK_URL = FALLBACK_API_URL;
export const API_REQUEST_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;
