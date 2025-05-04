import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const selectUser = (state) => state.auth.user;
export const selectPosts = (state) => state.post.posts;
export const selectFindUser = (state) => state.auth.findUser; 