import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReel, getReels } from "../../Store/Reel/Action";
import { Button, CircularProgress, Modal, TextField } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Add } from "@mui/icons-material";

const Reel = () => {
    const dispatch = useDispatch();
    const { reels, loading, error } = useSelector((state) => state.reel);

    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getReels());
    }, [dispatch]);

    const handleCreateReel = () => {
        if (!file) return alert("Vui lòng chọn file!");

        dispatch(createReel({ file, description }));
        setIsModalOpen(false); // Đóng modal sau khi thêm
    };

    const handleNext = () => {
        if (currentIndex < reels.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <p className="text-red-500">Lỗi: {error}</p>;

    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
            {/* Nút thêm Reel ở góc trên phải */}
            <Button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition">
                <Add className="mr-1" />
                Thêm Reel
            </Button>

            {/* Container chứa Reel và các nút điều hướng */}
            <div className="relative w-full max-w-[800px] flex items-center justify-center">
                {/* Nút Previous */}
                {currentIndex > 0 && (
                    <Button
                        onClick={handlePrev}
                        className="absolute left-0 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition z-10">
                        <ArrowBackIos />
                    </Button>
                )}

                {/* Container chứa video/ảnh */}
                {reels.length > 0 ? (
                    <div className="w-[400px] h-[600px] bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                        {reels[currentIndex]?.image?.toLowerCase().endsWith(".mp4") ? (
                            <video src={reels[currentIndex].image} controls className="w-full h-full object-cover" />
                        ) : (
                            <img src={reels[currentIndex].image} alt="Reel" className="w-full h-full object-cover" />
                        )}
                    </div>
                ) : (
                    <p className="text-white text-center">Không có reel nào.</p>
                )}

                {/* Nút Next */}
                {currentIndex < reels.length - 1 && (
                    <Button
                        onClick={handleNext}
                        className="absolute right-0 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition z-10">
                        <ArrowForwardIos />
                    </Button>
                )}
            </div>

            {/* Modal thêm Reel */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg w-[400px]">
                    <h2 className="text-lg font-semibold mb-4 text-white">Thêm Reel Mới</h2>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="mb-4 w-full p-2 bg-gray-700 text-white rounded"
                        placeholder="Chọn file..."
                    />
                    <TextField
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mb-4 bg-gray-700 text-white rounded"
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="mr-2 bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition">
                            Hủy
                        </Button>
                        <Button
                            onClick={handleCreateReel}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                            Thêm
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Reel;