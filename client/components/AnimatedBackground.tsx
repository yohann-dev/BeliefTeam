import { useEffect, useRef, ReactNode } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  brightness: number;
}

interface AnimatedBackgroundProps {
  children: ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Initialize nodes
    const initNodes = () => {
      const nodes: Node[] = [];
      const nodeCount = 20;
      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          hue: Math.random() * 60 + 200,
          brightness: Math.random() * 20 + 80,
        });
      }
      return nodes;
    };

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Initialize
    resizeCanvas();
    nodesRef.current = initNodes();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, rect.width * dpr, rect.height * dpr);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update nodes
      nodes.forEach(node => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          node.vx -= dx * 0.0001 * force;
          node.vy -= dy * 0.0001 * force;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > rect.width) {
          node.vx *= -0.8;
          node.x = node.x < 0 ? 0 : rect.width;
        }
        if (node.y < 0 || node.y > rect.height) {
          node.vy *= -0.8;
          node.y = node.y < 0 ? 0 : rect.height;
        }

        node.vx += (Math.random() - 0.5) * 0.02;
        node.vy += (Math.random() - 0.5) * 0.02;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 2) {
          node.vx = (node.vx / speed) * 2;
          node.vy = (node.vy / speed) * 2;
        }
      });

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach(node2 => {
          const dx = node1.x - node2.x;
          const dy = node1.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = 1 - (distance / 200);
            
            const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
            gradient.addColorStop(0, `hsla(${node1.hue}, 70%, ${node1.brightness}%, ${opacity * 0.2})`);
            gradient.addColorStop(1, `hsla(${node2.hue}, 70%, ${node2.brightness}%, ${opacity * 0.2})`);

            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw node with glow
        const gradient = ctx.createRadialGradient(
          node1.x, node1.y, 0,
          node1.x, node1.y, node1.radius * 2
        );
        gradient.addColorStop(0, `hsla(${node1.hue}, 70%, ${node1.brightness}%, 0.8)`);
        gradient.addColorStop(1, `hsla(${node1.hue}, 70%, ${node1.brightness}%, 0)`);

        ctx.beginPath();
        ctx.arc(node1.x, node1.y, node1.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(node1.x, node1.y, node1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node1.hue}, 70%, ${node1.brightness}%, 0.8)`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 bg-white"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 