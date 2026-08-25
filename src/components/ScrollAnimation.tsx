"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 600;

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

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

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const images: HTMLImageElement[] = [];

    const currentFrame = (index: number) =>
      `/frames/frame_${index.toString().padStart(4, "0")}.jpg`;

    // Preload images
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        if (i === 1) {
          renderImage(img);
        }
      };
      images.push(img);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.body.scrollHeight - window.innerHeight;

      if (maxScrollTop <= 0) return;

      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );

      if (images[frameIndex] && images[frameIndex].complete) {
        requestAnimationFrame(() => {
          renderImage(images[frameIndex]);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", () => {
      updateCanvasSize();
      handleScroll();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: -10 }}>
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {/* Light overlay to ensure the dark text is readable over the animation */}
      <div className="absolute inset-0 bg-white/50" />
    </div>
  );
}
