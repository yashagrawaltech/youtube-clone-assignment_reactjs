import { Link, Navigate } from 'react-router-dom';
import VideoCard from './VideoCard';
import { twMerge } from 'tailwind-merge';

const SAMPLE_DATA = [
    {
        videoId: 'video01',
        title: 'Learn React in 30 Minutes',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'A quick tutorial to get started with React.',
        channelId: 'channel01',
        uploader: 'user01',
        views: 15200,
        likes: 1023,
        dislikes: 45,
        uploadDate: '2024-09-20',
        comments: [
            {
                commentId: 'comment01',
                userId: 'user02',
                text: 'Great video! Very helpful.',
                timestamp: '2024-09-21T08:30:00Z',
            },
        ],
    },
    {
        videoId: 'video02',
        title: 'Mastering JavaScript Basics',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'An in-depth look at core JavaScript concepts.',
        channelId: 'channel02',
        uploader: 'user03',
        views: 20300,
        likes: 1430,
        dislikes: 30,
        uploadDate: '2024-09-15',
        comments: [
            {
                commentId: 'comment02',
                userId: 'user04',
                text: 'Very clear and concise!',
                timestamp: '2024-09-16T10:15:00Z',
            },
        ],
    },
    {
        videoId: 'video03',
        title: 'CSS Flexbox in 20 Minutes',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Learn how to use Flexbox for responsive layouts.',
        channelId: 'channel03',
        uploader: 'user05',
        views: 11750,
        likes: 980,
        dislikes: 25,
        uploadDate: '2024-09-10',
        comments: [
            {
                commentId: 'comment03',
                userId: 'user06',
                text: 'Flexbox made simple, thanks!',
                timestamp: '2024-09-11T14:20:00Z',
            },
        ],
    },
    {
        videoId: 'video04',
        title: 'Understanding Async/Await',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description:
            'A deep dive into asynchronous JavaScript with async/await.',
        channelId: 'channel04',
        uploader: 'user07',
        views: 18900,
        likes: 1105,
        dislikes: 40,
        uploadDate: '2024-09-12',
        comments: [
            {
                commentId: 'comment04',
                userId: 'user08',
                text: 'Helped me with my project.',
                timestamp: '2024-09-13T09:45:00Z',
            },
        ],
    },
    {
        videoId: 'video05',
        title: 'Getting Started with TypeScript',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Introduction to TypeScript and its benefits.',
        channelId: 'channel05',
        uploader: 'user09',
        views: 14300,
        likes: 920,
        dislikes: 15,
        uploadDate: '2024-09-18',
        comments: [
            {
                commentId: 'comment05',
                userId: 'user10',
                text: 'TypeScript is amazing, thanks for this!',
                timestamp: '2024-09-19T11:00:00Z',
            },
        ],
    },
    {
        videoId: 'video06',
        title: 'React Hooks Explained',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Understand how to use React Hooks effectively.',
        channelId: 'channel06',
        uploader: 'user11',
        views: 22000,
        likes: 1580,
        dislikes: 50,
        uploadDate: '2024-09-22',
        comments: [
            {
                commentId: 'comment06',
                userId: 'user12',
                text: 'Hooks are much clearer now!',
                timestamp: '2024-09-23T12:30:00Z',
            },
        ],
    },
    {
        videoId: 'video07',
        title: 'Building REST APIs with Node.js',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Learn to build scalable REST APIs using Node.js.',
        channelId: 'channel07',
        uploader: 'user13',
        views: 17500,
        likes: 1340,
        dislikes: 35,
        uploadDate: '2024-09-17',
        comments: [
            {
                commentId: 'comment07',
                userId: 'user14',
                text: 'Great API design tips.',
                timestamp: '2024-09-18T13:05:00Z',
            },
        ],
    },
    {
        videoId: 'video08',
        title: 'Vue.js Fundamentals',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Start your journey with Vue.js framework.',
        channelId: 'channel08',
        uploader: 'user15',
        views: 19850,
        likes: 1200,
        dislikes: 20,
        uploadDate: '2024-09-14',
        comments: [
            {
                commentId: 'comment08',
                userId: 'user16',
                text: 'Clear and beginner-friendly.',
                timestamp: '2024-09-15T07:50:00Z',
            },
        ],
    },
    {
        videoId: 'video09',
        title: 'Advanced Git Techniques',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Improve your Git workflow with advanced commands.',
        channelId: 'channel09',
        uploader: 'user17',
        views: 12900,
        likes: 900,
        dislikes: 10,
        uploadDate: '2024-09-19',
        comments: [
            {
                commentId: 'comment09',
                userId: 'user18',
                text: 'Git mastery unlocked!',
                timestamp: '2024-09-20T16:40:00Z',
            },
        ],
    },
    {
        videoId: 'video10',
        title: 'Intro to Docker for Developers',
        thumbnailUrl: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg ',
        description: 'Learn Docker fundamentals to containerize your apps.',
        channelId: 'channel10',
        uploader: 'user19',
        views: 16200,
        likes: 1400,
        dislikes: 28,
        uploadDate: '2024-09-21',
        comments: [
            {
                commentId: 'comment10',
                userId: 'user20',
                text: 'Very helpful for beginners.',
                timestamp: '2024-09-22T10:25:00Z',
            },
        ],
    },
];

const VideoGrid = ({ variant, className, videoData }) => {
    if (!videoData) {
        return null;
    }

    return (
        <div className={twMerge('', className)}>
            {videoData.map((v) => (
                <Link
                    onClick={(e) => e.stopPropagation()}
                    className="h-fit"
                    key={v._id}
                    to={`/watch/${v._id}`}
                >
                    <VideoCard
                        className=""
                        key={v._id}
                        variant={variant}
                        videoObj={v}
                    />
                </Link>
            ))}
        </div>
    );
};

export default VideoGrid;
