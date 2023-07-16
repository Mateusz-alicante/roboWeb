import { useAtom } from "jotai";
import {
  sendMessageAtom,
  distanceAtom,
  lastMessageAtom,
} from "../../utils/atoms.js";
import { useRef, useEffect } from "react";

var enc = new TextEncoder(); // always utf-8

export default () => {
  const [sendMessage, setSendMessage] = useAtom(sendMessageAtom);
  const [distance, setDistance] = useAtom(distanceAtom);
  const UuidInput = useRef(null);
  const [lastMessage, setLastMessage] = useAtom(lastMessageAtom);

  const gotValue = (value) => {
    setLastMessage(value);
    value = JSON.parse(value);
    setDistance(value);
    console.log(distance);
  };

  const onDisconnected = () => {
    console.log("Device got disconnected.");
  };

  const connect = () => {
    // const Uuid = UuidInput.current.value;
    const ble = new window.p5ble();
    ble.connect(0xffe0, (error, characteristics) => {
      if (error) {
        console.log("error: ", error);
      }

      const blueToothCharacteristic = characteristics[0];
      console.log(blueToothCharacteristic);
      ble.startNotifications(blueToothCharacteristic, gotValue, "string");

      // Add a event handler when the device is disconnected
      ble.onDisconnected(onDisconnected);

      setSendMessage({
        fn: (inputValue) =>
          blueToothCharacteristic.writeValue(enc.encode(inputValue)),
      });
    });
  };

  return (
    <div>
      <h1>Connection</h1>
      <label ref={UuidInput}>Device Uuid:</label>
      <input></input>
      <button onClick={connect}>Connect</button>
    </div>
  );
};
