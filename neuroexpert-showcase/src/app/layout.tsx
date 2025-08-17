import React, { ReactNode } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navigation from '../components/layout/Navigation';
import '../styles/components.css';
import '../styles/showcase.css';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Header />
            <Navigation />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;