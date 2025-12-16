import type { ListItem } from "./App";
import ItemList from "./ItemList";

type ContentProps = {
  items: ListItem[];
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
};

const Content: React.FC<ContentProps> = ({ items, onCheck, onDelete }) => {
  return (
    <main>
      {items.length ? (
        <ItemList items={items} onCheck={onCheck} onDelete={onDelete} />
      ) : (
        <p style={{ marginTop: "2rem" }}>Your List is empty</p>
      )}
    </main>
  );
};

export default Content;
