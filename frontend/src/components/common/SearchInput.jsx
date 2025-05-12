import { useState, useEffect, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import config from '../../../config';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const SearchSuggestions = ({ suggestions, error, className, show }) => {
    if (!show) return null;

    return (
        <div
            className={twMerge(
                'bg-white/90 py-4 backdrop-blur-2xl rounded-md flex flex-col gap-4',
                className
            )}
        >
            {error ? (
                <div className="px-4 text-red-600">{error}</div>
            ) : suggestions.length === 0 ? (
                <div className="px-4 text-gray-500">Searching...</div>
            ) : (
                suggestions.map((result) => (
                    <Link to={`/`} replace={true}>
                        <div
                            key={result._id}
                            className="flex items-center w-full gap-4 hover:bg-gray-300 py-2 px-4 cursor-pointer"
                        >
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                            </svg>
                            {result.title}
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

const SearchInput = ({ className }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);

    const searchSuggestionRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchSuggestionRef.current &&
                !searchSuggestionRef.current.contains(e.target)
            ) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce input (DSA-like optimization)
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const searchVideos = async (searchTerm) => {
        if (!searchTerm.trim()) return setResults([]);

        try {
            setError('');
            const res = await fetch(
                `${config.backend_url}/video/search?title=${encodeURIComponent(searchTerm)}`
            );
            const data = await res.json();
            setResults(data.data.videos || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch results.');
            setResults([]);
        }
    };

    // Memoized debounced function
    const debouncedSearch = useCallback(
        debounce((val) => {
            searchVideos(val);
        }, 500),
        [searchVideos]
    );

    useEffect(() => {
        if (query) {
            setShowSuggestions(true);
            debouncedSearch(query);
        } else {
            setShowSuggestions(false);
            setResults([]);
        }
    }, [query]);

    return (
        <div
            className={twMerge('relative w-full', className)}
            ref={searchSuggestionRef}
        >
            <svg
                className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
            </svg>
            <input
                type="text"
                placeholder="Search"
                value={query}
                onClick={() => setSearchOpen((prev) => !prev)}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 rounded-full border-2 border-gray-400 focus:outline-2 focus:outline-red-600 focus:border-transparent text-gray-900 text-sm"
                aria-label="Search"
            />
            {searchOpen && (
                <SearchSuggestions
                    suggestions={results}
                    error={error}
                    show={showSuggestions}
                    className="absolute top-full mt-2 w-full"
                />
            )}
        </div>
    );
};

export default SearchInput;
