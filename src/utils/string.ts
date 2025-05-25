export const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number = 100): string => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export const generateUsername = (fullName: string): string => {
    if (!fullName) return '';
    return fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
}; 