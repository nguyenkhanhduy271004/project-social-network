import React from 'react';
import { Alert, Button } from '@mui/material';

const ErrorDisplay = ({ message, onRetry }) => {
    return (
        <Alert
            severity="error"
            action={
                onRetry && (
                    <Button
                        color="inherit"
                        size="small"
                        onClick={onRetry}
                    >
                        Thử lại
                    </Button>
                )
            }
        >
            {message}
        </Alert>
    );
};

export default ErrorDisplay; 