import React, { useEffect } from "react";
import UploadForm from "./UploadForm";

function DetectUSB() {
  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const handleStorageEvent = (event) => {
    if (event.storageArea === navigator && event.key === "usb") {
      UploadForm();
    }
  };

  return <div></div>;
}

export default DetectUSB;
