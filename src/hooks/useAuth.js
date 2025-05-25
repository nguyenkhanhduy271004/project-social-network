import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, updateUserProfile } from '../store/actions/auth';
import { ROUTES } from '../config/routes';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector(state => state.auth);

    const login = async (credentials) => {
        try {
            const response = await dispatch(loginUser(credentials));
            if (response.status === 200) {
                navigate(ROUTES.HOME);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await dispatch(registerUser(userData));
            if (response.status === 200) {
                navigate(ROUTES.HOME);
            }
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = () => {
        dispatch(logoutUser());
        navigate(ROUTES.LOGIN);
    };

    const updateProfile = async (formData) => {
        try {
            const response = await dispatch(updateUserProfile(formData));
            return response;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
    };
}; 