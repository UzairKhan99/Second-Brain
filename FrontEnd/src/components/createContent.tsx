import { CrossIcon } from "../icons/crossIcon";
import { Button } from "./button";
import { useRef, useState } from "react";
import { Input } from "./input";
import axios from "axios";

enum ContentType {
    Youtube,
    Twitter,
}

export default function CreateContent({open, onClose}: {open: boolean, onClose: () => void}) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType>(ContentType.Youtube);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const addContent = async () => {
        try {
            setError(null);
            setLoading(true);
            
            const title = titleRef.current?.value;
            const link = linkRef.current?.value;
            
            if (!title || !link) {
                setError("Title and link are required");
                return;
            }

            // Log the data being sent
            const content = {
                title,
                links: [{ 
                    url: link, 
                    type: ContentType[type].toLowerCase() // Convert to lowercase
                }]
            };
            console.log("📝 Sending content data:", content);

            const token = localStorage.getItem("token");
            console.log("🔑 Using token:", token);

            const response = await axios.post(
                "http://localhost:3000/api/v1/content", 
                content,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("✅ Content created successfully:", response.data);

            // Clear form and close modal on success
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            onClose();
        } catch (err) {
            console.error("❌ Error adding content:", err);
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message;
                setError(`Failed to add content: ${errorMessage}`);
                console.error("Server response:", err.response?.data);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {open && (
                <div className="backdrop-blur-lg w-screen h-screen bg-black/30 fixed top-0 left-0 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-[32rem] transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Create Content</h2>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <CrossIcon size="lg" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <Input 
                                    placeholder="Enter content title..." 
                                    reference={titleRef}
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Link</label>
                                <Input 
                                    placeholder="Paste your content link..." 
                                    reference={linkRef}
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                                />
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Button 
                                    variant={type === ContentType.Youtube ? "primary" : "secondary"}
                                    size="lg" 
                                    title="Youtube" 
                                    onClick={() => setType(ContentType.Youtube)}
                                />
                                <Button 
                                    variant={type === ContentType.Twitter ? "primary" : "secondary"} 
                                    size="lg" 
                                    title="Twitter" 
                                    onClick={() => setType(ContentType.Twitter)}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    title={loading ? "Creating..." : "Create Content"}
                                    onClick={addContent}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </> 
    );
}