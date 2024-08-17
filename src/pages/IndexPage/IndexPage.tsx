import { useInitData } from "@telegram-apps/sdk-react";
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

  const data = useInitData();

  console.log(data);

  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/build/WebGL Builds.loader.js",
    dataUrl: "/build/WebGL Builds.data",
    frameworkUrl: "/build/WebGL Builds.framework.js",
    codeUrl: "/build/WebGL Builds.wasm",
  });

  const handleSendMessage = () => {
    if (!data || !isLoaded) return;

    sendMessage(
      "UserManager",
      "GetUserInfoFromTelegram",
      JSON.stringify({
        user_id: data.user?.id,
        first_name: data.user?.firstName,
        last_name: data.user?.lastName,
        username: data.user?.username,
      })
    );
  };

  useEffect(() => {
    if (isLoaded) {
      console.log("SEND_DATA_FROM_TELEGRAM", data?.user);
      handleSendMessage();
    }
  }, [isLoaded]);

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
