import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <svg
                className="animate-spin h-12 w-12 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
                role="img"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#FF0000"
                    strokeWidth="4"
                    fill="#fff"
                    strokeLinecap="round"
                />
                <path
                    className="opacity-75"
                    fill="#FF0000"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
            </svg>
        </div>
    );
};

export default LoadingSpinner;
