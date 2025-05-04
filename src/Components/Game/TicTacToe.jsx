import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    Alert,
    Paper,
    Container,
    CircularProgress,
    Fade,
    Snackbar,
    Chip,
    useTheme,
    Divider,
    useMediaQuery
} from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { API_BASE_URL } from '../../config/api';

const TicTacToe = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [turn, setTurn] = useState(null);
    const [gameState, setGameState] = useState('WAITING_FOR_PLAYER');
    const [winner, setWinner] = useState(null);
    const [error, setError] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastMove, setLastMove] = useState(-1);

    // Kết nối WebSocket khi component mount
    useEffect(() => {
        connectToServer();

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    const connectToServer = () => {
        setIsLoading(true);
        try {
            // Sửa lại địa chỉ WebSocket để khớp với cấu hình trong controller
            const socketUrl = `${API_BASE_URL}/ws`;
            console.log('Connecting to WebSocket at:', socketUrl);

            const socket = new SockJS(socketUrl);
            const client = Stomp.over(socket);

            // Debug
            console.log('SockJS created with URL:', socketUrl);
            console.log('API_BASE_URL is:', API_BASE_URL);

            if (process.env.NODE_ENV === 'production') {
                client.debug = null;
            } else {
                // Enable debug in development
                client.debug = function (str) {
                    console.log('STOMP Debug:', str);
                };
            }

            // Add heartbeat to ensure connection stays alive
            client.heartbeat.outgoing = 20000; // 20 seconds
            client.heartbeat.incoming = 20000;

            // Add connection timeout handling
            let connectionTimeout = setTimeout(() => {
                console.error('WebSocket connection timeout');
                setError('Kết nối quá hạn. Vui lòng thử lại.');
                setIsConnected(false);
                setIsLoading(false);
                setTimeout(connectToServer, 3000);
            }, 10000);

            // Use specific headers to help with connection
            const headers = {
                'X-Client-ID': 'tictactoe-' + new Date().getTime()
            };

            client.connect(headers, () => {
                clearTimeout(connectionTimeout);
                setStompClient(client);
                setIsConnected(true);
                setIsLoading(false);
                console.log('WebSocket connected successfully');
            }, (err) => {
                clearTimeout(connectionTimeout);
                console.error('WebSocket error:', err);
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
                setIsConnected(false);
                setIsLoading(false);
                // Try to reconnect after a delay
                setTimeout(connectToServer, 5000);
            });
        } catch (e) {
            console.error('Connection setup error:', e);
            setError('Lỗi kết nối. Vui lòng thử lại sau.');
            setIsLoading(false);
            // Try to reconnect after a delay
            setTimeout(connectToServer, 5000);
        }
    };

    // Đăng ký các subscription WebSocket
    useEffect(() => {
        if (stompClient && isConnected) {
            const gameStateSub = stompClient.subscribe('/topic/game.state', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('Received /topic/game.state:', data);
                    if (data.type === 'game.joined') {
                        setGameId(data.gameId);
                        setBoard(data.board || Array(9).fill(null));
                        setTurn(data.turn);
                        setGameState(data.gameState);
                        setWinner(data.winner);
                    } else if (data.type === 'error') {
                        setError(data.content);
                    }
                } catch (e) {
                    console.error('Error parsing /topic/game.state message:', e);
                    setError('Lỗi xử lý dữ liệu trò chơi.');
                }
            });

            if (gameId) {
                const gameUpdateSub = stompClient.subscribe(`/topic/game.${gameId}`, (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        console.log(`Received /topic/game.${gameId}:`, data);
                        if (data.type === 'game.move') {
                            setBoard(data.board || Array(9).fill(null));
                            setTurn(data.turn);
                            setGameState(data.gameState);
                            setLastMove(data.move);
                        } else if (data.type === 'game.gameOver') {
                            setBoard(data.board || Array(9).fill(null));
                            setGameState(data.gameState);
                            setWinner(data.winner);
                        } else if (data.type === 'game.left') {
                            setError('Đối thủ đã rời trò chơi.');
                            setGameState('GAME_OVER');
                        } else if (data.type === 'error') {
                            setError(data.content);
                        }
                    } catch (e) {
                        console.error('Error processing game update:', e);
                        setError('Lỗi cập nhật trạng thái trò chơi.');
                    }
                });

                return () => {
                    gameStateSub.unsubscribe();
                    gameUpdateSub.unsubscribe();
                };
            }

            return () => gameStateSub.unsubscribe();
        }
    }, [stompClient, isConnected, gameId]);

    // Xử lý tham gia trò chơi
    const joinGame = () => {
        if (!playerName.trim()) {
            setError('Vui lòng nhập tên người chơi.');
            return;
        }

        if (stompClient && isConnected) {
            setIsLoading(true);

            const joinMessage = {
                player: playerName,
                timestamp: new Date().getTime()
            };

            console.log('Sending join game request:', joinMessage);
            stompClient.send('/app/game.join', {}, JSON.stringify(joinMessage));

            setTimeout(() => setIsLoading(false), 500); // Giảm thời gian loading
        } else {
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
            connectToServer();
        }
    };

    // Xử lý nước đi
    const makeMove = (index) => {
        if (!stompClient || !gameId) {
            setError('Không thể thực hiện nước đi: Chưa tham gia trò chơi.');
            return;
        }

        if (turn !== playerName) {
            setError('Chưa đến lượt của bạn!');
            return;
        }

        if (board[index]) {
            setError('Ô này đã được đánh!');
            return;
        }

        if (gameState !== 'IN_PROGRESS') {
            setError('Trò chơi chưa bắt đầu hoặc đã kết thúc.');
            return;
        }

        setIsLoading(true);
        setLastMove(index);

        try {
            // Cấu trúc lại message để khớp với MessageTicTacToeController.java
            const moveMessage = {
                sender: playerName,
                gameId: gameId,
                move: index,
                timestamp: new Date().getTime()
            };

            console.log('Sending move message:', moveMessage);
            stompClient.send('/app/game.move', {}, JSON.stringify(moveMessage));

            setTimeout(() => setIsLoading(false), 300);
        } catch (error) {
            console.error('Error sending move:', error);
            setError('Lỗi gửi dữ liệu. Vui lòng thử lại.');
            setIsLoading(false);
        }
    };

    // Xử lý rời trò chơi
    const leaveGame = () => {
        if (stompClient && playerName && gameId) {
            const leaveMessage = {
                player: playerName,
                gameId: gameId
            };

            console.log('Sending leave game request:', leaveMessage);
            stompClient.send('/app/game.leave', {}, JSON.stringify(leaveMessage));

            setGameId(null);
            setBoard(Array(9).fill(null));
            setGameState('WAITING_FOR_PLAYER');
            setWinner(null);
            setTurn(null);
            setLastMove(-1);
        }
    };

    // Xử lý restart game
    const restartGame = () => {
        leaveGame();
        setTimeout(joinGame, 500);
    };

    // Render ô cờ caro
    const renderSquare = (index) => {
        const isX = board[index] === 'X';
        const isO = board[index] === 'O';
        const isLastMove = lastMove === index;
        const isPlayerTurn = turn === playerName;
        const isClickable = !board[index] && gameState === 'IN_PROGRESS' && isPlayerTurn;

        return (
            <Button
                variant={board[index] ? "contained" : "outlined"}
                color={isX ? "primary" : isO ? "secondary" : "inherit"}
                sx={{
                    width: isMobile ? 65 : 80,
                    height: isMobile ? 65 : 80,
                    fontSize: isMobile ? 28 : 36,
                    fontWeight: 'bold',
                    m: 0.25,
                    p: 0,
                    minWidth: 'unset',
                    boxShadow: isLastMove ? 6 : 1,
                    transition: 'all 0.3s ease',
                    borderRadius: 1,
                    border: `2px solid ${isClickable ? theme.palette.primary.main : theme.palette.grey[300]}`,
                    bgcolor: board[index]
                        ? isX ? theme.palette.primary.light : theme.palette.secondary.light
                        : isClickable ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.95)',
                    '&:hover': {
                        bgcolor: isClickable
                            ? 'rgba(200, 225, 255, 0.7)'
                            : board[index]
                                ? isX ? theme.palette.primary.main : theme.palette.secondary.main
                                : 'rgba(230, 230, 230, 0.95)',
                        transform: isClickable ? 'scale(1.05)' : 'none',
                        boxShadow: isClickable ? 4 : isLastMove ? 6 : 1,
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isLastMove ? 'pulse 1s ease-in-out' : 'none',
                    '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${isX ? 'rgba(25, 118, 210, 0.5)' : 'rgba(211, 47, 47, 0.5)'}` },
                        '50%': { transform: 'scale(1.1)', boxShadow: `0 0 0 8px ${isX ? 'rgba(25, 118, 210, 0.2)' : 'rgba(211, 47, 47, 0.2)'}` },
                        '100%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${isX ? 'rgba(25, 118, 210, 0)' : 'rgba(211, 47, 47, 0)'}` },
                    },
                }}
                onClick={() => makeMove(index)}
                disabled={!isClickable || isLoading}
            >
                {board[index]}
            </Button>
        );
    };

    const getStatusMessage = () => {
        if (gameState === 'WAITING_FOR_PLAYER') {
            return "Đang chờ người chơi khác tham gia...";
        } else if (gameState === 'TIE') {
            return "Trò chơi hòa!";
        } else if (gameState.includes('WON')) {
            return winner === playerName ? "Chúc mừng! Bạn đã thắng!" : `${winner} đã thắng!`;
        } else {
            return turn === playerName ? "Lượt của bạn!" : `Chờ ${turn} đánh...`;
        }
    };

    const getStatusColor = () => {
        if (gameState === 'WAITING_FOR_PLAYER') return "info.main";
        if (gameState === 'TIE') return "warning.main";
        if (gameState.includes('WON')) return winner === playerName ? "success.main" : "error.main";
        return turn === playerName ? "primary.main" : "text.secondary";
    };

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 } }}>
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <Chip
                        label={isConnected ? "Đã kết nối" : "Mất kết nối"}
                        color={isConnected ? "success" : "error"}
                        size="small"
                        sx={{
                            fontWeight: 'medium',
                            animation: !isConnected ? 'blink 1.5s infinite' : 'none',
                            '@keyframes blink': {
                                '0%': { opacity: 0.6 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.6 },
                            },
                        }}
                    />
                </Box>

                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <SportsEsportsIcon fontSize="large" />
                    Cờ Caro
                </Typography>

                <Fade in={isLoading}>
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.7)',
                        zIndex: 999,
                        backdropFilter: 'blur(3px)',
                        pointerEvents: isLoading ? 'auto' : 'none',
                    }}>
                        <CircularProgress />
                    </Box>
                </Fade>

                {!gameId && (
                    <Fade in={!gameId}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 1,
                        }}>
                            <TextField
                                label="Tên người chơi"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                variant="outlined"
                                fullWidth
                                autoFocus
                                InputProps={{
                                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                helperText="Nhập tên để bắt đầu chơi cờ caro"
                            />
                            <Button
                                variant="contained"
                                onClick={joinGame}
                                disabled={!playerName.trim() || !isConnected || isLoading}
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 4,
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Tham gia trò chơi
                            </Button>

                            {!isConnected && (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={connectToServer}
                                    fullWidth
                                    startIcon={<RefreshIcon />}
                                >
                                    Kết nối lại
                                </Button>
                            )}
                        </Box>
                    </Fade>
                )}

                {gameId && (
                    <Fade in={!!gameId}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{
                                mb: 2,
                                p: 2,
                                width: '100%',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 1,
                            }}>
                                <Typography
                                    variant="subtitle1"
                                    align="center"
                                    gutterBottom
                                    sx={{ fontWeight: 'medium' }}
                                >
                                    Mã phòng: <b>{gameId}</b>
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        Người chơi: <b>{playerName}</b>
                                    </Typography>
                                    <Chip
                                        label={playerName === turn ? 'X' : 'O'}
                                        color={playerName === turn ? 'primary' : 'secondary'}
                                        size="small"
                                    />
                                </Box>

                                <Typography
                                    variant="h6"
                                    align="center"
                                    gutterBottom
                                    sx={{
                                        color: getStatusColor(),
                                        fontWeight: 'bold',
                                        animation: turn === playerName && gameState === 'IN_PROGRESS'
                                            ? 'pulse 2s infinite'
                                            : 'none',
                                        '@keyframes pulse': {
                                            '0%': { opacity: 0.7 },
                                            '50%': { opacity: 1 },
                                            '100%': { opacity: 0.7 },
                                        },
                                    }}
                                >
                                    {getStatusMessage()}
                                </Typography>
                            </Box>

                            <Box sx={{
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 2,
                                mb: 2,
                            }}>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 1, color: 'text.secondary', textAlign: 'center', fontWeight: 'bold' }}
                                >
                                    {gameState === 'IN_PROGRESS' && turn === playerName
                                        ? 'Chọn một ô trống để đánh'
                                        : 'Chờ đến lượt của bạn...'}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 1,
                                    position: 'relative',
                                }}>
                                    <Grid
                                        container
                                        spacing={0.5}
                                        sx={{
                                            width: 'fit-content',
                                            border: `2px solid ${theme.palette.grey[400]}`,
                                            borderRadius: 1,
                                            p: 0.5,
                                            bgcolor: 'rgba(245, 245, 245, 0.5)',
                                            maxWidth: isMobile ? 215 : 260,
                                            overflow: 'visible',
                                        }}
                                    >
                                        {/* Hiển thị các đường kẻ ngang */}
                                        <Box sx={{
                                            position: 'absolute',
                                            width: 'calc(100% - 8px)',
                                            height: '1px',
                                            bgcolor: theme.palette.grey[400],
                                            top: '33.33%',
                                            left: '4px',
                                        }} />
                                        <Box sx={{
                                            position: 'absolute',
                                            width: 'calc(100% - 8px)',
                                            height: '1px',
                                            bgcolor: theme.palette.grey[400],
                                            top: '66.66%',
                                            left: '4px',
                                        }} />

                                        {/* Hiển thị các đường kẻ dọc */}
                                        <Box sx={{
                                            position: 'absolute',
                                            width: '1px',
                                            height: 'calc(100% - 8px)',
                                            bgcolor: theme.palette.grey[400],
                                            left: '33.33%',
                                            top: '4px',
                                        }} />
                                        <Box sx={{
                                            position: 'absolute',
                                            width: '1px',
                                            height: 'calc(100% - 8px)',
                                            bgcolor: theme.palette.grey[400],
                                            left: '66.66%',
                                            top: '4px',
                                        }} />

                                        {/* Hiển thị các ô */}
                                        {[0, 1, 2].map(row => (
                                            <React.Fragment key={`row-${row}`}>
                                                {[0, 1, 2].map(col => {
                                                    const index = row * 3 + col;
                                                    return (
                                                        <Grid item key={`cell-${index}`} sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            width: '33.33%',
                                                            padding: 0,
                                                        }}>
                                                            {renderSquare(index)}
                                                        </Grid>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={leaveGame}
                                    startIcon={<ExitToAppIcon />}
                                    sx={{
                                        boxShadow: 1,
                                        '&:hover': {
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    Rời phòng
                                </Button>

                                {(gameState.includes('WON') || gameState === 'TIE') && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={restartGame}
                                        startIcon={<RefreshIcon />}
                                        sx={{
                                            boxShadow: 1,
                                            '&:hover': {
                                                boxShadow: 3,
                                            },
                                        }}
                                    >
                                        Chơi lại
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setError(null)}
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TicTacToe;