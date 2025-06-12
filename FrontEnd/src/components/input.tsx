import { useState } from "react";
interface InputProps {
    type: string;
    placeholder: string;
    className: string;
    reference:any;
}
export const Input = ({type,placeholder,className,reference}:InputProps) => {
    const [value, setValue] = useState("");
    return (
        <input ref={reference} type={type} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} className={className} />
    )
}





export default Input;   