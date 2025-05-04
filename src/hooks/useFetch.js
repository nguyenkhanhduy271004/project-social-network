import { useState, useEffect, useCallback } from 'react';
import { useLoading } from '../utils/LoadingContext';

/**
 * Custom hook for handling data fetching with loading states
 * @param {Function} fetchFunction - The async function to fetch data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Additional options
 * @param {boolean} options.showGlobalLoading - Whether to show global loading
 * @param {string} options.loadingMessage - Custom loading message
 * @param {boolean} options.fetchOnMount - Whether to fetch on component mount
 * @returns {Object} - { data, loading, error, refetch }
 */
const useFetch = (
    fetchFunction,
    dependencies = [],
    options = {}
) => {
    const {
        showGlobalLoading = false,
        loadingMessage = 'Loading...',
        fetchOnMount = true,
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { showLoading, hideLoading } = useLoading();

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            if (showGlobalLoading) {
                showLoading(loadingMessage);
            }

            const result = await fetchFunction(...args);
            setData(result);
            setError(null);
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            return null;
        } finally {
            setLoading(false);
            if (showGlobalLoading) {
                hideLoading();
            }
        }
    }, [fetchFunction, showGlobalLoading, loadingMessage, showLoading, hideLoading]);

    useEffect(() => {
        if (fetchOnMount) {
            execute();
        }
    }, [...dependencies, execute]);

    return { data, loading, error, refetch: execute };
};

export default useFetch; 