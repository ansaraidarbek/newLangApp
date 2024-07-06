import React from "react";
import styles from "./modalQustioning.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({ setStatus, status }) => {
  const empty = {
    isActive : false,
    msg : null,
    change : null
  }
  return (
    <>
      <div className={styles.darkBG} onClick={() => setStatus(empty)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Dialog</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setStatus(empty)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            {status.msg}
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button className={styles.deleteBtn} onClick={() => setStatus(old => ({...old, isActive : false, msg : null}))}>
                Ок
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setStatus(empty)}
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;