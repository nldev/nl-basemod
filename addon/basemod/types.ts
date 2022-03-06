import { WARRIOR, ROGUE, DRUID, MAGE, WARLOCK, SHAMAN, PRIEST, PALADIN, HUNTER, HUMAN, ORC, DWARF, NIGHT_ELF, UNDEAD, TAUREN, GNOME, TROLL, BLOOD_ELF, DRAENEI } from './constants'

export interface Mapping<T = any> {
  [key: string]: T
}

export type Rgb = [number, number, number]

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

export interface PlayerInfo {
  name: string
  chrRace: string
  chrClass: string
  level: number
}

export interface TalentInfo {
  isEnabled: boolean
  used: number
  max: number
  active: Mapping<boolean>
}
