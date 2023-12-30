import React from 'react';
import styles from './PaginationLoader.module.css';

const PaginationLoader = () => {
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.loader}>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
          <div className={`${styles.dot} ${styles.dot4}`}></div>
        </div>
      </section>
    </div>
  );
};

export default PaginationLoader;
