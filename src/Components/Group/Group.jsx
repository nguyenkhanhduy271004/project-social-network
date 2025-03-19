import React, { useEffect, useState } from "react";
import { Button, TextField, Card, CardContent, Typography, CircularProgress, Avatar, Grid, Paper, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, getGroups, joinGroup } from "../../Store/Group/Action";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";

const Groups = () => {
    const dispatch = useDispatch();
    const { groups, loading } = useSelector((state) => state.group);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);

    const handleCreateGroup = () => {
        if (groupName.trim()) {
            dispatch(createGroup({ name: groupName }));
            setGroupName("");
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Phần tạo nhóm */}
            <Paper elevation={3} className="p-6 mb-8">
                <Typography variant="h5" className="font-bold text-center mb-4">
                    Tạo Nhóm Mới
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <TextField
                            fullWidth
                            label="Tên nhóm"
                            variant="outlined"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            InputProps={{
                                style: {
                                    borderRadius: "8px",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleCreateGroup}
                            startIcon={<AddIcon />}
                            style={{
                                borderRadius: "8px",
                                padding: "12px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textTransform: "none",
                            }}
                        >
                            Tạo
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Phần hiển thị danh sách nhóm */}
            {loading ? (
                <div className="flex justify-center mt-8">
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <Grid container spacing={4}>
                    {groups.map((group) => (
                        <Grid item key={group.id} xs={12} sm={6} md={4}>
                            <Card className="h-full flex flex-col justify-between shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    {/* Phần thông tin nhóm */}
                                    <div className="flex items-center mb-4">
                                        <Avatar className="bg-blue-500 text-white mr-4">
                                            <GroupIcon />
                                        </Avatar>
                                        <div>
                                            <Typography variant="h6" className="font-bold">
                                                {group.name || "Nhóm không có tên"}
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-500">
                                                Quản trị viên: {group.admin?.name || "Không xác định"}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* Phần thông tin bổ sung */}
                                    <div className="space-y-2">
                                        <Typography variant="body2" className="text-gray-500">
                                            Ngày tạo: {group.createdDate ? moment(group.createdDate).format("DD/MM/YYYY") : "Không xác định"}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            Số bài viết: {group.posts?.length || 0}
                                        </Typography>
                                    </div>
                                </CardContent>

                                {/* Nút tham gia nhóm */}
                                <div className="p-4">
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => dispatch(joinGroup(group.id))}
                                        style={{
                                            borderRadius: "8px",
                                            padding: "10px",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                        }}
                                    >
                                        Tham gia nhóm
                                    </Button>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default Groups;