export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
};

export const validateUsername = (username) => {
    // 3-20 characters, letters, numbers, underscores
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
};

export const validateFileSize = (file, maxSize) => {
    return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
}; 