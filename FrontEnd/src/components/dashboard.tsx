import { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';

import { Button } from '../components/button';
import { ArrowRightIcon } from '../icons/Plusicons';
import { ShareIcon } from '../icons/shareIcon';
import { Card } from '../components/card';
import { VideoIcon } from '../icons/videoIcon';
import { TwitterIcon } from '../icons/twitterIcon';
import { DeleteIcon } from '../icons/deleteIcon';
import CreateContent from '../components/createContent';
import Sidebar from '../components/sidebar';
import { useContent } from '../hooks/useContent';

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:3000/api/v1/content',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setContents(response.data.content || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleShare = async (contentId: string) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/brain/share',
        { contentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      await navigator.clipboard.writeText(response.data.shareLink);
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      setLoading(true);
      await axios.delete('http://localhost:3000/api/v1/content', {
        data: { contentId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the local state to remove the deleted item
      setContents(prevContents => prevContents.filter((item: any) => item._id !== contentId));
      
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalShare = () => {
    // If no content is selected, show a message
    if (contents.length === 0) {
      alert('No content available to share. Add some content first!');
      return;
    }

    // Open a modal or dialog to select content to share
    alert('Select content from the cards below to share!');
  };

  return (
    <>
      <div className="flex flex-row">
        {/* Sidebar Section */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {/* Modal to Add Content */}
          <CreateContent 
            open={open} 
            onClose={() => {
              setOpen(false);
              fetchContents(); // Refresh content after adding
            }} 
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 p-4">
            <Button
              onClick={() => setOpen(true)}
              variant="primary"
              startIcon={<ArrowRightIcon size="lg" />}
              size="md"
              title="Add"
            />
            <Button
              variant="secondary"
              startIcon={<ShareIcon size="lg" />}
              size="md"
              title="Share"
              onClick={handleGlobalShare}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 m-8 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          {/* Cards Display */}
          <div className="flex flex-wrap gap-8 p-8">
            {contents.map((item: any) => (
              <Card
                key={item._id}
                title={item.title}
                content={item.links[0]?.url || ''}
                contentType={item.links[0]?.type.toLowerCase() as 'youtube' | 'twitter'}
                variant="secondary"
                size="lg"
                startIcon={item.links[0]?.type.toLowerCase() === 'youtube' ? <VideoIcon size="md" /> : <TwitterIcon size="md" />}
                endIcon={<ShareIcon size="md" />}
                endIcon2={<DeleteIcon size="md" />}
                onShare={() => handleShare(item._id)}
                onDelete={() => handleDelete(item._id)}
              />
            ))}

            {!loading && !error && contents.length === 0 && (
              <div className="w-full text-center text-gray-500 p-8">
                No content found. Click the "Add" button to create your first content.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
