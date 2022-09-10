import React from "react";
import { GoPrimitiveDot } from "react-icons/go";

function SidebarItem({ Icon, section, active, alert }) {
  return (
    <div className={`item ${active ? "active" : ""}`}>
      {Icon}
      <p>{section}</p>
      {alert && <GoPrimitiveDot className="alertDot sidebarItem" />}
    </div>
  );
}

export default SidebarItem;
