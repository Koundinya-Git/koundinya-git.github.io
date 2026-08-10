import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe({ size = 400 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 4.0;
    let globe: any = null;

    if (!canvasRef.current) return;

    const initGlobe = () => {
      if (globe) globe.destroy();
      
      const width = canvasRef.current!.offsetWidth;
      // Get exact device pixel ratio to prevent rendering bugs on Windows/Chrome
      const dpr = window.devicePixelRatio || 1;

      globe = createGlobe(canvasRef.current!, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: 0,
        theta: 0.2,
        dark: 1, 
        diffuse: 1.2,
        mapSamples: 12000,
        mapBrightness: 6,
        baseColor: [1, 1, 1], // White dots
        markerColor: [0.33, 1, 0.33], // Neon green marker
        glowColor: [0.2, 0.2, 0.2], // Soft white/grey glow
        markers: [
          { location: [17.3850, 78.4867], size: 0.1 }
        ],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.005;
        },
      });
    };

    // Initialize after a tiny delay to ensure CSS has applied layout
    setTimeout(initGlobe, 100);

    const resizeObserver = new ResizeObserver(() => {
      initGlobe();
    });
    
    resizeObserver.observe(canvasRef.current);

    return () => {
      if (globe) globe.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{
      width: "100%",
      maxWidth: `${size}px`,
      aspectRatio: "1",
      margin: "0 auto",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />
    </div>
  );
}
