"use client";

import React, {RefObject, useEffect, useRef} from "react";

export interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="m-auto p-4 md:p-6 lg:p-8 border-line bg-surface rounded-4xl border"
      onClose={onClose}
    >
      Modal
    </dialog>
  )
}