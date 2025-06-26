import React from 'react';

// A generic InputField component for reusability.
// It handles common input attributes and styling.
const InputField = ({ id, label, type = 'text', placeholder, value, onChange, className = '', ...props }) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
                {...props}
            />
        </div>
    );
};

export default InputField;
