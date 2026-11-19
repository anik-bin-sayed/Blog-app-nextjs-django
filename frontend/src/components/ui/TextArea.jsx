import React from "react";

const TextArea = ({ errors, value, handleChange, label, name, row = 4 }) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">
        {label} <span className="text-amber-800">*</span>
      </label>
      <textarea
        rows={row}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full resize-none rounded-xl border bg-[#faf9f6] px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 ${
          errors ? "border-rose-500" : "border-stone-200"
        }`}
        placeholder="Short summary of your blog post..."
      />
      {errors && <p className="mt-1 text-xs text-red-500">{errors}</p>}
    </div>
  );
};

export default TextArea;
