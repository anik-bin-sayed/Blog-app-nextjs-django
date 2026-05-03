import React from "react";

const TextArea = ({ errors, value, handleChange, label, name, row = 4 }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={row}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2.5 rounded-md border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none placeholder:text-gray-500 text-gray-700 ${
          errors ? "border-red-500 bg-red-50" : "border-gray-300 "
        }`}
        placeholder="Short summary of your blog post..."
      />
      {errors && <p className="mt-1 text-xs text-red-500">{errors}</p>}
    </div>
  );
};

export default TextArea;
