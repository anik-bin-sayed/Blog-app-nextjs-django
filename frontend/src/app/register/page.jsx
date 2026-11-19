"use client";

import { useState } from "react";
import { toast } from "sonner";

import Input from "@/components/ui/input";
import TextLink from "@/components/ui/textLink";
import SubmitButton from "@/components/ui/submitButton";
import AuthShell from "@/components/Auth/AuthShell";
import Link from "next/link";
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

  const fieldClass = "!rounded-xl !border-stone-200 !bg-[#faf9f6] !py-3 focus:!border-amber-700 focus:!ring-amber-700/10";

  return (
    <AuthShell
      visualEyebrow="Start something lovely"
      visualTitle="Make yourself at home in the world of stories."
      visualDescription="Create your account to join the conversation, save favorite reads, and explore the journal at your own pace."
    >
      <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition hover:text-amber-900">← Back to Globira</Link>
      <div className="mb-6 mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">A new chapter</p>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">Join Globira.</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Create an account and make space for a few good stories.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" id="full-name" type="text" name="full_name" value={formData.full_name} onChange={handleChange} error={errors.full_name} required placeholder="Your full name" className={fieldClass} />
          <Input label="Username" id="username" type="text" name="username" value={formData.username} onChange={handleChange} error={errors.username} required placeholder="Choose a username" className={fieldClass} />
        </div>
        <Input label="Email address" id="email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="hello@example.com" className={fieldClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Password" id="password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="Create a password" className={fieldClass} />
          <Input label="Confirm password" id="confirm-password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required placeholder="Enter it again" className={fieldClass} />
        </div>
        <div className="pt-1">
          <SubmitButton text="Create account" type="submit" isLoading={isLoading} isLoadingText="Creating account..." />
        </div>
        <p className="text-center text-xs leading-5 text-stone-500">We’ll send an activation link to your email to finish setting up your account.</p>
        <p className="border-t border-stone-100 pt-4 text-center text-sm text-stone-500">Already a member? <TextLink text="Sign in" link="/login" /></p>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
