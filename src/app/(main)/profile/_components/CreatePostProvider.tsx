"use client";

import React, {createContext, useContext, useState} from "react";
import {CreatePostModal} from "@/components/post/CreatePostModal";

const CreatePostContext = createContext<{ open: () => void }>({ open: () => {} });
export const useCreatePost = () => useContext(CreatePostContext);

export const CreatePostProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <CreatePostContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CreatePostModal open={isOpen} onClose={() => setOpen(false)} />
    </CreatePostContext.Provider>
  );
};