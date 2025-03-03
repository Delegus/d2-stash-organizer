import { Item } from "../../scripts/items/types/Item";

export function ItemIsRing({ item }: { item: Item }) {
  let amuRing = "";
  switch (item.code) {
    case "amu":
      amuRing = "(Amulet)";
      break;
    case "rin":
      amuRing = "(Ring)";
      break;
  }
  return <a class="location"> {amuRing} </a>;
}
