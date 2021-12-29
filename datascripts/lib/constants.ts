import { AssetType } from './asset'
import { ItemSpellTrigger, Map, Query } from './types'

export const ENV = {
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
}

export const SPELL = 'spell'
export const ITEM = 'item'
export const NPC = 'npc'
export const ACHIEVEMENT = 'achievement'
export const UNNAMED = 'unnamed'

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

export const SPELL_ID_PREFIX = 's--'
export const ITEM_ID_PREFIX = 'i--'
export const NPC_ID_PREFIX = 'n--'
export const OTHER_ID_PREFIX = 'o--'

export const ASSET_TYPE: Map<AssetType> = {
  SPELL: SPELL,
  ITEM: ITEM,
  NPC: NPC,
  ACHIEVEMENT: ACHIEVEMENT,
}

export const SCHOOLS = {
  FIRE: 'fire',
  FROST: 'frost',
  NATURE: 'nature',
  SHADOW: 'shadow',
  HOLY: 'holy',
  ARCANE: 'arcane',
}

export const BASE_MOUNT_SPEED = 80

export const CREATE_ACHIEVEMENT_TASK = 'create-achievement'
export const CREATE_ENCHANT_TASK = 'create-enchant'
export const CREATE_ITEM_TASK = 'create-item'
export const CREATE_GEM_TASK = 'create-gem'
export const CREATE_NPC_TASK = 'create-npc'
export const CREATE_MODIFIER_TASK = 'create-modifier'
export const CREATE_MOUNT_TASK = 'create-mount'
export const CREATE_PET_TASK = 'create-pet'
export const CREATE_PROFESSION_TASK = 'create-profession'
export const CREATE_SPELL_TASK = 'create-spell'
export const CREATE_STAT_TASK = 'create-stat'
export const CREATE_SUMMON_TASK = 'create-summon'
export const SETUP_CHARACTER_CREATION_TASK = 'setup-character-creation'
export const GENERATE_EQUIPMENT_TASK = 'generate-equipment'
export const SETUP_CLASS_DRUID_TASK = 'setup-class-druid'
export const SETUP_CLASS_HUNTER_TASK = 'setup-class-hunter'
export const SETUP_CLASS_MAGE_TASK = 'setup-class-mage'
export const SETUP_CLASS_PALADIN_TASK = 'setup-class-paladin'
export const SETUP_CLASS_PRIEST_TASK = 'setup-class-priest'
export const SETUP_CLASS_ROGUE_TASK = 'setup-class-rogue'
export const SETUP_CLASS_SHAMAN_TASK = 'setup-class-shaman'
export const SETUP_CLASS_WARLOCK_TASK = 'setup-class-warlock'
export const SETUP_CLASS_WARRIOR_TASK = 'setup-class-warrior'
export const CREATE_DIRECT_SPELL_TASK = 'create-summon'
export const CREATE_EFFECT_OVER_TIME_SPELL_TASK = 'create-summon'
export const CREATE_RANGED_SPELL_TASK = 'create-summon'
export const SETUP_SKILLS_TASK = 'setup-skills'
export const CREATE_CONSUMABLE_TASK = 'create-summon'

export const QUERY_ID = 'query-id'
export const QUERY_ICON = 'query-icon'
export const QUERY_EFFECT_POINTS = 'query-effect-points'
export const QUERY_MOUNT_NPC = 'query-mount-npc'
// FIXME: implement these
export const QUERY_DIRECT_SPELL = 'query-direct-spell'
export const QUERY_ENCHANT = 'query-enchant'
export const QUERY_GEM = 'query-gem'
export const QUERY_MODIFIER = 'query-modifier'

export const DEFAULT_ICON_QUERY: Query<typeof QUERY_ICON> = {
  query: QUERY_ICON,
  subquery: SPELL,
  id: DEFAULT_ICON_SPELL_BASE,
}

export const MAX_ITEM_SPELL_COUNT = 5

export const ITEM_SPELL_TRIGGER_ON_EQUIP = 'ON_EQUIP'
export const ITEM_SPELL_TRIGGER_ON_USE = 'ON_USE'
export const ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY = 'ON_USE_NO_DELAY'
export const ITEM_SPELL_TRIGGER_CHANCE_ON_HIT = 'CHANCE_ON_HIT'
export const ITEM_SPELL_TRIGGER_SOULSTONE = 'SOULSTONE'
export const ITEM_SPELL_TRIGGER_LEARN_SPELL = 'LEARN_SPELL'

export const DEFAULT_ITEM_SPELL_TRIGGER_ID = 'default'

export const ITEM_SPELL_TRIGGERS: Map<ItemSpellTrigger> = {
  [ITEM_SPELL_TRIGGER_ON_EQUIP]: ITEM_SPELL_TRIGGER_ON_EQUIP,
  [ITEM_SPELL_TRIGGER_ON_USE]: ITEM_SPELL_TRIGGER_ON_USE,
  [ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY]: ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY,
  [ITEM_SPELL_TRIGGER_CHANCE_ON_HIT]: ITEM_SPELL_TRIGGER_CHANCE_ON_HIT,
  [ITEM_SPELL_TRIGGER_SOULSTONE]: ITEM_SPELL_TRIGGER_SOULSTONE,
  [ITEM_SPELL_TRIGGER_LEARN_SPELL]: ITEM_SPELL_TRIGGER_LEARN_SPELL,
}
