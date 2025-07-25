import { useEffect, useRef } from 'react';

interface PriceChartProps {
  data?: number[];
  labels?: string[];
}

export default function PriceChart({ 
  data = [245.20, 246.15, 247.83, 249.12, 247.95, 248.67, 247.83],
  labels = ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now']
}: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const padding = 50;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      
      const minPrice = Math.min(...data);
      const maxPrice = Math.max(...data);
      const priceRange = maxPrice - minPrice || 1;
      
      // Get CSS variable value
      const primaryBlue = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-blue') || '#0071e3';
      
      // Draw grid lines
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
      
      // Draw price line
      ctx.strokeStyle = primaryBlue;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      data.forEach((price, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw price points
      ctx.fillStyle = primaryBlue;
      data.forEach((price, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    drawChart();
  }, [data, labels]);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="300"
      className="mx-auto"
    />
  );
}
