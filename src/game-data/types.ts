import { Item } from "../scripts/items/types/Item";
import { ItemLocation } from "../scripts/items/types/ItemLocation";
import { ItemsOwner } from "../scripts/save-file/ownership";

export const enum EquipmentTier {
  NORMAL,
  EXCEPTIONAL,
  ELITE,
}

export interface Equipment {
  name: string;
  type: string;
  tier: EquipmentTier;
  maxSockets: number;
  indestructible: boolean;
  width: number;
  height: number;
  qlevel: number;
  levelReq: number;
  stackable: boolean;
  trackQuestDifficulty?: boolean;
}

export interface Armor extends Equipment {
  // [min, max]
  def: number[];
}

export interface Weapon extends Equipment {
  twoHanded: boolean;
}

export interface Misc extends Equipment {}

export interface ModifierRange {
  prop: string;
  param?: number;
  min?: number;
  max?: number;
}

export interface Gem {
  weapon: ModifierRange[];
  armor: ModifierRange[];
  shield: ModifierRange[];
}

export interface UniqueItem {
  name: string;
  enabled: boolean;
  code: string;
  qlevel: number;
  modifiers: ModifierRange[];
  item?: Item;
}

export interface SetItem {
  name: string;
  code: string;
  set: string;
  baseModifiers: ModifierRange[];
  setModifiers: ModifierRange[][];
  qlevel: number;
  levelReq: number;
  item?: Item;
}

export interface Set {
  name: string;
  levelReq: number;
  modifiers: ModifierRange[][];
}

export interface StringsD2rr {
  id: number;
  Key: string;
  enUS: string;
  zhTW: string;
  deDE: string;
  esES: string;
  frFR: string;
  itIT: string;
  koKR: string;
  plPL: string;
  esMX: string;
  jaJP: string;
  ptBR: string;
  ruRU: string;
  zhCN: string;
}

export interface Runeword {
  name: string;
  enabled: boolean;
  runes: string[];
  word: string;
  levelReq: number;
  modifiers: ModifierRange[];
}

export type PropertyType =
  | "proc"
  | "charges"
  | "all"
  | "min"
  | "max"
  | "param"
  | "other";
export interface Property {
  stats: {
    stat: string;
    param?: number;
    type: PropertyType;
  }[];
}

export interface StatDescription {
  stat: string;
  descPriority: number;
  descFunc: number;
  descVal?: number;
  descPos: string;
  descNeg: string;
  descAdditional?: string;
}

export interface ItemStat extends StatDescription {
  size: number;
  charSize?: number;
  encode: number;
  bias: number;
  paramSize: number;
  followedBy?: number;
}

export interface StatGroup extends StatDescription {
  statsInGroup: number[];
  allEqual?: boolean;
  isRange?: boolean;
}

export interface MagicAffix {
  name: string;
}

export interface Skill {
  code: string;
  name: string;
  charClass?: number;
}

export interface SkillTab {
  id: number;
  name: string;
  charClass: number;
}

export interface CharacterClass {
  code: string;
  name: string;
  skillsMod: string;
  classOnly: string;
}
