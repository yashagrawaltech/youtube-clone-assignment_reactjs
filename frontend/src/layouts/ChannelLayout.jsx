import { NavLink, Outlet, useParams } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { fallbackImage } from '../assets/utils/utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ChannelLayout = () => {
    const { id } = useParams();
    const { currentActiveChannelId } = useAuth();
    const [channelData, setChannelData] = useState(null);

    // console.log(id === currentActiveChannelId)

    const { data, error, loading } = useFetch(
        !id
            ? `${config.backend_url}/channel/${currentActiveChannelId}`
            : `${config.backend_url}/channel/${id}`
    );

    const menuItems = [
        { name: `Home`, path: '' },
        { name: `Videos`, path: `videos/` },
        { name: `Playlists`, path: `playlists/` },
        { name: `Channels`, path: `channels/` },
        { name: `Discussion`, path: `discussion/` },
        { name: `About`, path: `about/` },
    ];

    useEffect(() => {
        if (data) {
            setChannelData(data.data?.channel);
        }
    }, [data, error, loading]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    if (!data) return null;

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Banner */}
            <div
                className="w-full h-48 sm:h-56 md:h-64 relative bg-cover bg-center rounded-xl"
                style={{
                    backgroundImage: `url(${channelData?.channelBanner || fallbackImage})`,
                }}
            />

            {/* Channel Header */}
            <div className="relative mt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between">
                {/* Avatar + Info */}
                <div className="flex items-center space-x-4">
                    <img
                        src={channelData?.channelImage || fallbackImage}
                        alt="Channel avatar"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                    />
                    <div className="mt-4 sm:mt-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {channelData?.channelName || 'Channel Name'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {`@${channelData?.channelName?.toLowerCase().split(' ').join('') || 'channelhandle'}`}
                        </p>
                        <div className="text-gray-600 text-sm mt-1 space-x-2">
                            <span>
                                {channelData?.subscribers || '0 subscribers'}
                            </span>
                            <span>•</span>
                            <span>
                                {channelData?.videos?.length || 0} videos
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscribe Button */}
                {id && currentActiveChannelId ? (
                    currentActiveChannelId === id ? null : (
                        <button className="mt-6 sm:mt-0 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition text-sm font-medium">
                            Subscribe
                        </button>
                    )
                ) : currentActiveChannelId ? null : (
                    <button className="mt-6 sm:mt-0 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition text-sm font-medium">
                        Subscribe
                    </button>
                )}
            </div>

            {/* Channel Description */}
            {channelData?.description && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <p className="text-gray-700 text-sm sm:text-base max-w-3xl line-clamp-2">
                        {channelData.description}
                    </p>
                </div>
            )}

            {/* Tabs */}
            <nav className="mt-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="px-4 overflow-x-auto scrollbar-hide">
                    <ul className="flex space-x-6 text-sm sm:text-base font-semibold text-gray-700">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    end
                                    className={({ isActive }) =>
                                        `block pb-3 border-b-2 ${
                                            isActive
                                                ? 'border-black text-black'
                                                : 'border-transparent hover:text-black'
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Content */}
            <main className="py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default ChannelLayout;
