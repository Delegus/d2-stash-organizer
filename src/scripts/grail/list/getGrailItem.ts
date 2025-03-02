import { ItemQuality } from "../../items/types/ItemQuality";
import { Item } from "../../items/types/Item";
import {
  SET_ITEMS,
  SetItem,
  UNIQUE_ITEMS,
  UniqueItem,
} from "../../../game-data";

export function getGrailItem(item: Item) {
  if (!item.quality || typeof item.unique === "undefined") {
    return;
  }
  let result: SetItem | UniqueItem;
  switch (item.quality) {
    case ItemQuality.UNIQUE:
      result = UNIQUE_ITEMS[item.unique];
      result.item = item;
      return result;
    case ItemQuality.SET:
      result = SET_ITEMS[item.unique];
      result.item = item;
      return result;
    default:
      return;
  }
}
