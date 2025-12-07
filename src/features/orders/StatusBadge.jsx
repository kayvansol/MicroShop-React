// components/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ status,statusname }) {
    const map = {
        0: "info",
        1: "danger",        
        2: "success",
        3: "primary",
        4: "warning",
    };

    const color = map[status] || "secondary";

    return <span className={`badge bg-${color} px-3 py-2`}>{statusname}</span>;
}
