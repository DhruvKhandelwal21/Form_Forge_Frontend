import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { AuthContext } from "@/context/authContext";
import { useContext, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Boxes } from "lucide-react";

const NavBar = () => {
  const {axiosInstance} = useAxiosInstance();
  const navigate = useNavigate();
  const {user, setUser} = useContext(AuthContext);
  console.log(user)
  useEffect(()=>{
    if(!user){
      const data = localStorage.getItem('userData');
      console.log(data)
      const userData = JSON?.parse(data);
      console.log(userData)
      setUser(userData);
    }
  },[])
  const logoutHandler = async ()=>{
   await axiosInstance.post(`user/logout`).then(()=>{
    localStorage.clear();
      navigate('/login')
   }).catch((err)=>{
     console.log(err);
   })
  }
  
  return (
    <nav className="stick top-0 h-14 backdrop-blur-lg transition-all w-full inset-x-0 z-30 border-b">
      <div className="h-full flex justify-between items-center px-2">

        <Link
          className="flex gap-1 items-center font-bold text-3xl text-indigo-400 bg-clip-text hover:cursor-pointer"
          to={"/"}>
          <Boxes className="text-indigo-400 h-7 w-7" />
          FORM FORGE
        </Link>
      
        <div className="flex gap-4 items-center">
         {user ? <p className="text-semibold text-md truncate">{user?.userName}</p> : <Skeleton className="w-4 h-4" />}
          <Button variant="outline" size="sm" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
