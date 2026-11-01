"use client"

import { NavItem } from "@/components/navigation/links";
import React, { useState } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { NavButton } from "@/components/navigation/NavButton";

interface CollapsableProps {
  navItem: NavItem;
  onClose?: () => void;
}

/**
 * @param navItem - The navigation item to display
 * @param onClose - The function to call when the user closes the category
 *
 * @Component - A collapsable category that can be expanded or collapsed. It will originally start collapsed, and
 * when the user clicks on the category, it will expand. When the user clicks on the category again, it will collapse.
 *
 * @Important - You do not need to touch this component. It is used internally by the Navbar component and possibly
 * the Footer component if more links are added.
 */

export const CollapsableCategory = ({navItem, onClose}: CollapsableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  };

  return (
    <div
      key={navItem.category}
      className="flex flex-col gap-y-2 cursor-pointer"
      onClick={toggleOpen}
    >

      <button className="flex items-center justify-between">
        <h4>{navItem.category}</h4>
        <ChevronRightIcon className={`cursor-pointer ${isOpen ? "rotate-90" : ""}`} width={24} height={24} />
      </button>

      <div className={`flex flex-col gap-y-2 pl-1 ${isOpen ? "block" : "hidden"}`}>
        {navItem.links.map(link => (
          <NavButton
            label={link.label}
            destination={link.destination}
            key={link.label}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  )
}