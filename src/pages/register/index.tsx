import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios'
import { LoaderCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting,setIsSubmitting] = useState(false);

  const SignUpSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters" }),
    confirmPassword: z
      .string()
      .min(3, { message: "Confirm Password must be at least 3 characters" }).refine((data:any) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords does not match'
      }),
  });
  type SignUpSchemaType = z.infer<typeof SignUpSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit = (data) => {
    setIsSubmitting(true);
 

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/user/register`, data)
      .then((response) => {
        setIsSubmitting(false);
        const { data } = response;
        localStorage.setItem("token", data?.newUser?.token);
        localStorage.setItem("userName", data?.newUser?.userName);

        // setToken(data?.newUser?.token);
        // myUserName(data?.newUser?.userName);
        navigate("/");
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[300px] max-h-[550px] h-fit p-4 shadow-lg border-white border-2 text-white rounded-lg">
        <div className="flex flex-col gap-3">
        <p>Please Register</p>
        <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="mt-1"
            type="text"
            placeholder="Enter the username"
            {...register("username")}
          />
          {errors.username && (
            <span className="text-sm text-red-500">
              {errors.username.message}
            </span>
          )}
          <Input
            className="mt-1"
            type="email"
            placeholder="Enter the email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
          <Input
            className="mt-1"
            type="password"
            placeholder="Enter the password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
          <Input
            className="mt-1"
            type="password"
            placeholder="Confirm the password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
          <Button size="sm" variant="secondary" type="submit" disabled={isSubmitting}>
            {" "}
            Submit {isSubmitting && (
            <LoaderCircle className="mr-4 h-4 w-4 animate-spin" />
          )}
          </Button>
        </form>
        <div className="flex gap-2 justify-center items-center">
          <span>Already Registered ?</span>
          {/* <button className={cn(buttonVariants())} disabled={isSubmitting}>
          {isSubmitting && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          </button> */}
          <Button
            className="py-2"
            size="xs"
            variant="secondary"
            onClick={() => navigate("/login")}
            
          >
            Login 
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
