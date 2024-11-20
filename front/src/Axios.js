import axios from 'axios';

export const domain = 'https://math-api002.vercel.app'
export const baseURLMedia = `${domain}/media/`;
export const baseURLMediaTypeImage = `${domain}`;
export const baseURL = `${domain}/api`;

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 10000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'JWT ' + localStorage.getItem('access_token')
			: undefined,
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
});

let isRefreshing = false; 
let failedQueue = []; 

function processQueue(error, token = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === baseURL + 'token/refresh/') {
                window.location.href = '/login/';
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'JWT ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);
                            axiosInstance.defaults.headers['Authorization'] =
                                'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'JWT ' + response.data.access;

                            processQueue(null, response.data.access);
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            window.location.href = '/login/';
                            return Promise.reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            }
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;