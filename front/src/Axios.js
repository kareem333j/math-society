import axios from 'axios';

export const domain = 'http://127.0.0.1:8000';
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

axiosInstance.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/grades', '/courses'];

        const isPublic = publicEndpoints.some((endpoint) =>
            config.url.startsWith(endpoint)
        );

        if (!isPublic) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = 'JWT ' + token;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response, // إذا كانت الاستجابة ناجحة، قم بإرجاعها
    async (error) => {
        const originalRequest = error.config;

        // إذا كان الخطأ 401 ولم يتم إعادة المحاولة بعد
        if (error.response.status === 401 && !originalRequest._retry) {
            console.log("تم اكتشاف خطأ 401 Unauthorized. جاري تجديد الـ token...");

            // إذا كان الطلب هو طلب تجديد الـ token، قم بحذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول
            if (originalRequest.url === baseURL + 'token/refresh/') {
                console.log("فشل تجديد الـ token. جاري حذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول...");
                localStorage.removeItem('access_token'); // حذف access_token
                localStorage.removeItem('refresh_token'); // حذف refresh_token
                window.location.href = '/login/'; // توجيه المستخدم إلى صفحة تسجيل الدخول
                return Promise.reject(error);
            }

            // إذا كان يتم تجديد الـ token حاليًا، أضف الطلب إلى قائمة الانتظار
            if (isRefreshing) {
                console.log("يتم تجديد الـ token حاليًا. جاري إضافة الطلب إلى قائمة الانتظار...");
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

            // تمييز الطلب بأنه تمت إعادة المحاولة
            originalRequest._retry = true;
            isRefreshing = true;

            // محاولة تجديد الـ token باستخدام الـ refresh_token
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                console.log("جاري تجديد الـ token باستخدام الـ refresh_token...");
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000);

                // التحقق من صلاحية الـ refresh_token
                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            console.log("تم تجديد الـ token بنجاح. جاري تحديث التوكينز...");
                            // تخزين الـ token الجديد في localStorage
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);

                            // تحديث الـ header بالـ token الجديد
                            axiosInstance.defaults.headers['Authorization'] =
                                'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'JWT ' + response.data.access;

                            // معالجة الطلبات الفاشلة
                            processQueue(null, response.data.access);
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log("فشل تجديد الـ token. جاري حذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول...");
                            // في حالة فشل تجديد الـ token، قم بحذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول
                            localStorage.removeItem('access_token'); // حذف access_token
                            localStorage.removeItem('refresh_token'); // حذف refresh_token
                            window.location.href = '/login/'; // توجيه المستخدم إلى صفحة تسجيل الدخول
                            return Promise.reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false; // إعادة تعيين حالة التجديد
                        });
                } else {
                    console.log("الـ refresh_token منتهي الصلاحية. جاري حذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول...");
                    // إذا كان الـ refresh_token منتهي الصلاحية، قم بحذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول
                    localStorage.removeItem('access_token'); // حذف access_token
                    localStorage.removeItem('refresh_token'); // حذف refresh_token
                    window.location.href = '/login/'; // توجيه المستخدم إلى صفحة تسجيل الدخول
                    return Promise.reject(error);
                }
            } else {
                console.log("لا يوجد refresh_token. جاري حذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول...");
                // إذا لم يكن هناك refresh_token، قم بحذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول
                localStorage.removeItem('access_token'); // حذف access_token
                localStorage.removeItem('refresh_token'); // حذف refresh_token
                window.location.href = '/login/'; // توجيه المستخدم إلى صفحة تسجيل الدخول
                return Promise.reject(error);
            }
        }

        // إذا لم يكن الخطأ 401، قم بحذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول في حالة وجود خطأ آخر
        if (error.response.status === 500 || error.response.status === 400) {
            console.log("حدث خطأ في الخادم (500 أو 400). جاري حذف التوكينز وتوجيه المستخدم إلى صفحة تسجيل الدخول...");
            localStorage.removeItem('access_token'); // حذف access_token
            localStorage.removeItem('refresh_token'); // حذف refresh_token
            window.location.href = '/login/'; // توجيه المستخدم إلى صفحة تسجيل الدخول
        }

        // إذا لم يكن الخطأ 401 أو 500 أو 400، قم برفض الطلب
        return Promise.reject(error);
    }
);
export default axiosInstance;