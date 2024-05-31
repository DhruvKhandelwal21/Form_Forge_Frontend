import axios from "axios";
import { useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const useAxiosInstance = (passedHeaders = null) => {
  let headers: any = passedHeaders ? passedHeaders : {};
  const navigate = useNavigate();
  const location = useLocation();
  let failedQueue = useRef([]);
  let isRefreshing = useRef(false);
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  const processQueue = (error) => {
    failedQueue.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });

    failedQueue.current = [];
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      const originalRequest = error.config;
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );

      const handleError = (error) => {
        processQueue(error);
        //  navigate("/login")
        // logout();
        return Promise.reject({
          error,
          message: error?.response?.data?.message,
        });
      };

      if (error?.response?.status === 401) {
        if (isRefreshing.current) {
          return new Promise((resolve, reject) => {
            failedQueue.current.push({ resolve, reject });
          })
            .then(() => {
              axiosInstance(originalRequest);
            })
            .catch((error) => {
              // it will send error down further in the promise chain
              // i.e. to the catch block from where we are calling the api.
              return Promise.reject({
                error,
                message: error?.response?.message,
              });
            });
        }
        isRefreshing.current = true;
        originalRequest._retry = true;
        return axios
          .put(
            `${baseUrl}/user/refresh-access-token`,
            {},
            { withCredentials: true }
          )
          .then(() => {
            processQueue(null);
            return axiosInstance(originalRequest);
            // Either we can use catch or second parameter of then to handle errors.
          })
          .catch((error) => {
            navigate("/login", { state: { prevUrl: location.pathname } });
            handleError(error);
          })
          .finally(() => {
            isRefreshing.current = false;
          });
      } else if(error?.CanceledError){
        return;
      }
       else if(error?.response) {
        return handleError(error);
      }
    }
  );

  return { axiosInstance };
};
export default useAxiosInstance;
