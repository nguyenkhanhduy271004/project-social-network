export interface User {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    image?: string;
    backgroundImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    birthDate?: string;
    mobile?: string;
    following?: User[];
    followers?: User[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Post {
    id: string;
    content: string;
    image?: string;
    userId: string;
    user?: User;
    likes?: User[];
    comments?: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    content: string;
    userId: string;
    user?: User;
    postId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    sender?: User;
    receiver?: User;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface PostState {
    posts: Post[];
    currentPost: Post | null;
    rePost: Post[];
    loading: boolean;
    error: string | null;
}

export interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
}

export interface UserState {
    profile: User | null;
    searchResults: User[];
    followers: User[];
    following: User[];
    loading: boolean;
    error: string | null;
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
        loading: boolean;
        error: string | null;
    };
    chat: {
        messages: Message[];
        loading: boolean;
        error: string | null;
    };
    user: {
        users: User[];
        loading: boolean;
        error: string | null;
    };
} 