import { useState, useCallback } from 'react';

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const request = useCallback(
        async (
            url,
            method = 'GET',
            body = null,
            headers = { 'Content-Type': 'application/json' },
        ) => {
            setLoading(true);

            try {
                const res = await fetch(url, {
                    method,
                    headers,
                    body,
                });

                if (!res.ok) {
                    throw new Error(
                        `Could fetch ${url}, status: ${res.status}`,
                    );
                }

                const data = await res.json();
                setLoading(false);

                return data;
            } catch (e) {
                setLoading(false);
                setError(e.message);
                throw e;
            }
        },
        [],
    );

    const clearError = useCallback(() => setError(null), []);

    return { loading, error, request, clearError };
};

export default useHttp;
