import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
    return (
        <nav className="navigation">
            <ul className="nav-list">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/showcase">Showcase</Link>
                </li>
                <li>
                    <Link href="/about">About Us</Link>
                </li>
                <li>
                    <Link href="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;