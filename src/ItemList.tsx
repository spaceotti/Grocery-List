import React from "react";
import type { ListItem } from "./App";
import LineItem from "./LineItem";

type ItemListProps = {
  items: ListItem[];
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
};

const ItemList: React.FC<ItemListProps> = ({ items, onCheck, onDelete }) => {
  return (
    <ul>
      {items.map((item) => (
        <LineItem
          key={item.id}
          item={item}
          onCheck={onCheck}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default ItemList;
