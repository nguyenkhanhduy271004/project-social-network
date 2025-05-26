export interface User {
    id: string;
    email: string;
    fullName: string;
    image?: string;
    bio?: string;
    location?: string;
    website?: string;
    birthDate?: string;
    mobile?: string;
    backgroundImage?: string;
    followers?: User[];
    following?: User[];
}

export interface Post {
    id: string;
    content: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    likes: User[];
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RootState {
    auth: {
        user: User | null;
        loading: boolean;
        error: string | null;
    };
    post: {
        posts: Post[];
        rePost: Post[];
        currentPost: Post | null;
        loading: boolean;
        error: string | null;
    };
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    sender: User;
    conversationId: string;
    createdAt: string;
} 