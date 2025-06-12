import React, { useEffect } from 'react';

interface CardProps {
  title: string;
  content: string;
  contentType?: "youtube" | "twitter";
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  endIcon2?: React.ReactElement;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  onShare?: () => void;
  onDelete?: () => void;
}

const sizeVariants = {
  sm: "w-56",
  md: "w-72",
  lg: "w-80"
}

const variantStyles = {
  primary: "bg-primary-50 hover:bg-primary-200 active:bg-primary-300 border-primary-200",
  secondary: "bg-secondary-50 hover:bg-secondary-200 active:bg-secondary-300 border-secondary-200"
}

export const Card = (props: CardProps) => {
  const getEmbedUrl = (url: string, type: "youtube" | "twitter" = "youtube") => {
    if (type === "youtube") {
      // Handle different YouTube URL formats
      let videoId = "";
      try {
        const urlObj = new URL(url);
        
        if (urlObj.hostname.includes("youtube.com")) {
          videoId = urlObj.searchParams.get("v") || "";
        } else if (urlObj.hostname.includes("youtu.be")) {
          videoId = urlObj.pathname.slice(1);
        }
        
        if (!videoId) return url;
        return `https://www.youtube.com/embed/${videoId}`;
      } catch (error) {
        return url;
      }
    }
    return url;
  };

  // Load Twitter embed script
  useEffect(() => {
    if (props.contentType === 'twitter') {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [props.contentType]);

  return (
    <div className="flex flex-col justify-center items-center font-rubik">
      <div className={`
        ${sizeVariants[props.size]}
        ${variantStyles[props.variant]}
        m-3 rounded-xl border
        shadow-sm hover:shadow-lg
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
        overflow-hidden
      `}>
        <div className="p-4 bg-white">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-2">
                {props.startIcon}
                <span className="text-gray-600 text-sm line-clamp-1 font-rubik capitalize">{props.contentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <div onClick={props.onShare} className="cursor-pointer hover:text-primary-500 transition-colors">
                  {props.endIcon}
                </div>
                <div onClick={props.onDelete} className="cursor-pointer hover:text-red-500 transition-colors">
                  {props.endIcon2}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-800 line-clamp-1 mb-1 font-rubik">{props.title}</h2>
            </div>
            
            <div className="min-h-[190px] max-h-[220px] overflow-hidden">
              {props.contentType === 'youtube' ? (
                <iframe 
                  className="w-full h-full rounded"
                  src={getEmbedUrl(props.content)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : props.contentType === 'twitter' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <blockquote 
                    className="twitter-tweet" 
                    data-theme="light"
                    data-width="100%"
                    data-dnt="true"
                  >
                    <a href={props.content}></a>
                  </blockquote>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No preview available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};