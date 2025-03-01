import { Avatar, Button } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import ImageIcon from '@mui/icons-material/Image';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import PostCard from './PostCard';
import StorySlider from '../StorySlider/StorySlider';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, findPostsByLikeContainUser, getAllPosts } from '../../Store/Post/Action';

const validationSchema = Yup.object({
    content: Yup.string().required("Text is required"),
});

function HomeSection() {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const { posts, loading } = useSelector(state => state.post);
    const isLoading = useSelector(state => state.post.loading);

    const [selectedImage, setSelectedImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const emojis = ["😃", "😂", "😍", "🤔", "😭", "😎", "🥰", "😡", "👍", "🔥"];

    useEffect(() => {
        dispatch(getAllPosts());
        dispatch(findPostsByLikeContainUser(auth.user?.id));
    }, [dispatch, auth.user?.id]);

    const formik = useFormik({
        initialValues: { content: "", image: null },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            await dispatch(createPost({ content: values.content, file: values.image }));
            resetForm();
            setSelectedImage(null);
        }
    });

    const handleSelectImage = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            formik.setFieldValue("image", imageFile);
            setSelectedImage(URL.createObjectURL(imageFile));
        }
    };

    const handleAddEmoji = (emoji) => {
        formik.setFieldValue("content", formik.values.content + " " + emoji);
        setShowEmojiPicker(false);
    };

    const handleAddLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    formik.setFieldValue(
                        "content",
                        `${formik.values.content} 📍 Location: ${latitude}, ${longitude}`
                    );
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    if (isLoading) {
        return "Loading...";
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <section>
                <StorySlider />
            </section>

            <section>
                <h1 className="py-5 text-2xl font-semibold text-gray-800 opacity-90">What's Happening</h1>
            </section>

            <section className="pb-10">
                <div className="flex space-x-4 items-start">
                    <Avatar
                        alt="username"
                        src={auth.user?.avatar || "https://img.icons8.com/?size=100&id=pETkiIKt6qBf&format=png&color=000000"}
                        className="w-14 h-14 border-2 border-gray-300"
                    />
                    <div className="w-full">
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="content"
                                    placeholder="What's happening?"
                                    className="w-full border p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...formik.getFieldProps("content")}
                                />
                                {formik.touched.content && formik.errors.content && (
                                    <span className="text-red-500 text-sm">{formik.errors.content}</span>
                                )}
                            </div>

                            {selectedImage && (
                                <div className="mt-4">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="rounded-md w-40 h-40 object-cover border border-gray-300 shadow-md hover:shadow-lg transition-all"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex space-x-5 items-center">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <ImageIcon className="text-[#1d9bf0]" />
                                        <input
                                            type="file"
                                            name="imageFile"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleSelectImage}
                                        />
                                    </label>

                                    {/* Location Icon */}
                                    <FmdGoodIcon
                                        className="text-[#1d9bf0] cursor-pointer"
                                        onClick={handleAddLocation}
                                    />

                                    {/* Emoji Picker */}
                                    <div className="relative">
                                        <TagFacesIcon
                                            className="text-[#1d9bf0] cursor-pointer"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        />
                                        {showEmojiPicker && (
                                            <div className="absolute bg-white border shadow-lg rounded-lg p-2 top-8 left-0 flex flex-wrap w-44">
                                                {emojis.map((emoji) => (
                                                    <span
                                                        key={emoji}
                                                        className="text-xl cursor-pointer m-1 hover:bg-gray-200 p-1 rounded"
                                                        onClick={() => handleAddEmoji(emoji)}
                                                    >
                                                        {emoji}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    sx={{
                                        width: "120px",
                                        borderRadius: "25px",
                                        paddingY: "10px",
                                        paddingX: "20px",
                                        bgcolor: "#1e88e5",
                                        '&:hover': { bgcolor: '#0d7bb5' }
                                    }}
                                    variant="contained"
                                    type="submit"
                                >
                                    Upload
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section>
                {loading ? (
                    <p className="text-gray-500 text-center font-semibold">Loading posts...</p>
                ) : posts?.length > 0 ? (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-gray-500">No posts available.</p>
                )}
            </section>
        </div>
    );
}

export default HomeSection;
