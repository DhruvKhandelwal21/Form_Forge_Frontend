import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const LoginSchema = z.object({
    username: z
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
    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/user/login`, data)
      .then((response) => {
        setIsSubmitting(false);
        const { data } = response;
        localStorage.setItem("token", data?.newUser?.token);
        localStorage.setItem("userName", data?.newUser?.userName);
        navigate("/");
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center">
      <div className="w-[300px] max-h-[400px] h-fit p-4 shadow border-white border-2 text-white rounded-md overflow-auto">
        <div className="flex flex-col gap-5">
          <p className="w-full">Please Login</p>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              className="mt-1"
              placeholder="Enter the username"
              {...register("username")}
            />
            {errors.username && (
              <span className="text-sm text-red-500">
                {errors.username.message}
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
                <LoaderCircle className="mr-4 h-4 w-4 animate-spin" />
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
  );
};

export default Login;
