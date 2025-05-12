import Button from '../components/common/Button';
import VideoGrid from '../components/video/VideoGrid';
import { useFetch } from '../hooks/useFetch';
import config from '../../config';
import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const categories = [
    'All',
    'Demo-Video',
    'Music',
    'Gaming',
    'Education',
    'Entertainment',
    'News',
    'Sports',
    'Technology',
    'Travel',
    'Food',
    'Fashion',
    'Health',
    'Science',
    'Lifestyle',
];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [fetchUrl, setFetchUrl] = useState(`${config.backend_url}/video/`);
    const [videoData, setVideoData] = useState([]);
    const [localError, setLocalError] = useState(false);

    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
            setFetchUrl(
                `${config.backend_url}/video?category=${encodeURIComponent(
                    selectedCategory
                )}`
            );
        } else {
            setFetchUrl(`${config.backend_url}/video/`);
        }
    }, [selectedCategory]);

    const { data, error, loading } = useFetch(fetchUrl);

    useEffect(() => {
        setLocalError(false);
        if (error) {
            setLocalError(true);
            setVideoData([]);
            return;
        }
        if (!data || !data.data || !Array.isArray(data.data.videos)) {
            setLocalError(true);
            setVideoData([]);
            return;
        }
        setVideoData(data.data?.videos);
    }, [data, error]);

    const checkScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollContainerRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scrollByAmount = (amount) => {
        scrollContainerRef.current?.scrollBy({
            left: amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="pt-0 px-4 pb-4 w-full min-h-dvh relative">
            <div className="sticky bg-white z-10 top-14">
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        aria-label="Scroll categories left"
                        onClick={() => scrollByAmount(-200)}
                        className="absolute left-0 top-0 bottom-0 z-30 flex items-center px-2 bg-white cursor-pointer"
                    >
                        <svg
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        aria-label="Scroll categories right"
                        onClick={() => scrollByAmount(200)}
                        className="absolute right-0 top-0 bottom-0 z-30 flex items-center px-2 bg-white cursor-pointer"
                    >
                        <svg
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}

                {/* Fade overlays (outside scroll container!) */}
                {canScrollLeft && (
                    <div
                        className="pointer-events-none absolute left-10 top-0 bottom-0 w-16 z-20"
                        style={{
                            background:
                                'linear-gradient(to right, white, rgba(255,255,255,0))',
                        }}
                    />
                )}
                {canScrollRight && (
                    <div
                        className="pointer-events-none absolute right-10 top-0 bottom-0 w-16 z-20"
                        style={{
                            background:
                                'linear-gradient(to left, white, rgba(255,255,255,0))',
                        }}
                    />
                )}

                {/* Scroll container */}
                <div
                    ref={scrollContainerRef}
                    className="filters h-16 mb-2 hide-scrollbar py-4 flex items-center gap-4 overflow-x-auto overflow-y-hidden scroll-smooth"
                >
                    {categories.map((category, index) => (
                        <Button
                            key={`category-${index}`}
                            variant={
                                selectedCategory === category
                                    ? 'secondary'
                                    : 'outline'
                            }
                            className={'rounded-md flex-shrink-0'}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Remaining UI: loading, error, video grid */}
            {loading && (
                <div className="h-64 flex justify-center items-center">
                    <LoadingSpinner />
                </div>
            )}

            {localError && !loading && (
                <div className="h-64 flex justify-center items-center">
                    <ErrorMessage message="An error occurred while fetching videos or data is unavailable." />
                </div>
            )}

            {!loading && !localError && videoData.length > 0 && (
                <VideoGrid
                    videoData={videoData}
                    className={'grid sm:grid-cols-2 md:grid-cols-3 gap-4'}
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

export default Home;
