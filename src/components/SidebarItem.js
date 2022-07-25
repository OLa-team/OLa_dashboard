import React from "react";

function SidebarItem({ Icon, section, active }) {
  return (
    <div className={`item ${active ? "active" : ""}`}>
      {Icon}
      <p>{section}</p>
    </div>
  );
}

export default SidebarItem;
