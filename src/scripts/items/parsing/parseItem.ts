import { parseSimple } from "./parseSimple";
import { binaryStream } from "../../save-file/binary";
import { parseQuality } from "./parseQuality";
import { parseQuantified } from "./parseQuantified";
import { parseModifiers } from "./parseModifiers";
import { SaveFileReader } from "../../save-file/SaveFileReader";
import { LAST_LEGACY } from "../../character/parsing/versions";
import { ItemsOwner } from "../../save-file/ownership";

export function parseItem(reader: SaveFileReader, owner: ItemsOwner) {
  // https://squeek502.github.io/d2itemreader/formats/d2.html
  const stream = binaryStream(reader);

  if (owner.version <= LAST_LEGACY) {
    // This is awkward, but we're juggling between the regular reader and the binary stream
    // In this case, we want to read with the binary stream to make sure the header is included
    // in the raw binary of the item.
    const header = String.fromCharCode(stream.readInt(8), stream.readInt(8));
    if (header !== "JM") {
      throw new Error(`Unexpected header ${header} for an item`);
    }
  }
  try {
    const item = parseSimple(stream, owner);
    if (item.isStack && !item.simple) {
      parseQuantified(stream, item);
      if (["ibk", "tbk"].includes(item.code)) {
        stream.read(68);
        // console.error(item.code, "=", cha, item);
        stream.read(1);
        // console.error(item.code, " ^^^ ", cha);
      } else {
        stream.read(64);
      }
    }
    if (!item.isStack && !item.simple) {
      // If the id is cut short, it means it contained a "JM" which was identified as a boundary
      try {
        parseQuality(stream, item);
        parseQuantified(stream, item);
        parseModifiers(stream, item);
      } catch (e) {
        if (typeof e === "string") {
          console.error(e.toUpperCase()); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          console.error(e.stack);
          console.error(e.message); // works, `e` narrowed to Error
        }
        console.log(`@@@ couldn't parse item: `, item);
      }
    }
    // console.log(`item @@@@@@@@: `, item.name);
    item.raw = stream.done();
    return item;
  } catch (e) {
    if (e instanceof Error) {
      console.error("item@@@@@@", owner);
      throw new Error(`${e.message} `);
    }
  }
}
