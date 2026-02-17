import type React from "react";
import "./index.css";
import Content from "./Content";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import { apiRequest } from "./apiRequest";

export type ListItem = {
  id: string;
  checked: boolean;
  item: string;
};

const App: React.FC = () => {
  const API_URL = "http://localhost:3500/items";
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`Did not receive expected data.`);
        }

        const listItems: ListItem[] = await res.json();
        setItems(listItems);
        setFetchError(null);
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError("Unknown API error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCheck = async (id: string): Promise<void> => {
    const found = items.find((item) => item.id === id);
    if (!found) return;
    const newChecked = !found.checked;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: newChecked } : item,
      ),
    );

    try {
      const reqUrl = `${API_URL}/${id}`;
      const updateOptions: RequestInit = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: newChecked }),
      };
      await apiRequest(reqUrl, updateOptions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to PATCH:", error.message);
        //Rollback
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, checked: !newChecked } : item,
          ),
        );
        setFetchError(error.message);
      }
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const itemToDelete = items.find((item) => item.id === id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    try {
      const reqUrl = `${API_URL}/${id}`;
      const deleteOptions: RequestInit = { method: "DELETE" };
      await apiRequest(reqUrl, deleteOptions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to DELETE:", error.message);
        setFetchError(error.message);
        // Rollback
        if (itemToDelete) setItems((prev) => [...prev, itemToDelete]);
      }
    }
  };

  const addItem = async (item: string): Promise<void> => {
    const id = Date.now().toString();
    const myNewItem: ListItem = { id, checked: false, item };
    setItems((prevItems) => [...prevItems, myNewItem]);

    try {
      const postOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myNewItem),
      };

      await apiRequest(API_URL, postOptions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to POST:", error.message);
        // Rollback
        setItems((prev) => prev.filter((i) => i.id !== id));
        setFetchError(error.message);
      }
    }
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem newItem={newItem} setNewItem={setNewItem} onAddItem={addItem} />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()),
            )}
            onCheck={handleCheck}
            onDelete={handleDelete}
          />
        )}
      </main>
      <Footer items={items} />
    </div>
  );
};

export default App;
