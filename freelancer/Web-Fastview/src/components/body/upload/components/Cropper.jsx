import React, { useState, useCallback, useEffect } from "react";
import EasyCrop from "react-easy-crop";
import getCroppedImg from "./Crop";

// import { CropperProps } from "../Upload.types";

import "./Cropper.scss";
import Button from "../../button";

const Cropper = ({ src, name, onSave, config }) => {
  const [imageSrc, setImageSrc] = React.useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const resetDefault = () => {
    setCroppedImage(null);
    setRotation(0);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
  };

  const onLoad = useCallback(
    async (src) => {
      resetDefault();

      setImageSrc(src);
      console.log("[Cropper] Imagem Carregada com Sucesso!");
    },
    [src]
  );

  useEffect(() => {
    if (!src) {
      console.error("[Cropper] SRC não encontrado!");
      return;
    }

    onLoad(src);
  }, [src]);

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const saveCropped = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        name,
        croppedAreaPixels,
        rotation
      );

      console.log("[Cropper] Imagem Cortada com Sucesso:", croppedImage);

      setCroppedImage(croppedImage);
      onSave(croppedImage);
    } catch (e) {
      console.error("[Cropper] Erro ao Cortar Imagem", e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  return (
    <div className="cropperBack">
      <div className="cropperRoot">
        <div className="cropContainer">
          <EasyCrop
            style={{
              containerStyle: {
                borderRadius: "6px 6px 0 0",
              },
            }}
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            maxZoom={config.maxZoom}
            aspect={config.aspectRatio}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="controls">
          <div className="sliderContainer mb-3">
            <div>
              <h3>Zoom</h3>
              <input
                type="range"
                value={zoom}
                min={1}
                max={config.maxZoom}
                step={0.1}
                aria-labelledby="Zoom"
                className="slider"
                onChange={(e) => setZoom(parseInt(e.target.value))}
              />
            </div>
            <div>
              <h3>Rotação</h3>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                className="slider"
                onChange={(e) => setRotation(parseInt(e.target.value))}
              />
            </div>
          </div>
          <Button type="button" onClick={saveCropped}>Confirmar edição</Button>
        </div>
      </div>
    </div>
  );
};

export default Cropper;
