import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

interface NavbarUserMenuProps {
    onClose?: () => void;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ onClose }) => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "register" && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log(`${mode === "login" ? "Login" : "Register"} with:`, { email, password, confirmPassword });
        // Add your logic here
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black/80 z-[9999] flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl max-w-md w-full border border-gray-800 transform transition-all duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-light tracking-wide text-white">
                            {mode === "login" ? "Sign In" : "Register"}
                        </h1>
                        <button
                            onClick={onClose}
                            className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <AiOutlineMail className="absolute top-3 left-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <AiOutlineLock className="absolute top-3 left-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="relative">
                                <AiOutlineLock className="absolute top-3 left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                    required
                                />
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Forgot password clicked");
                                    }}
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm"
                        >
                            {mode === "login" ? "Login" : "Register"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        {mode === "login" ? (
                            <p className="text-sm text-gray-400">
                                Don’t have an account?{" "}
                                <button
                                    onClick={() => setMode("register")}
                                    className="text-blue-600 cursor-pointer hover:text-blue-500 transition-colors duration-200 font-semibold"
                                >
                                    Register
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setMode("login")}
                                    className="text-blue-600 cursor-pointer hover:text-blue-500 transition-colors duration-200 font-semibold"
                                >
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarUserMenu;