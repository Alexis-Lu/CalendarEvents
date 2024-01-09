import { useEffect } from "react";
import { Event as EventType } from "../types/event";

export default function Event({
  event,
  windowSizes,
  position,
}: {
  event: EventType;
  windowSizes: any;
  position: any;
}) {
  useEffect(() => {}, [windowSizes, position]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left + 5}px`,
        height: `${position.height}px`,
        width: `${position.width - 10}px`,
        border: "1px dashed black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {`${event.start} (${event.duration} min)`}
    </div>
  );
}
