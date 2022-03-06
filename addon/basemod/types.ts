export interface Mapping<T = any> {
  [key: string]: T
}

export type Rgb = [number, number, number]

export type CharacterClass =
  | 'WARRIOR'
  | 'ROGUE'
  | 'DRUID'
  | 'MAGE'
  | 'WARLOCK'
  | 'SHAMAN'
  | 'PRIEST'
  | 'PALADIN'
  | 'HUNTER'

export type CharacterRace =
  | 'HUMAN'
  | 'ORC'
  | 'DWARF'
  | 'NIGHT_ELF'
  | 'UNDEAD'
  | 'TAUREN'
  | 'GNOME'
  | 'TROLL'
  | 'BLOOD_ELF'
  | 'DRAENEI'

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
