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
    let renderedImageIndex = 0;

    const renderImage = (img: HTMLImageElement) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const renderClosestFrame = () => {
      let closestFrameIndex = currentImageIndex - 1;
      
      if (images[closestFrameIndex] && images[closestFrameIndex].complete) {
         // Exact match
      } else {
         let offset = 1;
         let found = false;
         while (offset < FRAME_COUNT) {
           const down = closestFrameIndex - offset;
           const up = closestFrameIndex + offset;
           if (down >= 0 && images[down] && images[down].complete) {
              closestFrameIndex = down; found = true; break;
           }
           if (up < FRAME_COUNT && images[up] && images[up].complete) {
              closestFrameIndex = up; found = true; break;
           }
           offset++;
         }
         if (!found) return; // Nothing loaded yet
      }

      const targetFrame = closestFrameIndex + 1;
      if (renderedImageIndex !== targetFrame) {
         renderedImageIndex = targetFrame;
         if (animationFrameId) cancelAnimationFrame(animationFrameId);
         animationFrameId = requestAnimationFrame(() => {
            renderImage(images[closestFrameIndex]);
         });
      }
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

    let isCancelled = false;
    
    const getLoadSequence = () => {
      const sequence: number[] = [];
      const added = new Set<number>();
      
      const add = (i: number) => {
        if (i >= 1 && i <= FRAME_COUNT && !added.has(i)) {
          sequence.push(i);
          added.add(i);
        }
      };
      
      for (let i = 1; i <= 10; i++) add(i);
      for (let i = 20; i <= FRAME_COUNT; i += 20) add(i);
      for (let i = 10; i <= FRAME_COUNT; i += 10) add(i);
      for (let i = 5; i <= FRAME_COUNT; i += 5) add(i);
      for (let i = 1; i <= FRAME_COUNT; i++) add(i);
      
      return sequence;
    };

    const preloadImages = async () => {
      const sequence = getLoadSequence();
      
      const initialPromises = [];
      for (let k = 0; k < 10; k++) {
        const index = sequence[k];
        initialPromises.push(new Promise<void>((resolve) => {
          if (isCancelled) return resolve();
          const img = new Image();
          images[index - 1] = img;
          img.src = getFrameUrl(index);
          img.onload = () => {
            if (isCancelled) return resolve();
            
            const currentDistance = Math.abs(currentImageIndex - renderedImageIndex);
            const newDistance = Math.abs(currentImageIndex - index);
            if (renderedImageIndex === 0 || newDistance < currentDistance) {
               renderClosestFrame();
            }
            resolve();
          };
          img.onerror = () => resolve();
        }));
      }
      await Promise.all(initialPromises);

      const CHUNK_SIZE = 4;
      for (let k = 10; k < sequence.length; k += CHUNK_SIZE) {
        if (isCancelled) break;
        const chunkPromises = [];
        for (let j = 0; j < CHUNK_SIZE && k + j < sequence.length; j++) {
          const index = sequence[k + j];
          chunkPromises.push(new Promise<void>((resolve) => {
            if (isCancelled) return resolve();
            const img = new Image();
            images[index - 1] = img;
            img.src = getFrameUrl(index);
            img.onload = () => {
              if (isCancelled) return resolve();
              
              const currentDistance = Math.abs(currentImageIndex - renderedImageIndex);
              const newDistance = Math.abs(currentImageIndex - index);
              if (renderedImageIndex === 0 || newDistance < currentDistance) {
                 renderClosestFrame();
              }
              resolve();
            };
            img.onerror = () => resolve();
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
      const frameIndex = Math.max(1, Math.min(FRAME_COUNT, Math.floor(scrollFraction * FRAME_COUNT) + 1));

      if (currentImageIndex !== frameIndex) {
        currentImageIndex = frameIndex;
        renderClosestFrame();
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
