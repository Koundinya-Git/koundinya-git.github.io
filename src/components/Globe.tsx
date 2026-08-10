import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe({ size = 400 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 4.0; // Start rotated closer to India

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 1, // 1 = dark mode, renders dots in baseColor over a transparent/dark background
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.8, 0.8, 0.8], // Light grey for the dots to show up!
      markerColor: [0.33, 1, 0.33], // Accent neon green
      glowColor: [0.1, 0.1, 0.1], // Slight subtle glow
      markers: [
        // Hyderabad, India coordinates
        { location: [17.3850, 78.4867], size: 0.1 }
      ],
      onRender: (state) => {
        // Automatically spin slowly
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
          contain: "layout paint size",
          cursor: "grab",
        }}
      />
    </div>
  );
}
