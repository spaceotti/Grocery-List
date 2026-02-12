import React, { useRef } from "react";
import type { SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";

type AddItemProps = {
  newItem: string;
  setNewItem: React.Dispatch<SetStateAction<string>>;
  onAddItem: (item: string) => void;
};

const AddItem: React.FC<AddItemProps> = ({
  newItem,
  setNewItem,
  onAddItem,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItem) return;
    onAddItem(newItem);
    setNewItem("");
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <form className="addForm" onSubmit={handleSubmit}>
      <label htmlFor="addItem">Add Item</label>
      <input
        type="text"
        placeholder="Add item"
        id="addItem"
        ref={inputRef}
        autoFocus
        required
        onChange={(e) => setNewItem(e.target.value)}
        value={newItem}
      />
      <button
        type="submit"
        aria-label="Add item"
        onClick={() => inputRef.current?.focus()}
      >
        <FaPlus />
      </button>
    </form>
  );
};

export default AddItem;
