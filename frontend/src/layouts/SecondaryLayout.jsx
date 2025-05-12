import { useState } from 'react';
import Header from '../components/common/Header';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const SecondaryLayout = () => {
    const [showSideBar, setShowSidebar] = useState(false);
    const [sidebarHovered, setSidebarHovered] = useState(false);

    return (
        <div className="flex">
            <div className="min-h-dvh w-dvw overflow-clip flex flex-col relative">
                <header className="top-0 left-0 w-full sticky z-50">
                    <Header showSideBar={setShowSidebar} />
                </header>
                <main className="w-full flex">
                    {showSideBar ? (
                        <>
                            <div
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setSidebarHovered(true);
                                }}
                                onMouseLeave={() => setSidebarHovered(false)}
                                className={`absolute bg-white w-64 z-50`}
                            >
                                <div
                                    className={`sticky ${
                                        sidebarHovered
                                            ? 'show-scrollbar'
                                            : 'hide-scrollbar'
                                    } top-14 left-0 w-full max-h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0`}
                                >
                                    <Sidebar />
                                </div>
                            </div>
                        </>
                    ) : null}
                    <div className={`w-full`}>
                        <div>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SecondaryLayout;
