"use client";

import React, { createContext, useContext, useState } from "react";
import { CreatePostModal } from "@/components/post/CreatePostModal";

const CreatePostContext = createContext<{
  open: () => void;
  postsVersion: number;
  notifyPostCreated: () => void;
}>({
  open: () => {},
  postsVersion: 0,
  notifyPostCreated: () => {},
});

export const useCreatePost = () => useContext(CreatePostContext);

export const CreatePostProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [postsVersion, setPostsVersion] = useState(0);

  const notifyPostCreated = () => {
    setPostsVersion((version) => version + 1);
  };

  return (
    <CreatePostContext.Provider value={{ open: () => setOpen(true), postsVersion, notifyPostCreated }}>
      {children}
      <CreatePostModal open={isOpen} onClose={() => setOpen(false)} onPostCreated={notifyPostCreated} />
    </CreatePostContext.Provider>
  );
};
