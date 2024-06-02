import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, LoaderCircle } from "lucide-react";
import formImg from "../../assets/formImg.webp"
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const {axiosInstance} = useAxiosInstance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SignUpSchema = z.object({
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters" }),
    confirmPassword: z
      .string()
      .min(3, { message: "Confirm Password must be at least 3 characters" })
      .refine((data: any) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords does not match",
      }),
  });
  type SignUpSchemaType = z.infer<typeof SignUpSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit = (data) => {
    const values = {
      email: data?.email,
      password: data?.password,
      userName: data?.userName,
    };
    setIsSubmitting(true);

    axiosInstance
      .post(`${import.meta.env.VITE_APP_API_URL}/user/register`, values)
      .then(() => {
        setIsSubmitting(false);
        navigate("/login");
      })
      .catch(() => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          variant: "destructive",
          description: "Something went wrong please try again",
        });
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
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex gap-2 justify-start ">
          <Boxes className="text-indigo-400 h-10 w-10" />
          <p className="font-bold text-4xl text-indigo-400 mb-3">FORM FORGE</p>
        </div>
        <div className="w-[300px] max-h-[550px] h-fit p-4 shadow-lg border-white border-2 text-white rounded-lg">
          <div className="flex flex-col gap-3">
            <form
              className="flex flex-col gap-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                className="mt-1"
                type="text"
                placeholder="Enter the username"
                {...register("userName")}
              />
              {errors.userName && (
                <span className="text-sm text-red-500">
                  {errors.userName.message}
                </span>
              )}
              <Input
                className="mt-1"
                type="email"
                placeholder="Enter the email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
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
              <Button
                size="sm"
                variant="secondary"
                type="submit"
                disabled={isSubmitting}
              >
                {" "}
                Submit{" "}
                {isSubmitting && (
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
    </div>
  );
};

export default Register;
