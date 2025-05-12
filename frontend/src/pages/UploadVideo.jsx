import { useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';

const UploadVideo = ({ className }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const { currentActiveChannelId } = useAuth();

    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('channelId', currentActiveChannelId);
        if (thumbnailFile) formData.append('thumbnailFile', thumbnailFile);
        if (videoFile) formData.append('videoFile', videoFile);

        try {
            await axios.post(`${config.backend_url}/video/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Video uploaded successfully!');
            setTitle('');
            setDescription('');
            setCategory('');
            setThumbnailFile(null);
            setVideoFile(null);
            window.location.reload();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors.map((e) => e.msg));
            } else {
                setErrors(['Something went wrong, please try again.']);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={twMerge('p-4 lg:px-28', className)}>
            <div className="w-full bg-white border border-gray-300 rounded-xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Upload New Video
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-600"
                            placeholder="Video title"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-600 resize-none"
                            placeholder="Describe your video..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-600"
                            placeholder="e.g. Education, Entertainment"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Thumbnail (JPG/PNG, max 5MB)
                        </label>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file.size > 5 * 1024 * 1024) {
                                    setErrors([
                                        'Thumbnail must be less than 5MB',
                                    ]);
                                    e.target.value = ''; // Clear invalid file
                                    return;
                                }
                                setThumbnailFile(file);
                                setErrors([]); // Clear previous errors if any
                            }}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Video File (MP4/WEBM/OGG, max 10MB)
                        </label>
                        <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file.size > 10 * 1024 * 1024) {
                                    setErrors([
                                        'Video file must be less than 10MB',
                                    ]);
                                    e.target.value = ''; // Clear invalid file
                                    return;
                                }
                                setVideoFile(file);
                                setErrors([]); // Clear previous errors if any
                            }}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className="text-sm text-red-600">
                            <ul className="list-disc list-inside">
                                {errors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {success && (
                        <p className="text-sm text-green-600">{success}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-md font-semibold text-white flex justify-center items-center gap-2 transition-colors duration-300 ${
                            !loading
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-red-300 cursor-not-allowed'
                        }`}
                    >
                        {loading && (
                            <svg
                                className="w-5 h-5 fill-white animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path d="M11.9995 2C12.5518 2 12.9995 2.44772 12.9995 3V6C12.9995 6.55228 12.5518 7 11.9995 7C11.4472 7 10.9995 6.55228 10.9995 6V3C10.9995 2.44772 11.4472 2 11.9995 2ZM11.9995 17C12.5518 17 12.9995 17.4477 12.9995 18V21C12.9995 21.5523 12.5518 22 11.9995 22C11.4472 22 10.9995 21.5523 10.9995 21V18C10.9995 17.4477 11.4472 17 11.9995 17ZM20.6597 7C20.9359 7.47829 20.772 8.08988 20.2937 8.36602L17.6956 9.86602C17.2173 10.1422 16.6057 9.97829 16.3296 9.5C16.0535 9.02171 16.2173 8.41012 16.6956 8.13398L19.2937 6.63397C19.772 6.35783 20.3836 6.52171 20.6597 7ZM7.66935 14.5C7.94549 14.9783 7.78161 15.5899 7.30332 15.866L4.70525 17.366C4.22695 17.6422 3.61536 17.4783 3.33922 17C3.06308 16.5217 3.22695 15.9101 3.70525 15.634L6.30332 14.134C6.78161 13.8578 7.3932 14.0217 7.66935 14.5ZM20.6597 17C20.3836 17.4783 19.772 17.6422 19.2937 17.366L16.6956 15.866C16.2173 15.5899 16.0535 14.9783 16.3296 14.5C16.6057 14.0217 17.2173 13.8578 17.6956 14.134L20.2937 15.634C20.772 15.9101 20.9359 16.5217 20.6597 17ZM7.66935 9.5C7.3932 9.97829 6.78161 10.1422 6.30332 9.86602L3.70525 8.36602C3.22695 8.08988 3.06308 7.47829 3.33922 7C3.61536 6.52171 4.22695 6.35783 4.70525 6.63397L7.30332 8.13398C7.78161 8.41012 7.94549 9.02171 7.66935 9.5Z"></path>
                            </svg>
                        )}
                        {loading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadVideo;
