import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const axiosWithRefreshToken = async (
  url,
  method = "GET",
  data = null,
  headers = null
) => {
  try {
    const response = await axios({
      url: `${baseUrl}${url}`,
      method,
      data,
      withCredentials: true,
      headers,
    });
    return response;
  } catch (error) {
    //If not because of unauthorized
    if (error.response && error.response.status != 401) {
      throw error;
    }

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
        headers,
      });
      return retryResponse;
    } catch (refreshError) {
      throw refreshError;
    }
  }
};

export default axiosWithRefreshToken;
