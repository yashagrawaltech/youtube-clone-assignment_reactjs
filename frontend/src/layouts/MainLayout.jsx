import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import MiniSidebar from '../components/common/MiniSidebar';

const BottomNav = () => {
    return (
        <nav className="fixed z-50 bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around p-2 md:hidden">
            <Link to="/" className="flex flex-col items-center">
                <span className="material-icons">
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM13 19H18V9.15745L12 3.7029L6 9.15745V19H11V13H13V19Z"></path>
                    </svg>
                </span>
                <span className="text-xs">Home</span>
            </Link>
            <Link to="/" className="flex flex-col items-center">
                <span className="material-icons">
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                    </svg>
                </span>
                <span className="text-xs">Search</span>
            </Link>
            <Link to="/" className="flex flex-col items-center">
                <span className="material-icons">
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM8.50488 14.0027H14.0049C14.281 14.0027 14.5049 13.7789 14.5049 13.5027C14.5049 13.2266 14.281 13.0027 14.0049 13.0027H10.0049C8.62417 13.0027 7.50488 11.8835 7.50488 10.5027C7.50488 9.12203 8.62417 8.00275 10.0049 8.00275H11.0049V6.00275H13.0049V8.00275H15.5049V10.0027H10.0049C9.72874 10.0027 9.50488 10.2266 9.50488 10.5027C9.50488 10.7789 9.72874 11.0027 10.0049 11.0027H14.0049C15.3856 11.0027 16.5049 12.122 16.5049 13.5027C16.5049 14.8835 15.3856 16.0027 14.0049 16.0027H13.0049V18.0027H11.0049V16.0027H8.50488V14.0027Z"></path>
                    </svg>
                </span>
                <span className="text-xs">Subscriptions</span>
            </Link>
            <Link to="/channel" className="flex flex-col items-center">
                <span className="material-icons">
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M4 19V5H9.58579L11.5858 7H20V19H4ZM21 5H12.4142L10.4142 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V6C22 5.44772 21.5523 5 21 5ZM15.0008 12.667L10.1219 9.41435C10.0562 9.37054 9.979 9.34717 9.9 9.34717C9.6791 9.34717 9.5 9.52625 9.5 9.74717V16.2524C9.5 16.3314 9.5234 16.4086 9.5672 16.4743C9.6897 16.6581 9.9381 16.7078 10.1219 16.5852L15.0008 13.3326C15.0447 13.3033 15.0824 13.2656 15.1117 13.2217C15.2343 13.0379 15.1846 12.7895 15.0008 12.667Z"></path>
                    </svg>
                </span>
                <span className="text-xs">Library</span>
            </Link>
        </nav>
    );
};

const Main = ({ showSideBar }) => {
    const [sidebarHovered, setSidebarHovered] = useState(false);

    return (
        <main className="w-full grid grid-cols-15 z-40">
            <aside
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setSidebarHovered(true);
                }}
                onMouseLeave={() => setSidebarHovered(false)}
                className={`${showSideBar ? 'lg:col-span-3 absolute h-full lg:relative z-50 w-[70dvw] md:w-[30dvw] lg:w-auto bg-white' : 'lg:col-span-1 hidden lg:flex'}`}
            >
                {showSideBar ? (
                    <div
                        className={`sticky ${
                            sidebarHovered ? 'show-scrollbar' : 'hide-scrollbar'
                        } top-14 left-0 pb-24 w-full max-h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0`}
                    >
                        <Sidebar />
                    </div>
                ) : (
                    <div
                        onMouseEnter={(e) => {
                            e.stopPropagation();
                            setSidebarHovered(true);
                        }}
                        onMouseLeave={() => setSidebarHovered(false)}
                        className={`sticky ${
                            sidebarHovered ? 'show-scrollbar' : 'hide-scrollbar'
                        } top-14 left-0 w-full max-h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0`}
                    >
                        <MiniSidebar />
                    </div>
                )}
            </aside>
            <div
                className={`${showSideBar ? 'lg:col-span-12' : 'lg:col-span-14'} col-span-15 pb-14`}
            >
                <div>
                    <Outlet />
                </div>
            </div>
            <BottomNav />
        </main>
    );
};

const MainLayout = () => {
    const [showSideBar, setShowSidebar] = useState(true);

    return (
        <div className="flex">
            <div className="min-h-dvh w-dvw overflow-clip flex flex-col relative">
                <header className="top-0 left-0 w-full sticky z-50">
                    <Header showSideBar={setShowSidebar} />
                </header>
                <Main showSideBar={showSideBar} />
            </div>
        </div>
    );
};

export default MainLayout;
