"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 600;

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let animationFrameId: number;
    let currentImageIndex = 1;

    const renderImage = (img: HTMLImageElement) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Object-cover equivalent mapping
      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const getFrameUrl = (index: number) => {
      if (isMobile) {
        return `/mobile-frames/frame_${index.toString().padStart(6, "0")}.jpg`;
      } else {
        return `/desktop-frames/video_frames_60fps_jpg/frame_${index.toString().padStart(4, "0")}.jpg`;
      }
    };

    // Preload images in batches to prevent network/browser lag
    let loadedCount = 0;
    let isCancelled = false;
    
    const preloadImages = async () => {
      // Fast load for the first 10 frames
      const initialPromises = [];
      for (let i = 1; i <= Math.min(10, FRAME_COUNT); i++) {
        initialPromises.push(new Promise<void>((resolve) => {
          if (isCancelled) return resolve();
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            if (isCancelled) return resolve();
            loadedCount++;
            if (i === currentImageIndex) {
              if (animationFrameId) cancelAnimationFrame(animationFrameId);
              animationFrameId = requestAnimationFrame(() => renderImage(img));
            }
            resolve();
          };
          img.onerror = () => resolve();
          images[i - 1] = img;
        }));
      }
      await Promise.all(initialPromises);

      // Load the rest in small chunks sequentially
      const CHUNK_SIZE = 4;
      for (let i = 11; i <= FRAME_COUNT; i += CHUNK_SIZE) {
        if (isCancelled) break;
        const chunkPromises = [];
        for (let j = 0; j < CHUNK_SIZE && i + j <= FRAME_COUNT; j++) {
          chunkPromises.push(new Promise<void>((resolve) => {
            if (isCancelled) return resolve();
            const index = i + j;
            const img = new Image();
            img.src = getFrameUrl(index);
            img.onload = () => {
              if (isCancelled) return resolve();
              loadedCount++;
              if (index === currentImageIndex) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => renderImage(img));
              }
              resolve();
            };
            img.onerror = () => resolve();
            images[index - 1] = img;
          }));
        }
        await Promise.all(chunkPromises);
      }
    };

    preloadImages();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScrollTop <= 0) return;

      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      // Map 0-1 to 1-600
      const frameIndex = Math.max(1, Math.min(FRAME_COUNT, Math.floor(scrollFraction * FRAME_COUNT) + 1));

      if (currentImageIndex !== frameIndex) {
        currentImageIndex = frameIndex;
        if (images[frameIndex - 1] && images[frameIndex - 1].complete) {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(() => {
            renderImage(images[frameIndex - 1]);
          });
        }
      }
    };

    const handleCanvasResize = () => {
      updateCanvasSize();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleCanvasResize, { passive: true });

    return () => {
      isCancelled = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleCanvasResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-0">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
