import { useInitData, useLaunchParams } from "@telegram-apps/sdk-react";
import { initViewport, requestViewport } from "@telegram-apps/sdk";
import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { isMobile } from "react-device-detect";

import "./App.css";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/build/WebGL Builds.loader.js",
    dataUrl: "/build/WebGL Builds.data",
    frameworkUrl: "/build/WebGL Builds.framework.js",
    codeUrl: "/build/WebGL Builds.wasm",
  });

  const initDataRaw = useLaunchParams().initDataRaw;
  console.log(initDataRaw);

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const init = async () => {
      const viewportPromise = initViewport();
      const viewport = await viewportPromise[0];

      const updateDimensions = (data: any) => {
        setDimensions({
          width: data.width,
          height: data.height,
        });
      };

      const viewportData = await requestViewport();
      updateDimensions(viewportData);

      viewport.on("change:height", (height) => {
        setDimensions((prev) => ({
          ...prev,
          height,
        }));
      });

      viewport.on("change:width", (width) => {
        setDimensions((prev) => ({
          ...prev,
          width,
        }));
      });

      viewport.on("change:isExpanded", (isExpanded) => {
        if (isExpanded) {
          // Handle expansion logic if necessary
        }
      });
    };

    init();

    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };

    const updateDimensions = () => {
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

    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);

    window.addEventListener("resize", updateDimensions);

    updateDimensions();

    return () => {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [devicePixelRatio, isMobile]);

  return (
    <Unity
      unityProvider={unityProvider}
      style={{ width: dimensions.width, height: dimensions.height }}
      devicePixelRatio={devicePixelRatio}
    />
  );
}

export default App;
