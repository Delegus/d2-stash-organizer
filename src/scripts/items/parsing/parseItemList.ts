import { SaveFileReader } from "../../save-file/SaveFileReader";
import { Item } from "../types/Item";
import { parseItem } from "./parseItem";
import { ItemLocation } from "../types/ItemLocation";
import { ItemsOwner } from "../../save-file/ownership";
import { RUNEWORDS } from "../../../game-data";
export function parseItemList(reader: SaveFileReader, owner: ItemsOwner) {
  const header = reader.readString(2);
  if (header !== "JM") {
    throw new Error(`Unexpected header ${header} for an item list`);
  }

  let remainingItems = reader.readInt16LE();
  console.warn("Total Items:%s", remainingItems);
  const items: Item[] = [];
  let runeWrod = "";
  // After that comes the first item
  while (remainingItems > 0) {
    // console.warn("remainingItems:%s, %s", remainingItems, owner.filename);
    const parsedItem = parseItem(reader, owner);
    if (parsedItem == null) {
      remainingItems--;
      continue;
    }
    if (parsedItem.location === ItemLocation.SOCKET) {
      const socketedItem = items[items.length - 1];
      if (!socketedItem.filledSockets) {
        throw new Error("Trying to socket a non-socketed item");
      }
      parsedItem.socketedIn = socketedItem;
      runeWrod += parsedItem.code;
      socketedItem.filledSockets.push(parsedItem);
      if (socketedItem.filledSockets.length == socketedItem.sockets) {
        const wrd = RUNEWORDS.find((r) => r.word == runeWrod)?.name;
        socketedItem.name = wrd == null ? socketedItem.name : wrd;
        runeWrod = "";
      }
    } else {
      items.push(parsedItem);
      remainingItems += parsedItem.nbFilledSockets ?? 0;
    }
    remainingItems--;
  }
  return items;
}
