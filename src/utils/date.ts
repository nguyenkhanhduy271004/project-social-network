export const formatDate = (date: string | Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return new Date(date).toLocaleDateString();
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleString();
};

export const isToday = (date: string | Date): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear();
}; 