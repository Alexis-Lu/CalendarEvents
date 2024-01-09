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
      duration: 180,
    },
    {
      id: 5,
      start: "10:30",
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
        return endTime <= 1260 && startTime >= 480;
      });
  };

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const groupOverlappingEvents = (events: EventType[]) => {
    let groups = [];

    for (let i = 0; i < events.length; i++) {
      let currentEvent = events[i];
      let currentGroup = [currentEvent];

      for (let j = i + 1; j < events.length; j++) {
        const endTimeCurrent =
          getTimeInMinutes(currentEvent.start) + currentEvent.duration;
        const startTimeNext = getTimeInMinutes(events[j].start);

        if (endTimeCurrent > startTimeNext) {
          currentGroup.push(events[j]);
        } else {
          break;
        }
      }
      groups.push(currentGroup);
    }

    for (let i = 0; i < groups.length - 1; i++) {
      const currentGroup = groups[i];
      const nextGroup = groups[i + 1];
      const allInCurrentGroup = nextGroup.every((event) =>
        currentGroup.some((currentEvent) => currentEvent.id === event.id)
      );
      if (allInCurrentGroup) {
        groups.splice(i + 1, 1);
        i--;
      }
    }
    return groups;
  };

  const calculatePositions = async (events: EventType[]) => {
    const eventsSorted = sortAndCleanEvents(events);
    let array: any = [];
    const e = groupOverlappingEvents(eventsSorted);

    let count = 1;
    e.forEach((group, key) => {
      group.forEach((element, index) => {
        if (
          e[key - 1]?.length > 0 &&
          element.id === e[key - 1][e[key - 1].length - 1].id
        ) {
          count = count + 1;
        } else {
          if (count > 1) {
            const startTime = getTimeInMinutes(element.start);
            const height = (element.duration / 780) * windowSizes.height;
            const width = windowSizes.width / e[key - 1].length;
            const top = ((startTime - 480) * windowSizes.height) / 780;
            const left = width * (count - 2);
            array.push({
              ...element,
              position: {
                top,
                left,
                height,
                width,
              },
            });
            count = 1;
          } else {
            const startTime = getTimeInMinutes(element.start);
            const height = (element.duration / 780) * windowSizes.height;
            const width = windowSizes.width / group.length;
            const top = ((startTime - 480) * windowSizes.height) / 780;
            const left = width * index;
            array.push({
              ...element,
              position: {
                top,
                left,
                height,
                width,
              },
            });
          }
        }
      });
    });
    setEventWithPositions(array);
    setShouldUpdatePositions(false);
  };

  useLayoutEffect(() => {
    function updateSize() {
      calculatePositions(events);
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
