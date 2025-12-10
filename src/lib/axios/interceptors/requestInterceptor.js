
export default function applyRequestInterceptor(client) {

  client.interceptors.request.use(
    
    (config) => {
      // ثبت زمان شروع درخواست برای Performance
      config.metadata = { startTime: new Date() };

      // افزودن Token اگر هست
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

}
