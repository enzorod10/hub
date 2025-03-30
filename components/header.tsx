import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Your Own Hub</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="#" className="hover:underline">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;