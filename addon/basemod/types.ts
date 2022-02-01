import { BLOOD_ELF, DRAENEI, DRUID, DWARF, GNOME, HUMAN, HUNTER, MAGE, NIGHT_ELF, ORC, PALADIN, PRIEST, ROGUE, SHAMAN, TAUREN, TROLL, UNDEAD, WARLOCK, WARRIOR } from './constants'

// export type Size = [number, number]

// export type Color = [number, number, number, number]

export interface Mapping<T = any> {
  [key: string]: T
}

export type CharacterClass =
  | typeof WARRIOR
  | typeof ROGUE
  | typeof DRUID
  | typeof MAGE
  | typeof WARLOCK
  | typeof SHAMAN
  | typeof PRIEST
  | typeof PALADIN
  | typeof HUNTER

export type CharacterRace =
  | typeof HUMAN
  | typeof ORC
  | typeof DWARF
  | typeof NIGHT_ELF
  | typeof UNDEAD
  | typeof TAUREN
  | typeof GNOME
  | typeof TROLL
  | typeof BLOOD_ELF
  | typeof DRAENEI


