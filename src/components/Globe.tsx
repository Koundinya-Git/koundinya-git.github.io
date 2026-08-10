import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe({ size = 400 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 4.0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 1, // dark mode
      diffuse: 1.2,
      mapSamples: 12000,
      mapBrightness: 6,
      baseColor: [1, 1, 1], 
      markerColor: [0.33, 1, 0.33], 
      glowColor: [1, 1, 1], 
      markers: [
        { location: [17.3850, 78.4867], size: 0.1 }
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => {
      globe.destroy();
    };
  }, [size]); // Re-initialize if size prop changes

  return (
    <div style={{ width: '100%', maxWidth: `${size}px`, aspectRatio: '1', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          cursor: 'grab',
          opacity: 1,
        }}
      />
      {/* Soft gradient overlay to blend edges into background */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(10,10,10,0) 50%, rgba(10,10,10,0.8) 100%)'
        }}
      />
    </div>
  );
}
