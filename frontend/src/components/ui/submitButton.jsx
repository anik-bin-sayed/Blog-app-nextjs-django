import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";

const SubmitButton = ({ isLoading, disabled, isLoadingText, text, type }) => {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className="w-full bg-linear-to-r from-amber-600 to-orange-600 text-white font-semibold py-2.5 rounded-md hover:from-amber-700 hover:to-orange-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer select-none"
    >
      {isLoading ? (
        <>
          <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
          {isLoadingText}
        </>
      ) : (
        <>
          {text} <FaArrowRight className="h-5 w-5" />{" "}
        </>
      )}
    </button>
  );
};

export default SubmitButton;
