import "./App.css";
import { useState, useLayoutEffect } from "react";
import Event from "./components/event";
import { Event as EventType } from "./types/event";

function App() {
  const windowSizes = useWindowSize();
  const [eventWithpositions, setEventWithPositions] = useState<any[]>([]);
  const [_shouldUpdatePositions, setShouldUpdatePositions] = useState(true);
  const events: EventType[] = [
    {
      id: 1,
      start: "8:00",
      duration: 90,
    },
    {
      id: 2,
      start: "20:00",
      duration: 60,
    },
    {
      id: 3,
      start: "20:30",
      duration: 30,
    },
    {
      id: 4,
      start: "8:30",
      duration: 90,
    },
    {
      id: 5,
      start: "9:00",
      duration: 90,
    },
    {
      id: 6,
      start: "20:00",
      duration: 60,
    },
    {
      id: 7,
      start: "14:00",
      duration: 60,
    },
  ];

  const sortAndCleanEvents = (events: EventType[]) => {
    return events
      .sort((a, b) => {
        const startTimeA = getTimeInMinutes(a.start);
        const startTimeB = getTimeInMinutes(b.start);
        return startTimeA - startTimeB;
      })
      .filter((event) => {
        const startTime = getTimeInMinutes(event.start);
        const endTime = startTime + event.duration;
        console.log(startTime, endTime);
        return endTime <= 1260 && startTime >= 480;
      });
  };

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const groupOverlappingEvents = (events: EventType[]) => {
    let groups = [];
    let count = 0;

    for (let i = 0; i < events.length; i++) {
      let currentGroup = [events[i]];

      for (let j = 1; i + j < events.length; j++) {
        const endTimeCurrent =
          getTimeInMinutes(currentGroup[currentGroup.length - 1].start) +
          currentGroup[currentGroup.length - 1].duration;
        const startTimeNext = getTimeInMinutes(events[i + j].start);

        if (endTimeCurrent > startTimeNext) {
          count = count + 1;
          currentGroup.push(events[i + j]);
        } else {
          break;
        }
      }

      i = i + count;
      count = 0;

      groups.push(currentGroup);
    }
    return groups;
  };

  const calculatePositions = async (events: EventType[]) => {
    const eventsSorted = sortAndCleanEvents(events);
    console.log(eventsSorted);
    let array: any = [];
    const e = groupOverlappingEvents(eventsSorted);
    console.log(e);
    e.forEach((group) => {
      group.forEach((element, index) => {
        const startTime = getTimeInMinutes(element.start) - 480;
        const top = (startTime / 780) * windowSizes.height;
        const height = (element.duration / 780) * windowSizes.height;
        const left = (windowSizes.width / group.length) * index;
        const width = windowSizes.width / group.length - 1;
        array.push({
          ...element,
          position: {
            top,
            height,
            left,
            width,
          },
        });
      });
    });
    setEventWithPositions(array);
    setShouldUpdatePositions(false);
  };

  const updateSizesAndCalculatePositions = () => {
    calculatePositions(events);
  };

  useLayoutEffect(() => {
    function updateSize() {
      updateSizesAndCalculatePositions();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [windowSizes]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 0 }}>8h</div>
      {eventWithpositions
        ? eventWithpositions.map((event: any) => (
            <Event
              key={event.id}
              event={event}
              windowSizes={windowSizes}
              position={event.position}
            />
          ))
        : "pas de données"}
      <div style={{ position: "absolute", bottom: 0 }}>21h</div>
    </div>
  );
}

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default App;
