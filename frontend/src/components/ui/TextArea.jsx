import React from "react";

const TextArea = ({ errors, value, handleChange, label, name }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={3}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2.5 rounded-md border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition resize-y ${
          errors.excerpt ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
        placeholder="Short summary of your blog post..."
      />
      {errors.excerpt && (
        <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>
      )}
    </div>
  );
};

export default TextArea;
