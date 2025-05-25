interface Routes {
    HOME: string;
    LOGIN: string;
    REGISTER: string;
    PROFILE: string;
    ACCOUNT: string;
    MESSAGE: string;
    CHAT: string;
    SEARCH: string;
    NOTIFICATIONS: string;
    ADMIN: string;
    GAME: string;
    GROUP: string;
    REEL: string;
    STORY: string;
}

export const ROUTES: Routes = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    ACCOUNT: '/account',
    MESSAGE: '/message',
    CHAT: '/chat',
    SEARCH: '/search',
    NOTIFICATIONS: '/notifications',
    ADMIN: '/admin',
    GAME: '/game',
    GROUP: '/group',
    REEL: '/reel',
    STORY: '/story',
};

export const PRIVATE_ROUTES: string[] = [
    ROUTES.PROFILE,
    ROUTES.ACCOUNT,
    ROUTES.MESSAGE,
    ROUTES.CHAT,
    ROUTES.SEARCH,
    ROUTES.NOTIFICATIONS,
    ROUTES.ADMIN,
    ROUTES.GAME,
    ROUTES.GROUP,
    ROUTES.REEL,
    ROUTES.STORY,
]; 