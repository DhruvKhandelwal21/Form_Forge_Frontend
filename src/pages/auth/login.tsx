import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, LoaderCircle } from "lucide-react";
import formImg from "../../assets/formImg.webp"
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { AuthContext } from "@/context/authContext";
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {setUser} = useContext(AuthContext);
  const {axiosInstance} = useAxiosInstance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const LoginSchema = z.object({
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters" }),
  });
  type LoginSchemaType = z.infer<typeof LoginSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    axiosInstance
      .post(`/user/login`, data)
      .then(({data}) => {
        setIsSubmitting(false);
        console.log(data)
        setUser(data?.data);
        localStorage.setItem("userData", JSON.stringify(data?.data));
        navigate(location?.state?.prevUrl ? location?.state?.prevUrl : '/');
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex h-screen w-full xs:justify-center lg:justify-between gap-10 items-center px-4">
      <div className="flex flex-col items-center gap-6 xs:hidden lg:flex">
        <img src={formImg} alt="form-image" className="w-[400px] h-[250px] rounded-md" />
        <h1 className="font-semibold text-4xl text-indigo-400 w-full px-5">
      Empower Your Forms, Transform Your Data with our own dynamic form builder.
      </h1>
      </div>
      <div className="relative h-full z-0 justify-center xs:hidden lg:flex"> 
        <div className="bg-white absolute h-screen w-1 translate-x-4"></div>
      </div>

      <div className=" w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex gap-2 justify-start ">
        <Boxes className="text-indigo-400 h-10 w-10" />
        <p className="font-bold text-4xl text-indigo-400 mb-3">FORM FORGE</p>
        </div>
        <div className="w-[300px] max-h-[400px] h-fit p-4 shadow border-white border-2 text-white rounded-md overflow-auto">
          <div className="flex flex-col gap-5">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="text"
                className="mt-1"
                placeholder="Enter the username"
                {...register("userName")}
              />
              {errors.userName && (
                <span className="text-sm text-red-500">
                  {errors.userName.message}
                </span>
              )}
              <Input
                type="password"
                className="mt-1"
                placeholder="Enter the password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
              <Button className="" variant="secondary" size="sm" type="submit">
                {" "}
                Submit{" "}
                {isSubmitting && (
                  <LoaderCircle className="ml-1 h-4 w-4 animate-spin" />
                )}
              </Button>
            </form>
            <div className="flex gap-2 justify-center items-center">
              <span>If not Registered ?</span>
              <Button
                className="py-2"
                size="xs"
                variant="secondary"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
