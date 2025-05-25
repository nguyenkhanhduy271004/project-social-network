export const APP_NAME: string = 'Social App';

interface UserRoles {
    ADMIN: string;
    USER: string;
}

export const USER_ROLES: UserRoles = {
    ADMIN: 'ADMIN',
    USER: 'USER',
};

interface PostTypes {
    TEXT: string;
    IMAGE: string;
    VIDEO: string;
}

export const POST_TYPES: PostTypes = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
};

interface NotificationTypes {
    LIKE: string;
    COMMENT: string;
    FOLLOW: string;
    MESSAGE: string;
}

export const NOTIFICATION_TYPES: NotificationTypes = {
    LIKE: 'LIKE',
    COMMENT: 'COMMENT',
    FOLLOW: 'FOLLOW',
    MESSAGE: 'MESSAGE',
};

interface ChatTypes {
    PRIVATE: string;
    GROUP: string;
}

export const CHAT_TYPES: ChatTypes = {
    PRIVATE: 'PRIVATE',
    GROUP: 'GROUP',
};

interface FileTypes {
    IMAGE: string[];
    VIDEO: string[];
}

export const FILE_TYPES: FileTypes = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
    VIDEO: ['video/mp4', 'video/webm'],
};

export const MAX_FILE_SIZE: number = 5 * 1024 * 1024; // 5MB 