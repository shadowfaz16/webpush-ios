import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Head from 'next/head';
import Navbar from './core/Navbar';
import Footer from './footer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [footerOpen, setFooterOpen] = useState(false);
    // const canvasRef = useRef<HTMLCanvasElement>(null);

    // useEffect(() => {
    //     if (!canvasRef.current) return;

    //     const scene = new THREE.Scene();

    //     const camera = new THREE.PerspectiveCamera(
    //         75,
    //         window.innerWidth / window.innerHeight,
    //         0.1,
    //         1000
    //     );

    //     const renderer = new THREE.WebGLRenderer({
    //         canvas: canvasRef.current,
    //         antialias: true,
    //     });

    //     renderer.setSize(window.innerWidth, window.innerHeight);

    //     // Adjust the camera position
    //     camera.position.setZ(50);

    //     const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    //     const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //     const box = new THREE.Mesh(boxGeometry, boxMaterial);
    //     scene.add(box);

    //     const controls = new OrbitControls(camera, renderer.domElement);

    //     const animate = () => {
    //         requestAnimationFrame(animate);

    //         box.rotation.x += 0.001;
    //         box.rotation.y += 0.001;

    //         controls.update();

    //         renderer.render(scene, camera);
    //     }

    //     animate();  // Start the animation loop

    // }, []);

    return (
        <>
            <Head>
                <title>Wallet Hub</title>
                <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <canvas ref={canvasRef} id="canvas"></canvas> */}
            <main className=''>
                <Navbar />
                {children}
                <Footer open={footerOpen} setOpen={setFooterOpen} />
            </main>
        </>
    );
};

export default Layout;
