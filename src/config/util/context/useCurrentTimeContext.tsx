// CurrentTimeContext.js
import React, { createContext, useState, useContext } from "react";

const CurrentTimeContext = createContext({
  currentTimeStamp: 0,
  setCurrentTimeStamp: (timeStamp: number) => {},
});

export const useCurrentTime = () => useContext(CurrentTimeContext);

export const CurrentTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
  const value = { currentTimeStamp, setCurrentTimeStamp };

  return (
    <CurrentTimeContext.Provider value={value}>
      {children}
    </CurrentTimeContext.Provider>
  );
};
