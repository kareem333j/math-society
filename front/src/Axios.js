import axios from 'axios';

export const domain = 'https://math-api002.vercel.app'
export const baseURLMedia = `${domain}/media/`;
export const baseURLMediaTypeImage = `${domain}`;
export const baseURL = `${domain}/api`;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
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

// تحديد الـ API المفتوحة للعامة
axiosInstance.interceptors.request.use((config) => {
    const publicEndpoints = ['/grades', '/courses'];
    const isPublic = publicEndpoints.some((endpoint) => config.url.startsWith(endpoint));

    if (!isPublic) {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'JWT ' + token;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// التعامل مع الأخطاء وإدارة التوكن
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            // خطأ في الشبكة أو السيرفر
            return Promise.reject(error);
        }

        if (error.response.status === 401) {
            // التحقق مما إذا كان الخطأ بسبب تسجيل الدخول أو انتهاء صلاحية التوكن
            if (originalRequest.url.includes('/login')) {
                // إذا كان المستخدم يحاول تسجيل الدخول بكلمة مرور خاطئة، نرجع الخطأ فقط ولا نقوم بإعادة التوجيه
                return Promise.reject(error);
            }

            if (originalRequest.url === baseURL + '/token/refresh/') {
                // إذا كان تحديث التوكن نفسه فشل، نوجه المستخدم إلى صفحة تسجيل الدخول
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login/';
				// console.log('error here');
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
                try {
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                    const now = Math.ceil(Date.now() / 1000);

                    if (tokenParts.exp > now) {
                        const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);
                        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                        originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                        processQueue(null, response.data.access);
                        return axiosInstance(originalRequest);
                    }
                } catch (err) {
                    console.error('Error refreshing token:', err);
                }
            }

			if(localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				window.location.href = '/login/';
			}
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

