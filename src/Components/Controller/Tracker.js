import { ReactHandTracking } from "react-hand-tracking";
import { useEffect, memo } from "react";

const Tracker = ({ callback, predictionTimeout }) => {
  useEffect(() => {
    console.log("Tracker mounted");
  });
  return (
    <ReactHandTracking
      callback={callback}
      predictionTimeout={predictionTimeout}
    />
  );
};

export default memo(Tracker, (prevProps, nextProps) => true);
