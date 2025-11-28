export interface TelegramUser {
    id: number | string;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        user?: TelegramUser;
        chat?: {
            id: number;
            type: string;
            title?: string;
            username?: string;
        };
        start_param?: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
        secondary_bg_color?: string;
        hint_color?: string;
        bg_color?: string;
        text_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    BackButton: {
        isVisible: boolean;
        show(): void;
        hide(): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        isProgressVisible: boolean;
        setText(text: string): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
        show(): void;
        hide(): void;
        enable(): void;
        disable(): void;
        showProgress(): void;
        hideProgress(): void;
    };
    ready(): void;
    expand(): void;
    close(): void;
    openLink(url: string, options?: { try_instant_view?: boolean }): void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}
