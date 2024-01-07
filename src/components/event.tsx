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
        left: `${position.left}px`,
        height: `${position.height}px`,
        width: `${position.width}px`,
        border: "1px solid black",
      }}
    >
      {event.id}
    </div>
  );
}
