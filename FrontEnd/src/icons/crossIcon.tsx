interface IconProps {
    size: "sm" | "md" | "lg";
}

const iconSizeVariants = {
    sm: "size-2",
    md: "size-4", 
    lg: "size-6"
}   

export const CrossIcon = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSizeVariants[props.size]}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}