import React from "react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
    return (
        <div className="w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
            {/* Floating 404 Text */}
            <motion.h1
                className="text-white text-9xl font-extrabold drop-shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                404
            </motion.h1>

            <motion.p
                className="text-gray-400 text-2xl mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Oops! The page you're looking for doesn't exist.
            </motion.p>

            {/* Animated Floating UFO */}
            <motion.img
                src="/assets/vectors/ufo.svg"
                alt="UFO"
                className="absolute top-20 left-10 w-36 animate-bounce invert"
                animate={{ x: [0, 20, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />

            {/* SVG Animated Waves */}
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="absolute bottom-0 w-full"
                initial={{ y: 0 }}
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <path
                    fill="#0099ff"
                    fillOpacity="1"
                    d="M0,160L60,181.3C120,203,240,245,360,224C480,203,600,117,720,85.3C840,53,960,75,1080,106.7C1200,139,1320,181,1380,202.7L1440,224V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
                ></path>
            </motion.svg>
        </div>
    );
};

export default NotFound;