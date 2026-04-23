"use client";

import { useEffect, useState } from "react";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useRegisterMutation } from "@/redux/services/auth/authApi";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState(null);

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverMessage) setServerMessage(null);
  };

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.confirmPassword != formData.password) {
      setError("Password does not match");
      return;
    }

    setServerMessage(null);

    try {
      const { confirmPassword, ...filteredData } = formData;
      const response = await register(filteredData).unwrap();
      console.log(response);
      setFormData(initialFormData);
      setAcceptTerms(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" h-[calc(100vh-65px)]  bg-linear-to-br from-amber-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
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

              {errors.terms && (
                <p className="text-red-500 text-xs -mt-2">{errors.terms}</p>
              )}
              {serverMessage && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    serverMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {serverMessage.text}
                </div>
              )}
              {error && (
                <p className="text-red-800 flex items-center gap-1">
                  <MdOutlineErrorOutline />
                  {error}
                </p>
              )}
              <SubmitButton
                text="Sign un"
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
}
