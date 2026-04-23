"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivateAccountMutation } from "@/redux/services/auth/authApi";

const Page = ({ params }) => {
  const { uid, token } = use(params);
  const router = useRouter();

  const [activateAccount, { isLoading, isSuccess, isError }] =
    useActivateAccountMutation();

  useEffect(() => {
    if (uid && token) {
      activateAccount({ uid, token });
    }
  }, [uid, token, activateAccount]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen bg-linear-to-br text-black flex items-center justify-center from-amber-50 via-white to-orange-50 ">
      {isLoading && <h1>Activating your account...</h1>}
      {isSuccess && <h1>Account activated! Redirecting to login...</h1>}
      {isError && <h1>Activation failed. Invalid or expired link.</h1>}
    </div>
  );
};

export default Page;
