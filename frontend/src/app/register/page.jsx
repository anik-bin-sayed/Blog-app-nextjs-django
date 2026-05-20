"use client";

import { useState } from "react";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import { useRegisterMutation } from "@/redux/services/auth/authApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

const initialFormData = {
  full_name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    const { confirmPassword, ...payload } = formData;

    try {
      const response = await register(payload).unwrap();

      toast.success(
        response?.message ||
          "Registration successful. An activation link has been sent to your email.",
      );

      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <div className="min-h-screen  bg-linear-to-br from-amber-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Create account
              </h3>
              <p className="text-gray-500 mt-1">
                Start your blogging journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                required
                placeholder="Your full name"
              />
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
                placeholder="username"
              />
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
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Confirm Password"
              />

              <SubmitButton
                text="Sign up"
                type="submit"
                isLoading={isLoading}
                isLoadingText="Creating account..."
              />
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <TextLink text="Sign in" link="/login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
