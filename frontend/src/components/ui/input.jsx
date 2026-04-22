"use client";
import React, { forwardRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      iconPosition = "left",
      type = "text",
      className = "",
      containerClassName = "",
      id,
      disabled,
      required,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    const baseInputClasses = `w-full px-4 py-2.5 rounded-xl border transition-all duration-200 text-black outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
      error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 hover:border-gray-400"
    } ${icon && iconPosition === "left" ? "pl-10" : ""} ${
      icon && iconPosition === "right" ? "pr-10" : ""
    } ${isPassword ? "pr-10" : ""} ${className} disabled:bg-gray-100 disabled:cursor-not-allowed`;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={baseInputClasses}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {icon && iconPosition === "right" && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-red-500 text-xs mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
