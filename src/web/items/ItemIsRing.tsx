import { Item } from "../../scripts/items/types/Item";

export function ItemIsRing({ item }: { item: Item }) {
  return <a class="location"> {item.itemType} </a>;
}
