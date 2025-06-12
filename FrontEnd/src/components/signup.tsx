/**
 * Signup Component
 * 
 * This component handles user registration with the following features:
 * - Form validation
 * - Loading states
 * - Error handling
 * - Success feedback
 * - API integration with backend
 */

import { useState, useRef } from "react";
import { Input } from "../components/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Backend API URL - Consider moving this to an environment variable
const API_URL = "http://localhost:3000/api/v1/signup";

export const Signup = () => {
    // =============== State Management ===============
    // Loading state for submission status
    const [loading, setLoading] = useState(false);
    // Error state for displaying error messages
    const [error, setError] = useState<string | null>(null);
    // Success state for displaying success message
    const [success, setSuccess] = useState(false);

    // =============== Form References ===============
    // Refs to directly access input field values
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    
    // Initialize navigate hook
    const navigate = useNavigate();

    /**
     * Handle form submission
     * @param e - Form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Get form values
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        // =============== Form Validation ===============
        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }

        // =============== Request Preparation ===============
        // Reset states before submission
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // =============== API Call ===============
            const response = await axios.post(
                API_URL, 
                { username, password },
                { 
                    headers: { 'Content-Type': 'application/json' }
                }
            );  
            
            // =============== Success Handling ===============
            console.log("Signup successful:", response.data);
            setSuccess(true);
            
            // Clear form fields after successful signup
            if (usernameRef.current) usernameRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';

            // Automatically redirect to signin after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);
            
        } catch (err: any) {
            // =============== Error Handling ===============
            console.error("Signup error:", err);
            // Display error message from server or fallback to generic message
            setError(err.response?.data?.message || "An error occurred during signup");
        } finally {
            // Reset loading state regardless of outcome
            setLoading(false);
        }
    };

    return (
        
        // =============== Layout Container ===============
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            
            {/* Form Container */}
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                {/* =============== Header Section =============== */}
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Sign up to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome to Second Brain! Please enter your details.
                    </p>
                </div>

                {/* =============== Feedback Messages =============== */}
                {/* Error Alert */}
                {error && (
                    <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Success Alert */}
                {success && (
                    <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                        Signup successful! Redirecting to login...
                    </div>
                )}

                {/* =============== Signup Form =============== */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Input Fields Container */}
                    <div className="rounded-md space-y-4">
                        {/* Username Field */}
                        <Input
                            type="text" 
                            placeholder="Username" 
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                            reference={usernameRef}
                        />
                        
                        {/* Password Field */}
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                            reference={passwordRef}
                        />
                    </div>

                    {/* =============== Submit Button =============== */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            // Loading State with Spinner
                            <span className="flex items-center">
                                {/* Loading Spinner SVG */}
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing up...
                            </span>
                        ) : (
                            // Default Button Text
                            "Sign up"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
