import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from '../../Store/Auth/Action'
import {
    Avatar,
    Box,
    Typography,
    CircularProgress,
    Paper,
    InputBase,
    IconButton,
    Divider,
    Fade,
    useTheme
} from '@mui/material'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'

function SearchUser() {
    const dispatch = useDispatch()
    const theme = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const searchResults = useSelector((state) => state.auth.userSearch || [])
    const jwt = localStorage.getItem("jwt")

    const handleSearchUser = async (e) => {
        const query = e.target.value
        setSearchQuery(query)

        if (query.trim()) {
            setIsLoading(true)
            try {
                await dispatch(searchUsers(query))
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Box
            sx={{
                maxWidth: '800px',
                mx: 'auto',
                px: { xs: 2, sm: 4 },
                py: 4,
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: theme.palette.text.primary
                    }}
                >
                    Tìm kiếm người dùng
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: '2px 4px',
                        backgroundColor: theme.palette.background.default
                    }}
                >
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            color: theme.palette.text.primary
                        }}
                        placeholder="Nhập tên hoặc email để tìm kiếm..."
                        value={searchQuery}
                        onChange={handleSearchUser}
                    />
                    <IconButton sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Paper>

            {isLoading && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ my: 4 }}
                >
                    <CircularProgress size={40} />
                </Box>
            )}

            <Fade in={!isLoading && searchResults.length > 0}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: theme.palette.text.secondary
                        }}
                    >
                        Kết quả tìm kiếm ({searchResults.length})
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {searchResults.map((user) => (
                            <Link
                                to={`/profile/${user.id}`}
                                key={user.id}
                                style={{ textDecoration: 'none' }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[4],
                                            backgroundColor: theme.palette.action.hover
                                        }
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            src={user.avatar}
                                            alt={user.fullName}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                border: `2px solid ${theme.palette.primary.main}`
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {user.fullName}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                <EmailIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: theme.palette.text.secondary }}
                                                >
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Fade>

            {!isLoading && searchQuery && searchResults.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 4,
                        color: theme.palette.text.secondary
                    }}
                >
                    <Typography variant="h6">
                        Không tìm thấy kết quả nào
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Hãy thử tìm kiếm với từ khóa khác
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default SearchUser
