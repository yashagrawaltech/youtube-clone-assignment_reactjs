import { useState, useEffect } from 'react';
import VideoGrid from '../components/video/VideoGrid';
import Button from '../components/common/Button';
import { useFetch } from '../hooks/useFetch';
import config from '../../config';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import axios from 'axios';
import { fallbackImage } from '../assets/utils/utils';

const VideoPlayer = () => {
    const { id } = useParams();

    // States for video, related videos, and comments
    const [videoData, setVideoData] = useState(null);
    const [videosData, setVideosData] = useState([]);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [commentInput, setCommentInput] = useState('');
    const [showAllComments, setShowAllComments] = useState(false); // New state for showing all comments

    // Error state flags
    const [videoDataError, setVideoDataError] = useState(false);
    const [videosDataError, setVideosDataError] = useState(false);

    // Fetch video by id
    const {
        data: videoApiData,
        error: videoApiError,
        loading: videoApiLoading,
    } = useFetch(`${config.backend_url}/video/${id}`);

    // Fetch all videos for sidebar
    const {
        data: videosApiData,
        error: videosApiError,
        loading: videosApiLoading,
    } = useFetch(`${config.backend_url}/video/`);

    // Validate and set video data or error
    useEffect(() => {
        setVideoDataError(false);

        if (videoApiError) {
            setVideoData(null);
            setComments([]);
            setVideoDataError(true);
            return;
        }

        if (
            !videoApiLoading &&
            (!videoApiData ||
                !videoApiData?.data ||
                !videoApiData?.data?.video ||
                typeof videoApiData?.data?.video !== 'object')
        ) {
            setVideoData(null);
            setComments([]);
            setVideoDataError(true);
            return;
        }

        const video = videoApiData?.data?.video;
        setVideoData(video);
        setComments(video?.comments || []);
        setLikes(video?.likes);
    }, [videoApiData, videoApiError, videoApiLoading]);

    // Validate and set related videos data or error
    useEffect(() => {
        setVideosDataError(false);

        if (videosApiError) {
            setVideosData([]);
            setVideosDataError(true);
            return;
        }

        if (
            !videosApiLoading &&
            (!videosApiData ||
                !videosApiData?.data ||
                !Array.isArray(videosApiData?.data?.videos))
        ) {
            setVideosData([]);
            setVideosDataError(true);
            return;
        }

        setVideosData(videosApiData?.data?.videos);
    }, [videosApiData, videosApiError, videosApiLoading]);

    // Handle comment submit
    const handleCommentSubmit = async () => {
        if (commentInput.trim()) {
            setComments((prev) => [...prev, { text: commentInput }]);
            try {
                await axios.post(
                    `${config.backend_url}/comment/add`,
                    {
                        text: commentInput.trim(),
                        videoId: videoData?._id,
                    },
                    { withCredentials: true }
                );
                setCommentInput('');
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleLike = async () => {
        try {
            await axios.put(
                `${config.backend_url}/video/${videoData._id}/like`,
                {},
                { withCredentials: true }
            );
            setLikes((prev) => prev + 1);
        } catch (error) {
            console.error('Error liking the video:', error);
        }
    };

    const handleDislike = async () => {
        try {
            await axios.put(
                `${config.backend_url}/video/${videoData._id}/dislike`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Error disliking the video:', error);
        }
    };

    return (
        <div className="lg:flex gap-4 w-full p-4 xl:px-28 min-h-dvh">
            <div className="lg:w-[70%]">
                {videoApiLoading && <LoadingSpinner />}

                {videoDataError && !videoApiLoading && (
                    <ErrorMessage message="Unable to load video data. Please try again later." />
                )}

                {!videoApiLoading && !videoDataError && videoData && (
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full p-2">
                            <video
                                controls
                                autoPlay={false}
                                className="w-full aspect-video bg-red-200 rounded-lg"
                                src={videoData?.videoUrl}
                            />
                        </div>
                        <h1 className="text-xl font-semibold line-clamp-2 -mt-3 pl-2 pr-1">
                            {videoData?.title}
                        </h1>
                        <div className="w-full flex lg:flex-row flex-col gap-4 lg:justify-between lg:items-center pl-2 pr-1">
                            <div className="left flex items-center gap-4">
                                <Link
                                    className="flex"
                                    to={`/channel/${videoData?.channelId?._id}`}
                                >
                                    <img
                                        className="w-12 h-12 rounded-full object-cover object-center"
                                        src={
                                            videoData?.uploader?.avatar ||
                                            fallbackImage
                                        }
                                        alt="channel-thumbnail"
                                    />
                                </Link>
                                <div className="flex flex-col">
                                    <Link
                                        to={`/channel/${videoData?.channelId?._id}`}
                                        className="text-base font-semibold"
                                    >
                                        {videoData?.channelId?.channelName}
                                    </Link>
                                    <span className="text-xs">
                                        1.51M subscribers
                                    </span>
                                </div>
                                <Button>Subscribe</Button>
                            </div>

                            <div className="right flex gap-4 overflow-x-auto items-center lg:justify-end">
                                <Button className={'flex gap-3'}>
                                    <span
                                        onClick={handleLike}
                                        className="flex items-center gap-1"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
                                        </svg>
                                        {likes}
                                    </span>
                                    <hr className="border border-gray-300 rotate-180 h-full" />
                                    <span onClick={handleDislike}>
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M9.40017 16H3C1.89543 16 1 15.1046 1 14V11.8957C1 11.6344 1.05118 11.3757 1.15064 11.1342L4.24501 3.61925C4.3993 3.24455 4.76447 3 5.16969 3H22C22.5523 3 23 3.44772 23 4V14C23 14.5523 22.5523 15 22 15H18.5182C18.1932 15 17.8886 15.1579 17.7012 15.4233L12.2478 23.149C12.1053 23.3508 11.8367 23.4184 11.6157 23.3078L9.80163 22.4008C8.74998 21.875 8.20687 20.6874 8.49694 19.548L9.40017 16ZM17 13.4125V5H5.83939L3 11.8957V14H9.40017C10.7049 14 11.6602 15.229 11.3384 16.4934L10.4351 20.0414C10.3771 20.2693 10.4857 20.5068 10.6961 20.612L11.3572 20.9425L16.0673 14.27C16.3172 13.9159 16.6366 13.6257 17 13.4125ZM19 13H21V5H19V13Z"></path>
                                        </svg>
                                    </span>
                                </Button>
                                <Button className={'flex items-center gap-2'}>
                                    <svg
                                        className="w-5 h-5 text-gray-500 shrink-0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path>
                                    </svg>
                                    Share
                                </Button>
                                <Button className={'flex items-center gap-2'}>
                                    <svg
                                        className="w-5 h-5 text-gray-500 shrink-0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M3 19H21V21H3V19ZM13 13.1716L19.0711 7.1005L20.4853 8.51472L12 17L3.51472 8.51472L4.92893 7.1005L11 13.1716V2H13V13.1716Z"></path>
                                    </svg>
                                    Download
                                </Button>
                                <Button
                                    className={
                                        'flex items-center gap-2 w-10 h-10'
                                    }
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 shrink-0 rotate-90"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 3C11.175 3 10.5 3.675 10.5 4.5C10.5 5.325 11.175 6 12 6C12.825 6 13.5 5.325 13.5 4.5C13.5 3.675 12.825 3 12 3ZM12 18C11.175 18 10.5 18.675 10.5 19.5C10.5 20.325 11.175 21 12 21C12.825 21 13.5 20.325 13.5 19.5C13.5 18.675 12.825 18 12 18ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="description-section p-2">
                            <h2 className="text-lg font-semibold">
                                Description
                            </h2>
                            <p className="line-clamp-3">
                                {videoData?.description}
                            </p>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section p-2">
                            <h2 className="text-lg font-semibold">Comments</h2>
                            <div className="comment-input flex gap-2">
                                <input
                                    type="text"
                                    value={commentInput}
                                    onChange={(e) =>
                                        setCommentInput(e.target.value)
                                    }
                                    placeholder="Add a comment..."
                                    className="flex-1 border p-2 rounded"
                                />
                                <Button onClick={handleCommentSubmit}>
                                    Post
                                </Button>
                            </div>
                            <div className="comments-list mt-2 space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        No comments yet. Be the first to
                                        comment!
                                    </p>
                                ) : (
                                    comments
                                        .slice(
                                            0,
                                            showAllComments
                                                ? comments.length
                                                : 2
                                        )
                                        .map((comment, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3 p-3 border-b border-gray-300"
                                            >
                                                <img
                                                    src={`https://i.pravatar.cc/40?img=${index + 1}`}
                                                    alt="user avatar"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">
                                                            User {index + 1}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            2 hours ago
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">
                                                        {comment?.text ||
                                                            comment}
                                                    </p>
                                                    <div className="flex gap-6 mt-2 text-xs text-gray-600">
                                                        <button className="hover:text-black">
                                                            Like
                                                        </button>
                                                        <button className="hover:text-black">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                                {comments.length > 2 && !showAllComments && (
                                    <button
                                        className="mt-2 text-blue-500"
                                        onClick={() => setShowAllComments(true)}
                                    >
                                        See all comments
                                    </button>
                                )}
                                {showAllComments && (
                                    <button
                                        className="mt-2 text-blue-500"
                                        onClick={() =>
                                            setShowAllComments(false)
                                        }
                                    >
                                        Show less comments
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {videosDataError && !videosApiLoading && (
                    <ErrorMessage message="Unable to load related videos." />
                )}
            </div>

            <div className="lg:w-[30%]">
                {!videosApiLoading &&
                    !videosDataError &&
                    videosData?.length > 0 && (
                        <VideoGrid
                            videoData={videosData}
                            variant="horizontal"
                        />
                    )}
            </div>
        </div>
    );
};

export default VideoPlayer;
