import React from "react";
import styles from "./StatusStepper.module.css";

const StatusStepper = () => {
  return (
    <React.Fragment>
      <div className={styles.container}>
        <ul className={styles.progressbar}>
          <li  className={styles.active}></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default StatusStepper;
