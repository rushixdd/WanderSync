import React from 'react';

// Footer component: Displays copyright information and links.
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-8 text-center">
            <div className="container mx-auto px-4">
                {/* Optional GitHub link */}
                <div className="mb-4">
                    <a
                        href="https://github.com/rushixdd/wandersync"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-lg"
                    >
                        GitHub
                    </a>
                </div>
                {/* Placeholder for future features */}
                <p className="text-gray-500 mb-2 text-md">Features Coming Soon: Interactive maps, detailed timelines, and more!</p>
                {/* Small note about the creators */}
                <p className="text-gray-500 text-sm">Built with ❤️ by data & travel enthusiasts.</p>
            </div>
        </footer>
    );
};

export default Footer;