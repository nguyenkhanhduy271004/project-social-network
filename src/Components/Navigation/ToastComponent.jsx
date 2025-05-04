import { Box, Typography } from "@mui/material";

export const ToastComponent = ({ notif }) => {
    return (
        <Box sx={{ p: 1, borderBottom: '1px solid #ddd' }}>
            <Typography variant="body2">{notif.message || notif.content}</Typography>
        </Box>
    );
};