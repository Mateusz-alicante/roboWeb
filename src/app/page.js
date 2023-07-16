"use client";
import styles from "./page.module.css";
import { useEffect } from "react";
import { useAtom } from "jotai";

import Connection from "../Components/Connection/Connection.js";
import Controller from "../Components/Controller/Controller.js";
import Environment from "../Components/Environment/Environment.js";

export default function Home() {
  return (
    <main>
      <div className={styles.globalContainer}>
        <div className={styles.leftContainer}>
          <Connection />
          <Environment />
        </div>
        <div className={styles.rightContainer}>
          <Controller />
        </div>
      </div>
    </main>
  );
}
