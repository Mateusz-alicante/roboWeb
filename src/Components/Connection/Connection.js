import { useAtom } from "jotai";
import {
  sendMessageAtom,
  distanceAtom,
  lastMessageAtom,
} from "../../utils/atoms.js";
import { useRef, useEffect, useState } from "react";
import styles from "./Connection.module.css";

var enc = new TextEncoder(); // always utf-8

export default () => {
  const [sendMessage, setSendMessage] = useAtom(sendMessageAtom);
  const [distance, setDistance] = useAtom(distanceAtom);
  const UuidInput = useRef(null);
  const [lastMessage, setLastMessage] = useAtom(lastMessageAtom);
  const [status, setStatus] = useState("Not connected to a device");
  const [error, setError] = useState(false);

  const gotValue = (value) => {
    try {
      setLastMessage(value);
      value = JSON.parse(value);
      setDistance(value);
      console.log(distance);
    } catch (e) {
      console.log("error", e);
    }
  };

  const connect = () => {
    // const Uuid = UuidInput.current.value;
    const ble = new window.p5ble();
    ble.connect(0xffe0, (error, characteristics) => {
      if (error) {
        console.log("error: ", error);
        setStatus(`Failed to connect: ${error}`);
        setError(true);
      }

      const blueToothCharacteristic = characteristics[0];
      ble.startNotifications(blueToothCharacteristic, gotValue, "string");

      console.log(blueToothCharacteristic);
      // Add a event handler when the device is disconnected
      ble.onDisconnected(() => {
        setError(true);
        setStatus("Disconnected");
      });

      setSendMessage({
        fn: (inputValue) => {
          try {
            blueToothCharacteristic.writeValue(enc.encode(inputValue));
          } catch (error) {
            if (!error) {
              setError(true);
              setStatus("Cannot communicate with the device");
            }
          }
        },
      });

      setStatus(`Connected to ${blueToothCharacteristic.service.device.name}`);
    });
  };

  const getBakcgroundColor = (status, error) => {
    if (error) return "rgb(224, 73, 73)";
    switch (status) {
      case "Not connected to a device":
        return "rgb(25, 128, 196)";
      default:
        return "rgb(42, 196, 25)";
    }
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: getBakcgroundColor(status, error) }}
    >
      <h1>Connection</h1>
      <p>{status}</p>
      {status === "Not connected to a device" && (
        <p>Make sure you have a BLE compatible module!</p>
      )}
      <button className={styles.btn} onClick={connect}>
        Connect
      </button>
    </div>
  );
};
