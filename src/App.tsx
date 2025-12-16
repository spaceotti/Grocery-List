import type React from "react";
import "./index.css";
import Content from "./Content";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";

export type ListItem = {
  id: number;
  checked: boolean;
  item: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([
    {
      id: 1,
      checked: true,
      item: "One half pound bag of Cocoa Covered Almonds Unsalted",
    },
    {
      id: 2,
      checked: false,
      item: "Item 2",
    },
    {
      id: 3,
      checked: false,
      item: "Item 3",
    },
  ]);

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

  return (
    <div className="App">
      <Header title="Groceries List" />
      <Content items={items} onCheck={handleCheck} onDelete={handleDelete} />
      <Footer items={items} />
    </div>
  );
};

export default App;
