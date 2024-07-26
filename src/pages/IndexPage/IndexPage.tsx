import { useEffect, useState, type FC } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import { Unity, useUnityContext } from "react-unity-webgl";

export const IndexPage: FC = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  useEffect(() => {
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };

    const updateDimensions = () => {
      if (isBrowser) {
        setDimensions({
          width: 375,
          height: 667,
        });
      } else if (isMobile) {
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
};
