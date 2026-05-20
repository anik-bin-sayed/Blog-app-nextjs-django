"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import { useLoginMutation } from "@/redux/services/auth/authApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

const initialFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(formData).unwrap();

      toast.success(res?.message || "Login successful");
      setFormData(initialFormData);
      router.replace("/");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Login failed. Please try again."));
    }
  };

  return (
    <div className=" h-[calc(100vh-65px)] bg-linear-to-br from-amber-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Sign in</h3>
              <p className="text-gray-500 mt-1">
                Start your blogging journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="hello@example.com"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="Password"
              />

              <SubmitButton
                text="Sign in"
                type="submit"
                isLoading={isLoading}
                isLoadingText="Please wait"
              />
              <div className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <TextLink text="Sign up" link="/register" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
