import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProtectedRoute, {
    ChannelOnlyRoute,
    PublicOnlyRoute,
} from './contexts/ProtectedRoute';
import Auth from './pages/Auth';
import ChannelLayout from './layouts/ChannelLayout';
import SecondaryLayout from './layouts/SecondaryLayout';
import VideoPlayer from './pages/VideoPlayer';
import UploadVideo from './pages/UploadVideo';
import CreateChannel from './pages/CreateChannel';
import ChannelVideos from './pages/ChannelVideos';
import EditVideo from './pages/EditVideo';

const router = createBrowserRouter([
    {
        path: '',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'channel',
                element: (
                    <ChannelOnlyRoute>
                        <ChannelLayout />
                    </ChannelOnlyRoute>
                ),
                children: [
                    {
                        path: '',
                        element: <></>,
                    },
                    {
                        path: 'videos',
                        element: <ChannelVideos />,
                    },

                    {
                        path: 'playlists',
                        element: <></>,
                    },

                    {
                        path: 'channels',
                        element: <></>,
                    },

                    {
                        path: 'discussion',
                        element: <></>,
                    },

                    {
                        path: 'about',
                        element: <></>,
                    },
                ],
            },
            {
                path: 'channel/:id',
                element: <ChannelLayout />,
                children: [
                    {
                        path: '',
                        element: <></>,
                    },

                    {
                        path: 'videos',
                        element: <ChannelVideos />,
                    },

                    {
                        path: 'playlists',
                        element: <></>,
                    },

                    {
                        path: 'channels',
                        element: <></>,
                    },

                    {
                        path: 'discussion',
                        element: <></>,
                    },

                    {
                        path: 'about',
                        element: <></>,
                    },
                ],
            },
            {
                path: 'upload',
                element: (
                    <ChannelOnlyRoute>
                        <UploadVideo />
                    </ChannelOnlyRoute>
                ),
            },
            {
                path: 'edit-video/:id',
                element: (
                    <ChannelOnlyRoute>
                        <EditVideo />
                    </ChannelOnlyRoute>
                ),
            },
            {
                path: '/create-channel',
                element: (
                    <ProtectedRoute>
                        <CreateChannel />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/watch',
        element: <SecondaryLayout />,
        children: [
            {
                path: ':id',
                element: <VideoPlayer />,
            },
        ],
    },
    {
        path: '/auth',
        element: (
            <PublicOnlyRoute>
                <Auth />
            </PublicOnlyRoute>
        ),
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
