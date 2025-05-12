import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import SearchInput from './SearchInput';
import { useAuth } from '../../contexts/AuthContext';
import { fallbackImage } from '../../assets/utils/utils';
import { useFetch } from '../../hooks/useFetch';
import config from '../../../config';

const OverlayMenu = () => {
    const { currentActiveChannelId, user } = useAuth();

    const [name, setName] = useState(user.username);

    const { data, loading } = useFetch(
        `${config.backend_url}/channel/${currentActiveChannelId}`
    );

    useEffect(() => {
        if (!loading && data && data.data && data.data.channel) {
            setName(data.data.channel.channelName);
        }
    }, [loading, data]);

    return (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={fallbackImage}
                    alt="user"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                        {name}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                    <Link
                        to="/channel"
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        View your channel
                    </Link>
                </div>
            </div>

            <ul className="text-sm text-gray-700">
                <li>
                    <Link to="" className="block px-4 py-2 hover:bg-gray-100">
                        YouTube Studio
                    </Link>
                </li>
                <li>
                    <Link to="" className="block px-4 py-2 hover:bg-gray-100">
                        Switch account
                    </Link>
                </li>
                <li>
                    <Link to="" className="block px-4 py-2 hover:bg-gray-100">
                        Settings
                    </Link>
                </li>
                <li>
                    <Link
                        to="/signout"
                        className="block px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                        Sign out
                    </Link>
                </li>
            </ul>
        </div>
    );
};

const Nav = () => {
    const { isAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="hidden md:block">
            {isAuthenticated ? (
                <div className="flex items-center justify-end gap-4">
                    <Link to={'/upload'}>
                        <Button className={'gap-1 pr-4 pl-3'}>
                            <svg
                                className="w-5 h-5 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                            </svg>
                            Create
                        </Button>
                    </Link>

                    <Button variant="ghost" className={'w-10'}>
                        <svg
                            className="w-6 h-6 shrink-0 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M20 17H22V19H2V17H4V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V17ZM18 17V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V17H18ZM9 21H15V23H9V21Z"></path>
                        </svg>
                    </Button>

                    <div
                        className="relative flex items-center justify-center"
                        ref={menuRef}
                    >
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:ring-2 ring-gray-300 transition"
                        >
                            <img
                                className="w-full h-full object-cover object-center"
                                src={fallbackImage}
                                alt="user avatar"
                            />
                        </button>

                        {menuOpen && <OverlayMenu />}
                    </div>
                </div>
            ) : (
                <Link to="/auth">
                    <Button className={'text-blue-600 gap-1 px-2 font-medium'}>
                        <svg
                            className="w-6 h-6 shrink-0 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 16C10.1243 16 8.29182 16.8687 7.01276 18.2556C8.38039 19.3474 10.114 20 12 20C13.9695 20 15.7727 19.2883 17.1666 18.1081C15.8956 16.8074 14.1219 16 12.1597 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.8106 4.6015 15.4807 5.61557 16.8214C7.25639 15.0841 9.58144 14 12.1597 14C14.6441 14 16.8933 15.0066 18.5218 16.6342C19.4526 15.3267 20 13.7273 20 12C20 7.58172 16.4183 4 12 4ZM12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5ZM12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7Z"></path>
                        </svg>{' '}
                        Sign in
                    </Button>
                </Link>
            )}
        </nav>
    );
};

const Header = ({ showSideBar }) => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="flex w-full items-center justify-between gap-8 px-2 md:px-8 bg-white h-14">
            <span className="flex gap-4 shrink-0 menu items-center">
                <Button variant="ghost" className={'w-10'}>
                    <svg
                        onClick={() => showSideBar((p) => !p)}
                        className="w-6 h-6 shrink-0 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                    </svg>
                </Button>
                <Link
                    className={`${showSearch ? 'hidden md:flex' : 'flex'} flex`}
                    to="/"
                >
                    <img
                        className="h-6 shrink-0 object-contain"
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                        alt="youtube-logo"
                    />
                </Link>
            </span>

            <div className="w-full lg:max-w-md justify-end flex gap-4">
                <SearchInput
                    className={`${showSearch ? 'flex' : 'hidden md:flex'}`}
                />
                <Button
                    onClick={() => setShowSearch((p) => !p)}
                    variant="secondary"
                    className={'w-10 md:hidden'}
                >
                    <svg
                        className="w-5 h-5 shrink-0 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                    </svg>
                </Button>
                <Button variant="secondary" className={'w-10 hidden sm:flex'}>
                    <svg
                        className="w-5 h-5 shrink-0 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12.0001 1C14.7615 1 17.0001 3.23858 17.0001 6V12C17.0001 14.7614 14.7615 17 12.0001 17C9.23865 17 7.00008 14.7614 7.00008 12V6C7.00008 3.23858 9.23865 1 12.0001 1ZM2.19238 13.9615L4.15392 13.5692C4.88321 17.2361 8.11888 20 12.0001 20C15.8813 20 19.1169 17.2361 19.8462 13.5692L21.8078 13.9615C20.8961 18.5452 16.8516 22 12.0001 22C7.14858 22 3.104 18.5452 2.19238 13.9615Z"></path>
                    </svg>
                </Button>
            </div>

            <Nav />
        </div>
    );
};

export default Header;
