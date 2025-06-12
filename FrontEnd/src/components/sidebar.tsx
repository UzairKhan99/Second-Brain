import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle button */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 p-4 md:hidden z-50">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20 md:hidden',
          { 'hidden': !isOpen }
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:transform-none',
          {
            '-translate-x-full': !isOpen,
            'translate-x-0': isOpen
          }
        )}
      >
        <div className="p-6 border-b">
            <div className="flex flex-row items-center justify-start gap-2">
                <img src={logo} alt="Second Brain Logo" className="w-10 h-10 object-contain" />
                <h2 className="text-xl font-medium font-rubik hover:text-blue-600 transition-colors cursor-pointer">Second Brain</h2>
            </div>
        </div>
        <nav className="flex flex-col gap-4 p-6">
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-rubik">Tweets</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-rubik">Videos</a>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
