import { CharacterClass, CharacterRace, ItemSpellTrigger, Mapping } from './types'

export const DEFAULT_MOD = 'basemod'
export const DEFAULT_TABLE_PREFIX = '__'

export const ADDON_PATH = __dirname + '/../../../addon'
export const ADDON_DATA_PATH = ADDON_PATH + '/data'
export const DEFAULT_SPEED = 0.8
export const DEFAULT_VERSION = '0.1.0'

export const DEFAULT_OPTIONS = {
  mod: DEFAULT_MOD,
  version: DEFAULT_VERSION,
  baseSpeed: DEFAULT_SPEED,
  tablePrefix: DEFAULT_TABLE_PREFIX,
}

export const DEFAULT_SPELL_BASE = 133
export const DEFAULT_SPELL_NAME = 'Spell'
export const DEFAULT_ICON_SPELL_BASE = 56247

export const DEFAULT_SPELL_DESCRIPTION = 'A spell.'
export const DEFAULT_SPELL_AURA_DESCRIPTION = 'An aura.'

export const DEFAULT_ITEM_BASE = 0 // FIXME: add real item id
export const DEFAULT_ITEM_NAME = 'Item'

export const DEFAULT_NPC_BASE = 0 // FIXME: add real npc id
export const DEFAULT_NPC_NAME = 'Npc'

export const DEFAULT_MOUNT_NPC_BASE = 308
export const DEFAULT_DIRECT_SPELL_BASE = 133

export const WARRIOR = 'WARRIOR'
export const ROGUE = 'ROGUE'
export const DRUID = 'DRUID'
export const MAGE = 'MAGE'
export const WARLOCK = 'WARLOCK'
export const SHAMAN = 'SHAMAN'
export const PRIEST = 'PRIEST'
export const PALADIN = 'PALADIN'
export const HUNTER = 'HUNTER'

export const CLASS_MASKS: Mapping<number> = {
  WARRIOR: 1,
  PALADIN: 2,
  HUNTER: 4,
  ROGUE: 8,
  PRIEST: 16,
  SHAMAN: 64,
  MAGE: 128,
  WARLOCK: 256,
  DRUID: 1024,
}

export const ALL_CLASSES: CharacterClass[] = [
  'WARRIOR',
  'PALADIN',
  'HUNTER',
  'ROGUE',
  'PRIEST',
  'SHAMAN',
  'MAGE',
  'WARLOCK',
  'DRUID',
]

export const CLASS_IDS: Mapping<number> = {
  WARRIOR: 1,
  PALADIN: 2,
  HUNTER: 3,
  ROGUE: 4,
  PRIEST: 5,
  DK: 6,
  SHAMAN: 7,
  MAGE: 8,
  WARLOCK: 9,
  DRUID: 11,
}

export const HUMAN = 'HUMAN'
export const ORC = 'ORC'
export const DWARF = 'DWARF'
export const NIGHT_ELF = 'NIGHT_ELF'
export const UNDEAD = 'UNDEAD'
export const TAUREN = 'TAUREN'
export const GNOME = 'GNOME'
export const TROLL = 'TROLL'
export const BLOOD_ELF = 'BLOOD_ELF'
export const DRAENEI = 'DRAENEI'

export const RACE_MASKS: Mapping<number> = {
  HUMAN: 1,
  ORC: 2,
  DWARF: 4,
  NIGHT_ELF: 8,
  UNDEAD: 16,
  TAUREN: 32,
  GNOME: 64,
  TROLL: 128,
  BLOOD_ELF: 512,
  DRAENEI: 1024,
}

export const ALL_RACES: CharacterRace[] = [
  'HUMAN',
  'ORC',
  'DWARF',
  'NIGHT_ELF',
  'UNDEAD',
  'TAUREN',
  'GNOME',
  'TROLL',
  'BLOOD_ELF',
  'DRAENEI',
]

export const RACE_IDS: Mapping<number> = {
  HUMAN: 1,
  ORC: 2,
  DWARF: 3,
  NIGHT_ELF: 4,
  UNDEAD: 5,
  TAUREN: 6,
  GNOME: 7,
  TROLL: 8,
  BLOOD_ELF: 10,
  DRAENEI: 11,
}

export const SCHOOLS = {
  FIRE: 'FIRE',
  FROST: 'FROST',
  NATURE: 'NATURE',
  SHADOW: 'SHADOW',
  HOLY: 'HOLY',
  ARCANE: 'ARCANE',
}

