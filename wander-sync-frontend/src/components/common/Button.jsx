import React from 'react';

// A generic Button component for reusability.
// It accepts common button props and applies default styling.
const Button = ({ children, onClick, className = '', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;