
export default function applyResponseInterceptor(client, toast) {

  client.interceptors.response.use(

    (response) => {
      // محاسبه Performance
      if (response.config.metadata) {
        const duration =
          new Date() - response.config.metadata.startTime;
        console.log(`API ${response.config.url} took ${duration}ms`);
      }

      return response;
    },

    (error) => {
      // خطاهای شبکه
      if (!error.response) {
        toast.error("خطا در برقراری ارتباط با سرور");
        return Promise.reject(error);
      }

      const status = error.response.status;

      // مدیریت خطاهای عمومی
      switch (status) {
        case 400:
          toast.error("درخواست نادرست");
          break;

        case 401:
          toast.error("نیازمند ورود مجدد");
          // ریدایرکت به صفحه Login
          window.location.href = "/login";
          break;

        case 403:
          toast.error("دسترسی غیرمجاز");
          break;

        case 404:
          toast.error("یافت نشد");
          break;

        case 500:
          toast.error("خطای داخلی سرور");
          break;

        default:
          toast.error(`خطا: ${status}`);
      }

      return Promise.reject(error);
    }
  );
}
