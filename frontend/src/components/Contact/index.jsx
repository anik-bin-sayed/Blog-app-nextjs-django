"use client";
import React, { useState } from "react";
import Image from "next/image";
import SubmitButton from "../ui/submitButton";
import Input from "../ui/input";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <section className="bg-linear-to-b from-white to-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-gray-800 text-center relative z-10">
            say{" "}
            <span className="text-amber-600 relative inline-block">
              hello!
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-200 rounded-full -mb-2"></span>
            </span>
          </h1>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-5 md:-translate-y-7.5 z-0">
            <div className="relative w-28 h-28 md:w-32 md:h-32">
              <Image
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Contact profile"
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
                sizes="(max-width: 768px) 7rem, 8rem"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto mt-20 mb-12">
          Contact me to find out more or how I can help you better.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="Anik Bin Sayed"
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
          </div>

          <div className="mb-6">
            <Input
              label="Subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="hello@example.com"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-500 outline-none transition-all"
              placeholder="Write your message..."
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <div className="text-center">
            <SubmitButton text="Send" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
