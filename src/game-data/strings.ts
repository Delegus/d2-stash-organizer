import strings from "../../game-data/json/Strings.json";
import { STRINGS_NEW } from "./index";

const STRINGS: Record<string, string> = strings;

export function getString(code: string) {
  const result = STRINGS_NEW.filter((s) => s.Key == code);
  if (result.length > 0) {
    return result[0].enUS;
  } else {
    return STRINGS[code] ?? code;
  }
}
