import { useEffect, useState } from 'react';

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) {
            setData(null);
            setError('url is required for an API call');
            setLoading(false);
            return;
        }

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, { credentials: 'include' });
                const result = await response.json();
                if (response.status >= 400) throw new Error(result.message);
                setData(result);
            } catch (err) {
                setError(err.message || 'something went wrong');
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);

    return { data, error, loading };
};
