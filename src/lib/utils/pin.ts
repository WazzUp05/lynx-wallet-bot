'use client';

const textEncoder = new TextEncoder();

export const PIN_LENGTH = 4;

export const generatePinSalt = (): string => {
    if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
        return Math.random().toString(36).slice(2, 10);
    }

    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const bufferToHex = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const hashPin = async (pin: string, salt: string): Promise<string> => {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
        return `${salt}:${pin}`;
    }

    const data = textEncoder.encode(`${salt}:${pin}`);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(digest);
};
