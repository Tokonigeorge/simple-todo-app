import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  type = 'button',
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-gray-900 text-white p-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
