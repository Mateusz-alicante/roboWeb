import styles from "./Controller.module.css";
import { useState, useRef, useEffect } from "react";
import { ReactHandTracking } from "react-hand-tracking";
import { useAtom } from "jotai";
import { sendMessageAtom } from "../../utils/atoms.js";

export default () => {
  const container = useRef(null);
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const cross = useRef(null);
  const [pos, setPos] = useState([0, 0]);
  const [pos2, setPos2] = useState([0, 0]);
  const [handPos, setHandPos] = useState([0, 0]);
  const [lastUpdate, setLastUpdate] = useState(0);

  const [sendMessage, setSendMessage] = useAtom(sendMessageAtom);

  useEffect(() => {
    if (Date.now() - lastUpdate < 200) return;

    // console.log([handPos[0], handPos[1]]);
    // console.log(
    //   `${JSON.stringify({
    //     x: Math.min(Math.floor(handPos[0] * 230 * 2), 230),
    //     y: Math.min(Math.floor(handPos[1] * 230), 230),
    //   })}\n`
    // );

    if (sendMessage) {
      sendMessage.fn(
        `${JSON.stringify({
          x: Math.min(Math.floor(handPos[0] * 230), 230),
          y: Math.min(Math.floor(handPos[1] * 230 * 2), 230),
        })}\n`
      );
    }
    setLastUpdate(Date.now());
  }, [sendMessage, handPos]);

  const updatePos = (results, sendMessage) => {
    if (!container.current) return;
    if (!results[0]) {
      setPos([
        container.current.clientWidth / 2 - circle1.current.clientWidth / 2,
        container.current.clientHeight / 2 + circle1.current.clientHeight,
      ]);
      setPos2([
        container.current.clientWidth / 2 - circle2.current.clientWidth / 2,
        container.current.clientHeight / 2 + circle2.current.clientHeight,
      ]);

      setHandPos([0, 0]);

      return;
    }
    setPos2([
      container.current.clientWidth -
        results[0].landmarks[5].x * container.current.clientWidth -
        circle2.current.clientWidth / 2,
      results[0].landmarks[5].y * container.current.clientHeight +
        +circle2.current.clientHeight,
    ]);
    if (results[0].gesture.gestureType == "Open_Palm") {
      setPos([
        container.current.clientWidth -
          results[0].landmarks[5].x * container.current.clientWidth -
          circle1.current.clientWidth / 2,
        results[0].landmarks[5].y * container.current.clientHeight +
          +circle1.current.clientHeight,
      ]);
      setHandPos([
        -results[0].landmarks[5].x + 0.5,
        -results[0].landmarks[5].y + 0.5,
      ]);
    } else {
      setPos([
        container.current.clientWidth / 2 - circle1.current.clientWidth / 2,
        container.current.clientHeight / 2 + circle1.current.clientHeight,
      ]);
      setHandPos([0, 0]);
    }
  };

  return (
    <div className={styles.outerContainer} ref={container}>
      <div className={styles.trackerContainer}>
        <ReactHandTracking
          callback={(results) => updatePos(results, sendMessage)}
          predictionTimeout={50}
        />
      </div>
      <div
        ref={circle1}
        className={styles.circle}
        style={{
          position: "relative",
          top: pos[1],
          left: pos[0],
        }}
      ></div>
      <div
        ref={circle2}
        className={styles.circle2}
        style={{
          position: "relative",
          top: pos2[1],
          left: pos2[0],
        }}
      ></div>
      <div
        ref={cross}
        className={styles.cross}
        style={{
          position: "relative",
          top:
            container.current?.clientHeight / 2 -
            cross.current?.clientHeight / 2,
          left: container.current?.clientWidth / 2,
        }}
      ></div>
    </div>
  );
};
