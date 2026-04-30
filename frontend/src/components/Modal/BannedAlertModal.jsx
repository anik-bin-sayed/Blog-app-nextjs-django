import React, { useEffect } from "react";

import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { logoutUser } from "@/redux/services/auth/authSlice";

import { useDispatch } from "react-redux";

import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";

const BannedUserModal = ({
  supportEmail = "anikbinsayed206@gmail.com",
  supportWhatsApp = "+8801616176409",
  onContact,
}) => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact();
    } else {
      window.location.href = `mailto:${supportEmail}?subject=Account%20Ban%20Appeal`;
    }
  };

  const whatsappLink = `https://wa.me/${supportWhatsApp.replace(/\D/g, "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md transition-all duration-300" />

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white  shadow-2xl transition-all duration-300 animate-in fade-in zoom-in scale-100">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-rose-500 via-red-500 to-orange-500" />

        <div className="p-6 sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <HiOutlineExclamationCircle className="h-10 w-10 text-red-600 " />
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Account Suspended
            </h2>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your account has been banned due to violation of our
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {" "}
                  Terms of Service
                </span>
                .
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                To resolve this issue, please contact our support team via
                WhatsApp, email, or phone.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Contact Support
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaWhatsapp className="h-5 w-5 text-green-600" />
                WhatsApp
              </a>
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MdOutlineMailOutline className="h-5 w-5 text-blue-600" />
                Email
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <BiLogOutCircle  className="h-4 w-4" />
              Logout
            </button>
            <button
              onClick={handleContact}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-linear-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
            >
              <RiContactsBook3Line className="h-4 w-4" />
              Contact Support
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
            Appeal requests are typically reviewed within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannedUserModal;
