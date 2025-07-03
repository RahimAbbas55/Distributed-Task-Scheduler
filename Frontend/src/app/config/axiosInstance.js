import axios from "axios";

const axiosInstance = axios.create({
    baseURL : "http://localhost:3000",
    timeout : 10000
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse.title || "Error");
      } else if (error.request) {
        console.log("Network Error");
      } else {
        console.log("Request Error");
      }
    } else {
      console.log("Error Logging In!");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;