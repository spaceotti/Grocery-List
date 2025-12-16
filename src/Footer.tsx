import React from "react";
import type { ListItem } from "./App";

type FooterProps = {
  items: ListItem[];
};

const Footer: React.FC<FooterProps> = ({ items }) => {
  return (
    <footer>
      <p>
        {items.length} {items.length !== 1 ? "items" : "item"} left
      </p>
    </footer>
  );
};

export default Footer;
