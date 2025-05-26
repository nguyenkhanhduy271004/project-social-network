export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
    },
    POSTS: {
        BASE: '/posts',
        USER: (userId: string) => `/posts/user/${userId}`,
        LIKE: (postId: string) => `/posts/${postId}/like`,
        UNLIKE: (postId: string) => `/posts/${postId}/unlike`,
        REPOST: (postId: string) => `/posts/${postId}/repost`,
    },
    USERS: {
        BASE: '/users',
        FOLLOW: (userId: string) => `/users/${userId}/follow`,
        UNFOLLOW: (userId: string) => `/users/${userId}/unfollow`,
        FOLLOWERS: (userId: string) => `/users/${userId}/followers`,
        FOLLOWING: (userId: string) => `/users/${userId}/following`,
    },
    COMMENTS: {
        BASE: '/comments',
        POST: (postId: string) => `/comments/post/${postId}`,
    },
}; 