import { CharacterClass, CharacterRace, Mapping } from './types'
import { ClassMask, RaceMask } from './utils'

export const ENV = {
  DEV: 'DEV',
  TEST: 'TEST',
  PROD: 'PROD',
}

export const SPELL = 'SPELL'
export const ITEM = 'ITEM'
export const NPC = 'NPC'
export const ACHIEVEMENT = 'ACHIEVEMENT'
export const UNNAMED = 'UNNAMED'

export const DEFAULT_MOD = 'basemod'

export const DEFAULT_SPELL_BASE = 133
export const DEFAULT_SPELL_NAME = 'Spell'
export const DEFAULT_ICON_SPELL_BASE = 56247

export const DEFAULT_SPELL_DESCRIPTION = 'A spell.'
export const DEFAULT_SPELL_AURA_DESCRIPTION = 'An aura.'

export const DEFAULT_ITEM_BASE = 0 // FIXME: add real item id
export const DEFAULT_ITEM_NAME = 'Item'

export const DEFAULT_NPC_BASE = 0 // FIXME: add real npc id
export const DEFAULT_NPC_NAME = 'Npc'

export const DEFAULT_MOUNT_NPC_BASE = 308 // FIXME: add real npc id

export const DEFAULT_DIRECT_SPELL_BASE = 133 // FIXME: add real npc id

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

export const ALL_CLASS_MASK = ClassMask(...ALL_CLASSES)

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

export const ALL_RACE_MASK = RaceMask(...ALL_RACES)

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

// export const ASSET_TYPE: Mapping<AssetType> = {
//   SPELL: SPELL,
//   ITEM: ITEM,
//   NPC: NPC,
//   ACHIEVEMENT: ACHIEVEMENT,
// }

export const SCHOOLS = {
  FIRE: 'FIRE',
  FROST: 'FROST',
  NATURE: 'NATURE',
  SHADOW: 'SHADOW',
  HOLY: 'HOLY',
  ARCANE: 'ARCANE',
}

export const BASE_MOUNT_SPEED = 80

export const CREATE_ACHIEVEMENT_TASK = 'CREATE_ACHIEVEMENT'
export const CREATE_ENCHANT_TASK = 'CREATE_ENCHANT'
export const CREATE_ITEM_TASK = 'CREATE_ITEM'
export const CREATE_GEM_TASK = 'CREATE_GEM'
export const CREATE_NPC_TASK = 'CREATE_NPC'
export const CREATE_MODIFIER_TASK = 'CREATE_MODIFIER'
export const CREATE_MOUNT_TASK = 'CREATE_MOUNT'
export const CREATE_PET_TASK = 'CREATE_PET'
export const CREATE_PROFESSION_TASK = 'CREATE_PROFESSION'
export const CREATE_SPELL_TASK = 'CREATE_SPELL'
export const CREATE_STAT_TASK = 'CREATE_STAT'
export const CREATE_SUMMON_TASK = 'CREATE_SUMMON'
export const SETUP_CHARACTER_CREATION_TASK = 'SETUP_CHARACTER_CREATION'
export const GENERATE_EQUIPMENT_TASK = 'GENERATE_EQUIPMENT'
export const SETUP_CLASS_DRUID_TASK = 'SETUP_CLASS_DRUID'
export const SETUP_CLASS_HUNTER_TASK = 'SETUP_CLASS_HUNTER'
export const SETUP_CLASS_MAGE_TASK = 'SETUP_CLASS_MAGE'
export const SETUP_CLASS_PALADIN_TASK = 'SETUP_CLASS_PALADIN'
export const SETUP_CLASS_PRIEST_TASK = 'SETUP_CLASS_PRIEST'
export const SETUP_CLASS_ROGUE_TASK = 'SETUP_CLASS_ROGUE'
export const SETUP_CLASS_SHAMAN_TASK = 'SETUP_CLASS_SHAMAN'
export const SETUP_CLASS_WARLOCK_TASK = 'SETUP_CLASS_WARLOCK'
export const SETUP_CLASS_WARRIOR_TASK = 'SETUP_CLASS_WARRIOR'
export const CREATE_DIRECT_SPELL_TASK = 'CREATE_DIRECT_SPELL'
export const CREATE_EFFECT_OVER_TIME_SPELL_TASK = 'CREATE_EFFECT_OVER_TIME_SPELL'
export const CREATE_RANGED_SPELL_TASK = 'CREATE_RANGED_SPELL'
export const SETUP_SKILLS_TASK = 'SETUP_SKILLS'
export const CREATE_CONSUMABLE_TASK = 'CREATE_CONSUMABLE'
export const CREATE_TALENT_TASK = 'CREATE_TALENT'
export const CREATE_AUTOLEARN_TASK = 'CREATE_AUTOLEARN'
export const CREATE_TABLE_TASK = 'CREATE_TABLE'
export const INSERT_SERVER_DATA_TASK = 'INSERT_SERVER_DATA'
export const INSERT_CLIENT_DATA_TASK = 'INSERT_CLIENT_DATA'

export const QUERY_ID = 'QUERY_ID'
export const QUERY_ICON = 'QUERY_ICON'
export const QUERY_EFFECT_POINTS = 'QUERY_EFFECT_POINTS'
export const QUERY_MOUNT_NPC = 'QUERY_MOUNT_NPC'
// FIXME: implement these
export const QUERY_DIRECT_SPELL = 'QUERY_DIRECT_SPELL'
export const QUERY_ENCHANT = 'QUERY_ENCHANT'
export const QUERY_GEM = 'QUERY_GEM'
export const QUERY_MODIFIER = 'QUERY_MODIFIER'

export const MAX_ITEM_SPELL_COUNT = 5

export const ITEM_SPELL_TRIGGER_ON_EQUIP = 'ON_EQUIP'
export const ITEM_SPELL_TRIGGER_ON_USE = 'ON_USE'
export const ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY = 'ON_USE_NO_DELAY'
export const ITEM_SPELL_TRIGGER_CHANCE_ON_HIT = 'CHANCE_ON_HIT'
export const ITEM_SPELL_TRIGGER_SOULSTONE = 'SOULSTONE'
export const ITEM_SPELL_TRIGGER_LEARN_SPELL = 'LEARN_SPELL'

export const DEFAULT_ITEM_SPELL_TRIGGER_ID = 'default'

// export const ITEM_SPELL_TRIGGERS: Mapping<ItemSpellTrigger> = {
//   [ITEM_SPELL_TRIGGER_ON_EQUIP]: ITEM_SPELL_TRIGGER_ON_EQUIP,
//   [ITEM_SPELL_TRIGGER_ON_USE]: ITEM_SPELL_TRIGGER_ON_USE,
//   [ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY]: ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY,
//   [ITEM_SPELL_TRIGGER_CHANCE_ON_HIT]: ITEM_SPELL_TRIGGER_CHANCE_ON_HIT,
//   [ITEM_SPELL_TRIGGER_SOULSTONE]: ITEM_SPELL_TRIGGER_SOULSTONE,
//   [ITEM_SPELL_TRIGGER_LEARN_SPELL]: ITEM_SPELL_TRIGGER_LEARN_SPELL,
// }

export const DEFAULT_TABLE_PREFIX = '__'

