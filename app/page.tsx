"use client";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Home() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/build/WebGL Builds.loader.js",
    dataUrl: "/build/WebGL Builds.data",
    frameworkUrl: "/build/WebGL Builds.framework.js",
    codeUrl: "/build/WebGL Builds.wasm",
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });

  useEffect(() => {
    // Set initial states after component mounts
    setDevicePixelRatio(window.devicePixelRatio);

    // Function to update the device pixel ratio
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };

    // Function to update the dimensions of the Unity component
    const updateDimensions = () => {
      if (window.innerWidth <= 768) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } else {
        setDimensions({
          width: 375,
          height: 667,
        });
      }
    };

    // Initial dimensions setup
    updateDimensions();

    // Media matcher for device pixel ratio changes
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${window.devicePixelRatio}dppx)`
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);

    // Event listener for window resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <Unity
      unityProvider={unityProvider}
      style={{ width: dimensions.width, height: dimensions.height }}
      devicePixelRatio={devicePixelRatio}
    />
  );
}
