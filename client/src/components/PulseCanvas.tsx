import { useEffect, useRef } from 'react';

export default function PulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create pulsing effect
      const time = Date.now() * 0.002;
      const radius = 50 + Math.sin(time) * 20;
      
      // Get CSS variable value
      const vaultCyan = getComputedStyle(document.documentElement)
        .getPropertyValue('--vault-cyan') || '#00bcd4';
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.strokeStyle = vaultCyan;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add additional pulse rings
      for (let i = 1; i <= 3; i++) {
        const ringRadius = radius + (i * 30);
        const alpha = Math.max(0, 1 - (i * 0.3) - Math.sin(time + i) * 0.2);
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = vaultCyan + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      className="absolute top-0 left-0 w-full h-full cursor-pointer"
    />
  );
}
