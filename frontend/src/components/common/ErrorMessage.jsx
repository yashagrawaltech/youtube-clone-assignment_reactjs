import React from 'react';

const ErrorMessage = ({ message = 'something went wrong', onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center text-gray-900 px-4">
            {/* Clearer friendly face emoji SVG in YouTube theme colors */}
            <svg
                className="w-24 h-24 fill-red-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
            </svg>

            <p className="text-lg font-semibold">{message}</p>

            <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-md shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Retry loading content"
            >
                Retry
            </button>
        </div>
    );
};

export default ErrorMessage;
