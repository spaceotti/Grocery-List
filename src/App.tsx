import type React from "react";
import "./index.css";
import Content from "./Content";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";

export type ListItem = {
  id: number;
  checked: boolean;
  item: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>(() => {
    const stored = localStorage.getItem("shoppinglist");
    return stored ? JSON.parse(stored) : [];
  });
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("shoppinglist", JSON.stringify(items));
  }, [items]);

  const handleCheck = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addItem = (item: string) => {
    const id = Date.now();
    const myNewItem = { id, checked: false, item };
    setItems((prevItems) => [...prevItems, myNewItem]);
  };

  return (
    <div className="App">
      <Header title="Groceries List" />
      <AddItem newItem={newItem} setNewItem={setNewItem} onAddItem={addItem} />
      <SearchItem search={search} setSearch={setSearch} />
      <Content
        items={items.filter((item) =>
          item.item.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )}
        onCheck={handleCheck}
        onDelete={handleDelete}
      />
      <Footer items={items} />
    </div>
  );
};

export default App;
