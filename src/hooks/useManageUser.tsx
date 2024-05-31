import { useContext } from "react";
import useAxiosInstance from "./useAxiosInstance";
import { AuthContext } from "@/context/authContext";

const useManageUser = () => {
  const { axiosInstance } = useAxiosInstance();
  const { setUser } = useContext(AuthContext);

  const getUser = () => {
    axiosInstance
      .get(`/me`)
      .then(({ data }) => {
        setUser(data?.data);
      })
      .catch(() => {});
  };

  const logoutUser = () => {
    axiosInstance
      .get(`/logout`)
      .then(({ data }) => {})
      .catch(() => {});
  };
  return { getUser, logoutUser };
};

export default useManageUser;
