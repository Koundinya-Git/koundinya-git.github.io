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
      dark: 1, // dark mode (dots on transparent background)
      diffuse: 1.2,
      mapSamples: 12000, // Reduced from 16000 for better compatibility
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

    return () => {
      globe.destroy();
    };
  }, [size]);

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
          maxWidth: `${size}px`,
          maxHeight: `${size}px`,
          cursor: "grab",
        }}
      />
    </div>
  );
}
