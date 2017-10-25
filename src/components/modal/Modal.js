import React from 'react';
import { Portal, Modal as MBModal } from '@sparkpost/matchbox';

const Modal = ({ children, ...rest }) => (
  <Portal containerId='modal-portal'>
    <MBModal {...rest}>{ children }</MBModal>
  </Portal>
);

export default Modal;
