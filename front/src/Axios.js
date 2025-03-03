import axios from 'axios';

export const domain = 'https://math-api002.vercel.app'
export const baseURLMedia = `${domain}/media/`;
export const baseURLMediaTypeImage = `${domain}`;
export const baseURL = `${domain}/api`;

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
});

// إضافة التوكن بعد إنشاء axiosInstance
const token = localStorage.getItem('access_token');
if (token) {
	axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + token;
}

axiosInstance.interceptors.response.use(
	(response) => {
		console.log(response);
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (!error.response) {
			alert('حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت أو تحقق من إعدادات السيرفر.');
			return Promise.reject(error);
		}

		if (error.response.status === 401 && originalRequest.url === `${baseURL}/token/refresh/`) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}

		if (error.response.data?.code === 'token_not_valid' && error.response.status === 401) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				try {
					const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
					const now = Math.ceil(Date.now() / 1000);

					if (tokenParts.exp > now) {
						return axiosInstance
							.post(`${baseURL}/token/refresh/`, { refresh: refreshToken })
							.then((response) => {
								localStorage.setItem('access_token', response.data.access);
								localStorage.setItem('refresh_token', response.data.refresh);

								axiosInstance.defaults.headers.common['Authorization'] =
									'JWT ' + response.data.access;
								originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

								return axiosInstance(originalRequest);
							})
							.catch((err) => {
								console.log('Error refreshing token:', err);
								window.location.href = '/login/';
							});
					} else {
						console.log('Refresh token expired');
						window.location.href = '/login/';
					}
				} catch (err) {
					console.log('Invalid refresh token:', err);
					window.location.href = '/login/';
				}
			} else {
				console.log('No refresh token available.');
				window.location.href = '/login/';
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
