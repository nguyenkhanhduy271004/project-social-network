import React, { ReactNode } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface ModalProps extends Omit<DialogProps, 'title'> {
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}

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

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    ...props
}) => {
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClose) {
            onClose(event, 'backdropClick');
        }
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            {...props}
        >
            <StyledDialogTitle>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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