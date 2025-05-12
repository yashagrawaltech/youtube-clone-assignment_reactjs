import { twMerge } from 'tailwind-merge';
import { fallbackImage } from '../../assets/utils/utils';
import { Link } from 'react-router-dom';

const VideoCard = ({
    videoObj,
    variant = 'vertical', // "vertical", "horizontal", "channel", or "edit"
    className = '',
}) => {
    const {
        title,
        thumbnailUrl,
        uploader,
        views,
        uploadDate,
        channelImg,
        _id,
    } = videoObj;

    // const navigate = useNavigate();

    const formatViews = (num) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M views';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K views';
        return num + ' views';
    };

    const formatDate = (dateStr) => {
        const uploadDate = new Date(dateStr);
        const now = new Date();
        const diffMs = now - uploadDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 30) return `${diffDays} days ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths === 1) return '1 month ago';
        if (diffMonths < 12) return `${diffMonths} months ago`;
        const diffYears = Math.floor(diffMonths / 12);
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
    };

    if (variant === 'horizontal') {
        return (
            <div
                className={twMerge(
                    'flex space-x-4 p-2 cursor-pointer hover:bg-gray-100 rounded-md',
                    className
                )}
            >
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-40 object-cover aspect-video flex-shrink-0 rounded-md"
                />
                <div className="flex flex-col gap-1">
                    <h3 className="text-md font-semibold line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">{uploader.username}</p>
                    <div className="text-xs text-gray-500">
                        <span>{formatViews(views)}</span> &bull;{' '}
                        <span>{formatDate(uploadDate)}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'channel') {
        return (
            <div className={twMerge('flex flex-col cursor-pointer', className)}>
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-md font-semibold mt-2 line-clamp-2">
                    {title}
                </h3>
                <div className="text-sm text-gray-600 mt-0.5">
                    {formatViews(views)} &bull; {formatDate(uploadDate)}
                </div>
            </div>
        );
    }

    if (variant === 'edit') {
        return (
            <div
                className={twMerge(
                    'w-full cursor-pointer',
                    'hover:bg-gray-50 p-2 rounded-md',
                    className
                )}
            >
                <div className="relative aspect-video rounded-md overflow-hidden">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
                <div className="mt-2 flex space-x-3 items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={channelImg || fallbackImage}
                            alt={uploader.username}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            loading="lazy"
                        />
                        <div>
                            <h3 className="text-md font-semibold line-clamp-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {uploader.username}
                            </p>
                            <div className="text-sm text-gray-500">
                                <span>{formatViews(views)}</span> &bull;{' '}
                                <span>{formatDate(uploadDate)}</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/edit-video/${_id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="button"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        );
    }

    // vertical variant (default)
    return (
        <div className={twMerge('w-full cursor-pointer', className)}>
            <div className="relative aspect-video rounded-md overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </div>
            <div className="mt-2 flex space-x-3">
                <img
                    src={channelImg || fallbackImage}
                    alt={uploader.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                />
                <div>
                    <h3 className="text-md font-semibold line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">{uploader.username}</p>
                    <div className="text-sm text-gray-500">
                        <span>{formatViews(views)}</span> &bull;{' '}
                        <span>{formatDate(uploadDate)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
