import {
  Armor,
  ARMORS,
  Misc,
  MISC,
  SetItem,
  UniqueItem,
  UniqueSetItem,
  Weapon,
  WEAPONS,
} from "../../game-data";
import { Item } from "./types/Item";

export function getBase(
  item: UniqueSetItem | UniqueItem | SetItem | Item
): Armor | Weapon | Misc {
  const base = ARMORS[item.code] || WEAPONS[item.code] || MISC[item.code];
  if (!base) {
    // console.log('Could not find base'+JSON.stringify(item, null, 3));

    throw new Error(
      `Could not find base ${item.code} for ${item.name ?? "unknown item"}`
    );
    console.log("err1");
  }
  return base;
}
