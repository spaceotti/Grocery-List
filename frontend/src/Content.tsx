import type { ListItem } from "./App";
import ItemList from "./ItemList";

type ContentProps = {
  items: ListItem[];
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
};

const Content: React.FC<ContentProps> = ({ items, onCheck, onDelete }) => {
  return (
    <>
      {items.length ? (
        <ItemList items={items} onCheck={onCheck} onDelete={onDelete} />
      ) : (
        <p style={{ marginTop: "2rem" }}>Your List is empty</p>
      )}
    </>
  );
};

export default Content;
