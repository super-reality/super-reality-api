import React, { CSSProperties, useCallback } from "react";
import path from "path";
import url from "url";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";
import electron from "../../../electron";
import jsonRpcRemote from "../../../utils/jsonRpcSend";
import "./index.scss";

function createSniper(): Promise<string> {
  console.log("createSniper");
  const { remote } = electron;

  const snipWindow = new remote.BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: false,
    opacity: 0.5,
    alwaysOnTop: true,
    resizable: true,
    movable: true,
    backgroundColor: "#00FFFFFF",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  snipWindow.on("closed", () => {
    remote.globalShortcut.unregister("Control+S");
    remote.globalShortcut.unregister("Control+D");
    snipWindow.destroy();
  });
  let translucent = false;

  remote.globalShortcut.register("Control+D", () => {
    translucent = !translucent;
    if (translucent == true) {
      snipWindow.setIgnoreMouseEvents(true);
    } else {
      snipWindow.setIgnoreMouseEvents(false);
    }
  });

  snipWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "..", "public", "dialog.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  return new Promise<string>((resolve, reject) => {
    remote.globalShortcut.register("Control+S", () => {
      if (snipWindow != null) {
        const pos = snipWindow.getPosition();
        const size = snipWindow.getSize();
        console.log(pos, size);
        snipWindow.close();

        jsonRpcRemote("snipImage", {
          posx: pos[0],
          posy: pos[1],
          width: size[0],
          height: size[1],
          path: "",
        })
          .then((res) => {
            const rescopy: any = res;
            const ImagePathCopy = rescopy.result.imgPath;
            console.log(ImagePathCopy);
            resolve(ImagePathCopy);
          })
          .catch((err) => {
            console.log("error ocurred checkmehere");
            reject(err);
            console.log(err);
          });
      } else {
        reject();
      }
    });
  });
}

function useMediaInsert(onFinish: (url: string) => void): () => void {
  const open = useCallback(() => {
    createSniper().then(onFinish);
  }, []);

  return open;
}

interface InsertMediaProps {
  callback: (url: string) => void;
  imgUrl?: string;
  style?: CSSProperties;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, imgUrl, style } = props;

  const openSnipTool = useMediaInsert(callback);

  return (
    <div
      className="insert-media-container"
      style={{ ...style, backgroundImage: `url(${imgUrl})` }}
      onClick={openSnipTool}
    >
      {imgUrl ? undefined : (
        <Add
          style={{ margin: "auto" }}
          fill="var(--color-text)"
          width="30px"
          height="30px"
        />
      )}
    </div>
  );
}
