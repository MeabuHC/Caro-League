import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const axiosWithRefreshToken = async (url, method = "GET", data = null) => {
  try {
    const response = await axios({
      url: `${baseUrl}${url}`,
      method,
      data,
      withCredentials: true,
    });
    return response;
  } catch (error) {
    try {
      // Attempt token refresh
      await axios.post(
        `${baseUrl}/refresh-token`,
        {},
        { withCredentials: true }
      );

      // Retry original request after successful token refresh
      const retryResponse = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        withCredentials: true,
      });
      return retryResponse;
    } catch (refreshError) {
      throw refreshError;
    }
  }
};

export default axiosWithRefreshToken;
