import { readGameFile, writeJson } from "./files";
import { Misc } from "../types";
import { getString } from "../strings";

export async function miscToJson() {
  const misc: Record<string, Misc> = {};
  for (const line of await readGameFile("Misc")) {
    const code = line[14].trim();
    // console.log(code);
    misc[code] = {
      name: getString(line[0].trim()),
      type: line[31].trim(),
      tier: 0,
      maxSockets: Number(line[21]),
      indestructible: line[11].trim() === "1",
      width: Number(line[18]),
      height: Number(line[19]),
      qlevel: Number(line[3]),
      levelReq: Number(line[5]),
      stackable: line[44] === "1",
      trackQuestDifficulty: line[49] === "1" || undefined,
    };

    // console.log(JSON.stringify(misc[code], null, 4));

    // Token of absolution name is messed up, has the description at the start
    // if (code === "toa") {
    //   misc[code].name = misc[code].name.split("\\n")[1];
    // }
  }
  await writeJson("Misc", misc);
  return misc;
}
