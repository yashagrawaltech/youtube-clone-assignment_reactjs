import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EditVideo = ({ className }) => {
    const { id } = useParams();
    const { currentActiveChannelId } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState(false);

    // Fetch video details using useFetch
    const fetchUrl = `${config.backend_url}/video/${id}`;
    const {
        data: video,
        error: fetchError,
        loading: fetchLoading,
    } = useFetch(fetchUrl);

    useEffect(() => {
        const videoData = video?.data?.video;

        if (videoData) {
            setTitle(videoData.title);
            setDescription(videoData.description);
        }
        if (fetchError) {
            setLocalError(true);
        }
    }, [video, fetchError]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess(null);
        setLoading(true);
        const updateUrl = `${config.backend_url}/video/${id}`;
        const requestBody = {
            title,
            description,
            channelId: currentActiveChannelId,
        };
        try {
            await axios.put(updateUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess('Video updated successfully!');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors.map((e) => e.msg));
            } else {
                setErrors(['Something went wrong while updating the video.']);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            setLoading(true);
            const deleteUrl = `${config.backend_url}/video/${id}`;
            try {
                await axios.delete(deleteUrl);
                setSuccess('Video deleted successfully!');
                // Optionally redirect or update state
            } catch (error) {
                setErrors([error.message || 'Failed to delete video.']);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={twMerge('p-4 lg:px-28', className)}>
            <div className="w-full bg-white border border-gray-300 rounded-xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Edit Video
                </h2>

                {fetchLoading && (
                    <div className="h-64 flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                )}

                {localError && !fetchLoading && (
                    <div className="h-64 flex justify-center items-center">
                        <ErrorMessage message="An error occurred while fetching video details." />
                    </div>
                )}

                {!fetchLoading && !localError && (
                    <form onSubmit={handleUpdate} className="space-y-6">
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
                            disabled={loading || fetchLoading}
                            className={`w-full py-3 rounded-md font-semibold text-white flex justify-center items-center gap-2 transition-colors duration-300 ${
                                !loading
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-red-300 cursor-not-allowed'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Video'}
                        </button>
                    </form>
                )}

                {!fetchLoading && !localError && (
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className={`mt-4 w-full py-3 rounded-md font-semibold text-white flex justify-center items-center gap-2 transition-colors duration-300 ${
                            !loading
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-red-300 cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Deleting...' : 'Delete Video'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EditVideo;
