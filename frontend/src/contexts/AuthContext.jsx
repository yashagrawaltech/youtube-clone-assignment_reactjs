import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

axios.defaults.withCredentials = true; // ✅ Important: send cookies with every request

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [currentActiveChannelId, setCurrentActiveChannelId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(currentActiveChannelId);

    const fetchUser = async () => {
        setError(null);
        setLoading(true);
        try {
            const { data } = await axios.get(`${config.backend_url}/user/`);
            setUser(data.data.user);
            setCurrentActiveChannelId(data.data.user.channels[0]);
        } catch (err) {
            console.log(err.response?.data?.message);
            setError(err.response?.data?.message || err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            await axios.post(`${config.backend_url}/user/login`, {
                email,
                password,
            });
            await fetchUser();
        } catch (err) {
            console.log(err.response?.data?.message);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    };

    const register = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            await axios.post(`${config.backend_url}/user/register`, userData);
            await fetchUser();
        } catch (err) {
            console.log(err.response?.data?.message);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            throw err;
        }
    };

    const logout = async () => {
        await axios.post(`${config.backend_url}/user/logout`);
        setUser(null);
        setCurrentActiveChannelId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                loading,
                isAuthenticated: !!user,
                error,
                currentActiveChannelId,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
