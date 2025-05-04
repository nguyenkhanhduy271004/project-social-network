import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1877F2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
        },
        background: {
            default: '#f0f2f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#1c1e21',
            secondary: '#65676b',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
            light: '#e3f2fd',
            dark: '#90caf9',
            contrastText: '#000000',
        },
        secondary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
        },
        background: {
            default: '#000000',
            paper: '#121212',
        },
        text: {
            primary: '#ffffff',
            secondary: '#90caf9',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
        action: {
            active: '#ffffff',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
                contained: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                },
                outlined: {
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    '&:hover': {
                        borderColor: '#90caf9',
                        backgroundColor: 'rgba(144, 202, 249, 0.08)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    backgroundColor: '#121212',
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000000',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    '&.Mui-focused': {
                        borderColor: '#ffffff',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212',
                    '&:hover': {
                        backgroundColor: '#1a1a1a',
                    },
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    border: '2px solid rgba(255, 255, 255, 0.12)',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '0.875rem',
                },
            },
        },
    },
}); 