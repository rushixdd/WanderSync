// src/components/common/InputField.jsx
import React from 'react';

const InputField = ({ id, label, type, placeholder, value, onChange, required }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
        </div>
    );
};

export default InputField;