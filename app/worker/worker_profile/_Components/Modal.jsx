"use client"
import React from "react";
import Modal from "@mui/material/Modal";

const ModalComponent = ({
  handleClose,
  open,
  ModalType,
  GetWorkerData,
  data,
}) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalType
          handleClose={handleClose}
          data={data}
          GetWorkerData={GetWorkerData}
        />
      </Modal>
    </div>
  );
};

export default ModalComponent;
