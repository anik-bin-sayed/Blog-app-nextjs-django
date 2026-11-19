"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import AuthShell from "@/components/Auth/AuthShell";
import Link from "next/link";
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
    <AuthShell
      visualEyebrow="Welcome to the journal"
      visualTitle="A good story is even better when it’s shared."
      visualDescription="Pick up where you left off, save the pieces you love, and keep discovering something new."
    >
      <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-900">← Back to Globira</Link>
      <div className="mb-7 mt-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Your reading corner</p>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">Welcome back.</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Sign in to continue your journey through the journal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email address" id="email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="hello@example.com" className="!rounded-xl !border-stone-200 !bg-[#faf9f6] !py-3 focus:!border-amber-700 focus:!ring-amber-700/10" />
        <Input label="Password" id="password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="Enter your password" className="!rounded-xl !border-stone-200 !bg-[#faf9f6] !py-3 focus:!border-amber-700 focus:!ring-amber-700/10" />
        <div className="pt-1">
          <SubmitButton text="Sign in" type="submit" isLoading={isLoading} isLoadingText="Please wait" />
        </div>
        <p className="border-t border-stone-100 pt-5 text-center text-sm text-stone-500">Don&apos;t have an account? <TextLink text="Create one" link="/register" /></p>
      </form>
    </AuthShell>
  );
};

export default Login;
