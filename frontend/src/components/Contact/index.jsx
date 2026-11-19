"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "../ui/submitButton";
import Input from "../ui/input";
import { FaArrowRight, FaEnvelope, FaRegClock } from "react-icons/fa";

const initialFormData = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((previous) => ({ ...previous, [id]: value }));
    setErrors((previous) => ({ ...previous, [id]: "" }));
    setSubmitted(false);
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
    if (!formData.email.trim()) nextErrors.email = "Please enter your email address.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.subject.trim()) nextErrors.subject = "Please add a subject.";
    if (formData.message.trim().length < 10) nextErrors.message = "Your message needs at least 10 characters.";
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    const emailBody = `From: ${formData.name} (${formData.email})\n\n${formData.message}`;
    window.location.href = `mailto:info@sophiaellis.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    setSubmitted(true);
  };

  return (
    <section className="bg-[#faf7f0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">The conversation starts here</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">Say hello. <span className="italic text-amber-800">I’d love to hear from you.</span></h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">Have a question, an idea for a story, or simply want to share what you’ve been reading? Drop me a note.</p>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_28px_70px_-44px_rgba(41,32,22,0.4)] lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden bg-stone-900 p-7 text-white sm:p-10 lg:min-h-[650px] lg:p-12">
            <Image
              src="https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="A peaceful desk ready for a thoughtful conversation"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="-z-20 object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/95 via-stone-950/65 to-stone-950/30" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">A note is always welcome</p>
              <h2 className="mt-4 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">Good things begin with a conversation.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">Whether it’s about a story, a place, or a new idea, I’m glad you stopped by.</p>
            </div>
            <div className="relative mt-10 space-y-5">
              <a href="mailto:info@sophiaellis.com" className="flex items-center gap-4 text-sm text-white/90 transition hover:text-amber-200">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-amber-200"><FaEnvelope /></span>
                <span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Email me</span><span className="mt-1 block">info@sophiaellis.com</span></span>
              </a>
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-amber-200"><FaRegClock /></span>
                <span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">A little patience</span><span className="mt-1 block">I’ll get back to you as soon as I can.</span></span>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-9 lg:p-12">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Write a message</p>
              <h2 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">What’s on your mind?</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Your name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Jane Smith" className="rounded-xl border-stone-200 bg-[#faf9f6] px-4 py-3 focus:border-amber-700 focus:ring-amber-700/10" />
                <Input label="Email address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="jane@example.com" className="rounded-xl border-stone-200 bg-[#faf9f6] px-4 py-3 focus:border-amber-700 focus:ring-amber-700/10" />
              </div>
              <div className="mt-5">
                <Input label="Subject" id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} error={errors.subject} required placeholder="What would you like to talk about?" className="rounded-xl border-stone-200 bg-[#faf9f6] px-4 py-3 focus:border-amber-700 focus:ring-amber-700/10" />
              </div>
              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-stone-700">Message <span className="text-amber-800">*</span></label>
                <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={`w-full resize-y rounded-xl border bg-[#faf9f6] px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:ring-4 focus:ring-amber-700/10 ${errors.message ? "border-rose-500 focus:border-rose-500" : "border-stone-200 focus:border-amber-700"}`} placeholder="Tell me a little about it..." />
                {errors.message && <p id="message-error" className="mt-1.5 text-xs text-rose-700">{errors.message}</p>}
              </div>
              {submitted && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Your email app should open with your message ready to send.</p>}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-stone-500">Fields marked <span className="text-amber-800">*</span> are required.</p>
                <div className="w-full sm:w-48"><SubmitButton text="Send message" type="submit" /></div>
              </div>
            </form>
            <Link href="/blogs" className="mt-7 inline-flex items-center gap-2 border-t border-stone-100 pt-5 text-xs font-semibold text-stone-500 transition hover:text-amber-900">Or browse the journal <FaArrowRight className="text-[10px]" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
