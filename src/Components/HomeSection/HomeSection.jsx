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
import { getAllPosts } from '../../Store/Post/Action';

const validationSchema = Yup.object({
    content: Yup.string().required("Tweet text is required"),
});

function HomeSection() {
    const dispatch = useDispatch();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleSubmit = (values) => {
        console.log("values: ", values);
    };

    const formik = useFormik({
        initialValues: {
            content: "",
            image: "",
        },
        onSubmit: handleSubmit,
        validationSchema,
    });

    const handleSelectImage = (event) => {
        setUploadingImage(true);
        const imageFile = event.target.files[0];

        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            formik.setFieldValue("image", imageFile);
            setSelectedImage(imageUrl);
        }
        setUploadingImage(false);
    };

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    const posts = useSelector((state) => state.post.posts);

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
                        src="https://img.icons8.com/?size=100&id=pETkiIKt6qBf&format=png&color=000000"
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
                                {formik.errors.content && formik.touched.content && (
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
                                    <FmdGoodIcon className="text-[#1d9bf0]" />
                                    <TagFacesIcon className="text-[#1d9bf0]" />
                                </div>

                                <div>
                                    <Button
                                        sx={{
                                            width: "120px",
                                            borderRadius: "25px",
                                            paddingY: "10px",
                                            paddingX: "20px",
                                            bgcolor: "#1e88e5",
                                            '&:hover': {
                                                bgcolor: '#0d7bb5'
                                            }
                                        }}
                                        variant="contained"
                                        type="submit"
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section>
                {posts && posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-gray-500">No posts available.</p>
                )}
            </section>
        </div>
    );
}

export default HomeSection;
