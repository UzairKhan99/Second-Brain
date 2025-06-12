import { useEffect, useState } from "react";
import axios from "axios";

interface ContentItem {
    _id: string;
    title: string;
    links: Array<{
        url: string;
        type: string;
    }>;
    userId: string;
    tags: string[];
}

export function useContent() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getContent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No authentication token found");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:3000/api/v1/content",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("📝 Fetched content:", response.data);
                setContent(response.data.content || []);
            } catch (error) {
                console.error("❌ Error fetching content:", error);
                setError("Failed to fetch content");
            } finally {
                setLoading(false);
            }
        };

        getContent();
    }, []);

    return { content, error, loading };
}