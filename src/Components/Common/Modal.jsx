import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        padding: theme.spacing(2),
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Modal = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
}) => {
    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
        >
            <StyledDialogTitle>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </StyledDialog>
    );
};

export default Modal; 