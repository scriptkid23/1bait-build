import "./App.css";
import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "../build/WebGL Builds.loader.js",
    dataUrl: "../build/WebGL Builds.data",
    frameworkUrl: "../build/WebGL Builds.framework.js",
    codeUrl: "../build/WebGL Builds.wasm",
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Function to update the device pixel ratio
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };

    // Function to update the dimensions of the Unity component
    const updateDimensions = () => {
      setIsMobile(window.innerWidth <= 768);
      if (isMobile) {
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

    // Media matcher for device pixel ratio changes
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);

    // Event listener for window resize
    window.addEventListener("resize", updateDimensions);

    // Initial dimensions setup
    updateDimensions();

    return () => {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [devicePixelRatio, isMobile]);

  console.log(devicePixelRatio);

  return (
    <Unity
      unityProvider={unityProvider}
      style={{ width: dimensions.width, height: dimensions.height }}
      devicePixelRatio={devicePixelRatio}
    />
  );
}

export default App;
