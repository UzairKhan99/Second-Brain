export default function Box({placeholder, onChange}: {placeholder: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <div className="flex flex-col gap-2">
            <input 
                placeholder={placeholder} 
                type="text" 
                className="border-2 border-gray-300 rounded-md p-2"
                onChange={onChange}
                
            />
        </div>
    );
}