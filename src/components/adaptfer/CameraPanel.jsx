import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const CameraPanel = forwardRef(function CameraPanel(
  {
    label = "Camera Feed",
    status = "Standby",
    active = false,
    overlay = null,
    corners = true,
    className = "",
  },
  ref
) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        setCameraError("");

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not supported by this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (error) {
        console.error("Camera error:", error);
        setCameraError(error?.message || "Unable to access camera.");
        setCameraReady(false);
      }
    }

    startCamera();

    return () => {
      cancelled = true;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    captureFrame() {
      const video = videoRef.current;

      if (
        !video ||
        !cameraReady ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return null;
      }

      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        return null;
      }

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          0.9
        );
      });
    },

    isReady() {
      return cameraReady;
    },
  }));

  return (
    <div
      className={`panel relative aspect-[4/3] w-full overflow-hidden ${
        active ? "panel-glow" : ""
      } ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {!cameraReady && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <span className="mono-label">
            Starting camera...
          </span>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background p-8 text-center">
          <div>
            <p className="font-display text-lg font-semibold">
              Camera unavailable
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {cameraError}
            </p>
          </div>
        </div>
      )}

      {active && (
        <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-16 [background:linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      )}

      {corners &&
        [
          "left-4 top-4 border-l border-t",
          "right-4 top-4 border-r border-t",
          "left-4 bottom-4 border-l border-b",
          "right-4 bottom-4 border-r border-b",
        ].map((pos) => (
          <span
            key={pos}
            className={`pointer-events-none absolute h-5 w-5 rounded-[3px] border-primary/60 ${pos}`}
          />
        ))}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        <span className="mono-label rounded bg-background/70 px-2 py-1">
          {label}
        </span>

        <span className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              cameraReady
                ? active
                  ? "animate-status bg-primary"
                  : "bg-primary"
                : "bg-muted-foreground"
            }`}
          />

          <span className="mono-label !text-[10px]">
            {cameraError
              ? "Camera error"
              : !cameraReady
                ? "Connecting"
                : status}
          </span>
        </span>
      </div>

      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {overlay}
        </div>
      )}
    </div>
  );
});

export default CameraPanel;