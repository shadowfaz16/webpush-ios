import Head from 'next/head';
import Navbar from './core/Navbar';



const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
        <Head>
            <title>PXM Exchange</title>
            <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className=''>
            <Navbar />
            {children}
        </main>
    </>
);
export default Layout;
