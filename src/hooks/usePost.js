import { useSelector, useDispatch } from 'react-redux';
import { createPost, likePost, commentOnPost, getUsersPost } from '../Store/actions/post';

export const usePost = () => {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector(state => state.post);

    const createNewPost = async (postData) => {
        try {
            const response = await dispatch(createPost(postData));
            return response;
        } catch (error) {
            console.error('Create post error:', error);
            throw error;
        }
    };

    const likePostById = async (postId) => {
        try {
            const response = await dispatch(likePost(postId));
            return response;
        } catch (error) {
            console.error('Like post error:', error);
            throw error;
        }
    };

    const addComment = async (postId, comment) => {
        try {
            const response = await dispatch(commentOnPost({ postId, comment }));
            return response;
        } catch (error) {
            console.error('Add comment error:', error);
            throw error;
        }
    };

    const fetchUserPosts = async (userId) => {
        try {
            const response = await dispatch(getUsersPost(userId));
            return response;
        } catch (error) {
            console.error('Fetch user posts error:', error);
            throw error;
        }
    };

    return {
        posts,
        loading,
        error,
        createNewPost,
        likePostById,
        addComment,
        fetchUserPosts,
    };
}; 