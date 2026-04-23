"use client";

import { useEffect, useState } from "react";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useLoginMutation } from "@/redux/services/auth/authApi";

const initialFormData = {
  email: "",
  password: "",
};
export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverMessage) setServerMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerMessage(null);

    try {
      const res = await login(formData).unwrap();
      console.log(res);
      // setFormData(initialFormData);
    } catch (err) {
      console.log(err);
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
                text="Sign in"
                type="submit"
                isLoading={isLoading}
                isLoadingText="Please wait"
              />
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <TextLink text="Sign up" link="/register" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
