import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import VideoGrid from '../components/video/VideoGrid';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import config from '../../config';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const filters = ['All Videos', 'Most Popular', 'Recently Uploaded', 'Live'];

const ChannelVideos = () => {
    const { id } = useParams();
    const { currentActiveChannelId } = useAuth();

    const [selectedFilter, setSelectedFilter] = useState('All Videos');
    const [fetchUrl, setFetchUrl] = useState(
        `${config.backend_url}/channel/${id ? id : currentActiveChannelId}/videos/`
    );
    const [videoData, setVideoData] = useState([]);
    const [localError, setLocalError] = useState(false);

    useEffect(() => {
        setFetchUrl(
            `${config.backend_url}/channel/${id ? id : currentActiveChannelId}/videos/`
        );
    }, [currentActiveChannelId, id]);

    useEffect(() => {
        let url = `${config.backend_url}/channel/${id ? id : currentActiveChannelId}/videos/`;

        if (selectedFilter === 'Most Popular') {
            url += '?sort=views';
        } else if (selectedFilter === 'Recently Uploaded') {
            url += '?sort=recent';
        } else if (selectedFilter === 'Live') {
            url += '?filter=live';
        }

        setFetchUrl(url);
    }, [selectedFilter, currentActiveChannelId, id]);

    const { data, error, loading } = useFetch(fetchUrl);

    useEffect(() => {
        setLocalError(false);
        if (error || !data || !data.data || !Array.isArray(data.data.videos)) {
            setLocalError(true);
            setVideoData([]);
            return;
        }
        setVideoData(data.data.videos);
    }, [data, error]);

    return (
        <div className="pt-1 pb-6 w-full min-h-[400px] relative">
            {/* Filter Tabs */}
            <div className="flex gap-3 mt-1 mb-4 pb-2 overflow-x-auto">
                {filters.map((filter) => (
                    <Button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        variant={
                            selectedFilter === filter ? 'secondary' : 'outline'
                        }
                        className="px-4 py-1 rounded-full whitespace-nowrap"
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            {/* Content */}
            {loading && (
                <div className="h-64 flex justify-center items-center">
                    <LoadingSpinner />
                </div>
            )}

            {localError && !loading && (
                <div className="h-64 flex justify-center items-center">
                    <ErrorMessage message="Failed to load videos. Please try again later." />
                </div>
            )}

            {!loading && !localError && videoData.length > 0 && (
                <VideoGrid
                    variant={
                        id === currentActiveChannelId || !id
                            ? 'edit'
                            : 'channel'
                    }
                    videoData={videoData}
                    className={
                        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    }
                />
            )}

            {!loading && !localError && videoData.length === 0 && (
                <div className="h-64 flex justify-center items-center text-gray-500">
                    No videos found.
                </div>
            )}
        </div>
    );
};

export default ChannelVideos;
