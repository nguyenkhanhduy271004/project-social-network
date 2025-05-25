export const APP_NAME = 'Social App';

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
};

export const POST_TYPES = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
};

export const NOTIFICATION_TYPES = {
    LIKE: 'LIKE',
    COMMENT: 'COMMENT',
    FOLLOW: 'FOLLOW',
    MESSAGE: 'MESSAGE',
};

export const CHAT_TYPES = {
    PRIVATE: 'PRIVATE',
    GROUP: 'GROUP',
};

export const FILE_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
    VIDEO: ['video/mp4', 'video/webm'],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 