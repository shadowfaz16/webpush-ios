import Head from 'next/head';
import Navbar from './core/Navbar';
import Footer from './footer';
import { useState } from 'react';


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [footerOpen, setFooterOpen] = useState(false);
    return (
        <>
            <Head>
                <title>W3Hub</title>
                <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='min-h-screen'
                style={{ backgroundImage: "url('/roombg.webp')", backgroundPosition: 'bottom', backgroundSize: 'cover' }}>
                <Navbar />
                {children}
                <Footer open={footerOpen} setOpen={setFooterOpen} />
            </main>
        </>
    )
};
export default Layout;
