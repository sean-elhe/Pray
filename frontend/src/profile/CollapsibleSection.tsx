import { useState, ReactNode } from "react";
import "./profile.css";

type CollapsibleSectionProps = {
  title: string;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({
  title,
  badge,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-section">
      <button
        className="collapsible-header"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h3>{title}</h3>

        {badge && <span className="collapsible-badge">{badge}</span>}

        <span className="collapsible-icon">{open ? "▲" : "▼"}</span>
      </button>

      {open && <div className="collapsible-content">{children}</div>}
    </div>
  );
}
