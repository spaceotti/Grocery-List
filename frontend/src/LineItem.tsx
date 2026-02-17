import React from "react";
import { FaTrash } from "react-icons/fa";
import type { ListItem } from "./App";

type LineItemProps = {
  item: ListItem;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
};

const LineItem: React.FC<LineItemProps> = ({ item, onCheck, onDelete }) => {
  return (
    <li className="item">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onCheck(item.id)}
      />
      <label
        className={item.checked ? "checked" : ""}
        onDoubleClick={() => onCheck(item.id)}
      >
        {item.item}
      </label>
      <FaTrash
        role="button"
        aria-label={`Delete ${item.item}`}
        onClick={() => onDelete(item.id)}
      />
    </li>
  );
};

export default LineItem;
