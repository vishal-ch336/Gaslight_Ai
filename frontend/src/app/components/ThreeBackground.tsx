import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Fine line lattice
    const material = new THREE.LineBasicMaterial({
        color: 0xC9A86A,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.BufferGeometry();
    const points = [];
    const size = 100;
    const step = 4;

    for (let i = -size; i <= size; i += step) {
        points.push(new THREE.Vector3(-size, 0, i));
        points.push(new THREE.Vector3(size, 0, i));
        points.push(new THREE.Vector3(i, 0, -size));
        points.push(new THREE.Vector3(i, 0, size));
    }

    geometry.setFromPoints(points);
    const grid = new THREE.LineSegments(geometry, material);
    grid.position.y = -10;
    scene.add(grid);

    // Sparse anchors
    const anchorGeo = new THREE.BufferGeometry();
    const anchorPoints = [];
    for(let i = 0; i < 200; i++) {
        anchorPoints.push(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 150
        );
    }
    anchorGeo.setAttribute('position', new THREE.Float32BufferAttribute(anchorPoints, 3));
    const anchorMat = new THREE.PointsMaterial({
        color: 0xA39E93,
        size: 0.5,
        transparent: true,
        opacity: 0.4
    });
    const anchors = new THREE.Points(anchorGeo, anchorMat);
    scene.add(anchors);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);

    let startTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = (performance.now() - startTime) / 1000;

      grid.position.z = (elapsedTime * 2) % step;
      anchors.rotation.y = elapsedTime * 0.02;
      
      targetX = mouseX * 5;
      targetY = mouseY * 2 + 10;
      
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      anchorGeo.dispose();
      anchorMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none bg-black" />;
}
