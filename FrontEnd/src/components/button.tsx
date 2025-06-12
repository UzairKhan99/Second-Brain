interface ButtonProps {
  title: string;
  size: "lg" | "md" | "sm";
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  variant: "primary" | "secondary" | "tertiary" | "danger" | "success";
  onClick?: () => void;
  disabled?: boolean;
}

const sizeStyle = {
  "lg": "px-4 py-2 rounded-md",
  "md": "px-3 py-1 rounded-md", 
  "sm": "px-2 py-1 rounded-md"
}

const variantStyle = {
  "primary": "bg-primary-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.5)] hover:bg-primary-600 active:bg-primary-700 transition-all duration-300",
  "secondary": "bg-secondary-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(var(--secondary-500-rgb),0.5)] hover:bg-secondary-600 active:bg-secondary-700 transition-all duration-300",
  "tertiary": "bg-tertiary-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(var(--tertiary-500-rgb),0.5)] hover:bg-tertiary-600 active:bg-tertiary-700 transition-all duration-300",
  "danger": "bg-red-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:bg-red-600 active:bg-red-700 transition-all duration-300",
  "success": "bg-green-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:bg-green-600 active:bg-green-700 transition-all duration-300",
}

export const Button = (props: ButtonProps) => {
  return (
    <button 
      className={`${sizeStyle[props.size]} ${variantStyle[props.variant]} cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className="flex items-center gap-2 justify-center pr-2 pl-2">
        {props.startIcon && props.startIcon}
        <span className="pr-2 pl-2">{props.title}</span>
        {props.endIcon && props.endIcon}
      </div>
    </button>
  );
};