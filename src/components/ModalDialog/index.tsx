import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import 'twin.macro'

import { useOutsideClick } from '../../misc/utils';

const ModalDialog: React.FC<{ open: boolean; onClose: () => void } & PropsWithChildren> = ({ open, onClose: onCloseFunc, children }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useOutsideClick(contentRef, () => ref.current?.close());

  const onClose = useCallback(() => {
    ref.current?.close();
    onCloseFunc();
  }, [onCloseFunc, ref]);

  useEffect(() => {
    if (ref.current) {
      if (open) {
        if (!ref.current.open) {
          ref.current.showModal();
        }
      } else {
        ref.current.close();
      }
    }

    // Make sure when `ESC` (browser default) is clicked, we close the dialog
    if (open) {
      const refNode = ref.current;
      refNode?.addEventListener('close', onClose);
      return () => {
        refNode?.removeEventListener('close', onClose);
      };
    }
  }, [onClose, open]);

  if (!open) return null;

  return (
    <dialog
      role="dialog"
      aria-modal="true"
      tw="top-0 left-0 h-full w-full flex items-center justify-center bg-black/25 backdrop-blur-sm animate-fade-in cursor-auto z-50"
      ref={ref}
    >
      {children}
    </dialog>
  )
}

export default ModalDialog