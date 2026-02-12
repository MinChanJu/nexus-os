import { ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  color?: string;
  title?: string;
  children?: ReactNode;
}

const Button = ({
  type = "button",
  onClick,
  disabled,
  backgroundColor = "var(--color-blue-600)",
  color = "white",
  title,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full cursor-pointer rounded-md p-2 text-sm font-medium hover:opacity-80"
      style={{ backgroundColor, color }}
    >
      {children || title || "Button"}
    </button>
  );
};

export default Button;
