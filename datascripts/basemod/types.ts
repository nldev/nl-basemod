// import { EnumCellWrapper } from 'wotlkdata/cell/cells/EnumCell'
// import { LocSystem } from 'wotlkdata/cell/systems/CellSystem'

import {
   ACHIEVEMENT, ENV, ITEM, ITEM_SPELL_TRIGGER_CHANCE_ON_HIT, ITEM_SPELL_TRIGGER_LEARN_SPELL,
   ITEM_SPELL_TRIGGER_ON_EQUIP, ITEM_SPELL_TRIGGER_ON_USE, ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY,
   ITEM_SPELL_TRIGGER_SOULSTONE, ITEM_SPELL_TRIGGERS, NPC, QUERY_EFFECT_POINTS, QUERY_ICON,
   QUERY_ID, QUERY_MOUNT_NPC, SCHOOLS, SPELL, ROGUE, WARRIOR, DRUID, MAGE, WARLOCK, SHAMAN, PRIEST, PALADIN, HUNTER, HUMAN, ORC, DWARF, NIGHT_ELF, UNDEAD, TAUREN, GNOME, TROLL, BLOOD_ELF, DRAENEI
} from './constants'
import { NWSpell } from './spell'

export interface Localization {
  enGB: string
}

export type Env = typeof ENV.DEV | typeof ENV.TEST | typeof ENV.PROD

export type Nil = undefined | null

export type ReadOnly<T> = { readonly [P in keyof T]: T[P] }

export type DeepReadOnly<T> = { readonly [P in keyof T]: DeepReadOnly<T[P]> }

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> }

export type Value =
  | string
  | number
  | boolean
  | null

export type List = (Data | List | Value)[]

export interface Data {
  [key: string]: Data | List | Value
}

export interface Data {
  [key: number]: Data | List | Value
}

export type Json =
  | Json[]
  | { [key: string]: Json | Value }

export interface Map<T> {
  [key: string]: T
}

export type Optional<T> = Mutable<Partial<T>>

export type Nullable<T> = T | null | undefined

// FIXME
// export type TSText<T = any> = string | Localization | LocSystem<T>
export type TSText = string | Localization | any

export type TSKeysExcludable = 'objectify' | 'set' | 'get' | 'end'

export type TSKeys<
  // C extends EnumCellWrapper<unknown>,
  C extends any,
  E extends string = TSKeysExcludable,
> = keyof Omit<C, E>

export type Effect<T> = T | [T] | [T, T] | [T, T, T]

export type AssetId = number | string

// copper, silver, gold
export type Gold =
  | number
  | [number]
  | [number, number]
  | [number, number, number]

// seconds, minutes, hours, days, weeks
export type Duration =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, number, number]

export interface LogData {
  error?: Error | unknown
  [key: string]: any
}

export type LogType = 'log' | 'warn' | 'error'

export type Logger = (string: string, data?: LogData, type?: LogType) => void

export type QueryType = typeof QUERY_ID | typeof QUERY_ICON | typeof QUERY_EFFECT_POINTS | typeof QUERY_MOUNT_NPC

export type QueryIconSubquery = typeof SPELL | typeof ITEM | typeof ACHIEVEMENT

export type QueryIdSubquery = typeof SPELL | typeof ITEM | typeof NPC

export type QueryMountNpcSubquery = typeof SPELL | typeof ITEM

export interface Query<K extends QueryType = QueryType> {
  query: K
  subquery: K extends typeof QUERY_ID
    ? QueryIdSubquery
    : K extends typeof QUERY_ICON
    ? QueryIconSubquery
    : K extends typeof QUERY_EFFECT_POINTS
    ? number
    : K extends typeof QUERY_MOUNT_NPC
    ? QueryMountNpcSubquery
    : string
  id: AssetId
}

export type Queryable<V extends Value, K extends QueryType = QueryType> = V | Query<K>

export type School =
  | typeof SCHOOLS.FIRE
  | typeof SCHOOLS.FROST
  | typeof SCHOOLS.NATURE
  | typeof SCHOOLS.SHADOW
  | typeof SCHOOLS.HOLY
  | typeof SCHOOLS.ARCANE

export type ItemSpellTrigger =
  | typeof ITEM_SPELL_TRIGGER_ON_USE
  | typeof ITEM_SPELL_TRIGGER_ON_USE_NO_DELAY
  | typeof ITEM_SPELL_TRIGGER_ON_EQUIP
  | typeof ITEM_SPELL_TRIGGER_CHANCE_ON_HIT
  | typeof ITEM_SPELL_TRIGGER_SOULSTONE
  | typeof ITEM_SPELL_TRIGGER_LEARN_SPELL

export interface ItemSpell {
  readonly spell: number
  readonly iLevel: number
  readonly trigger: ItemSpellTrigger
  readonly charges?: number
  readonly ppm?: number
  readonly category?: number
  readonly cooldown?: number
  readonly categoryCooldown?: number
}

export type ItemSpellOptions = Omit<Partial<ItemSpell>, 'spell'> & {
  iLevel: number
}

export interface BaseMissileOptions {
  type: 'base'
 // | 'copy' | 'create'

}

export interface CreateMissileOptions {
}

export type CopyMissileOptions = CreateMissileOptions & {
}

export interface Debug {
  showAllAuras: boolean;
  enableDebugScripts: boolean;
}

export type DebugOptions = Optional<Debug>

export type Database = 'world' | 'auth'

export interface SQLColumn {
  name: string
  type: string
  typeParams?: any
  isAutoIncrement?: boolean
  isPrimaryKey?: boolean
  isNotNullable?: boolean
}

export interface SQLTinyText extends SQLColumn {
  type: 'tinytext'
}

export interface SQLMediumText extends SQLColumn {
  type: 'mediumtext'
}

export interface SQLLongText extends SQLColumn {
  type: 'longtext'
}

export interface SQLTinyBlob extends SQLColumn {
  type: 'tinyblob'
}

export interface SQLMediumBlob extends SQLColumn {
  type: 'mediumblob'
}

export interface SQLLongBlob extends SQLColumn {
  type: 'longblob'
}

export interface SQLBool extends SQLColumn {
  type: 'bool'
}

export interface SQLDate extends SQLColumn {
  type: 'date'
}

export interface SQLTime extends SQLColumn {
  type: 'time'
  typeParams: {
    fsp: number
  }
}

export interface SQLDateTime extends SQLColumn {
  type: 'datetime'
  typeParams: {
    fsp: number
  }
}

export interface SQLTimestamp extends SQLColumn {
  type: 'timestamp'
  typeParams: {
    fsp: number
  }
}

export interface SQLVarBinary extends SQLColumn {
  type: 'varbinary'
  typeParams: {
    size: number
  }
}

export interface SQLBinary extends SQLColumn {
  type: 'binary'
  typeParams: {
    size: number
  }
}

export interface SQLChar extends SQLColumn {
  type: 'char'
  typeParams: {
    size: number
  }
}

export interface SQLVarChar extends SQLColumn {
  type: 'varchar'
  typeParams: {
    size: number
  }
}

export interface SQLInt extends SQLColumn {
  type: 'int'
  typeParams: {
    size: number
  }
}

export interface SQLTinyInt extends SQLColumn {
  type: 'tinyint'
  typeParams: {
    size: number
  }
}

export interface SQLSmallInt extends SQLColumn {
  type: 'smallint',
  typeParams: {
    size: number
  }
}

export interface SQLMediumInt extends SQLColumn {
  type: 'mediumint'
  typeParams: {
    size: number
  }
}

export interface SQLBigInt extends SQLColumn {
  type: 'bigint'
  typeParams: {
    size: number
  }
}

export interface SQLFloat extends SQLColumn {
  type: 'float',
  typeParams: {
    precision: number
  }
}

export interface SQLDecimal extends SQLColumn {
  type: 'decimal',
  typeParams: {
    size: number
    digits: number
  }
}

export interface SQLDouble extends SQLColumn {
  type: 'double',
  typeParams: {
    size: number
    digits: number
  }
}

export interface SQLText extends SQLColumn {
  type: 'text',
  typeParams: {
    size: number
  }
}

export interface SQLBlob extends SQLColumn {
  type: 'blob',
  typeParams: {
    size: number
  }
}

export interface SQLBit extends SQLColumn {
  type: 'bit',
  typeParams: {
    size: number
  }
}

export type SQLColumnDefinition =
  | SQLTinyText
  | SQLMediumText
  | SQLLongText
  | SQLTinyBlob
  | SQLMediumBlob
  | SQLLongBlob
  | SQLBool
  | SQLDate
  | SQLTime
  | SQLDateTime
  | SQLTimestamp
  | SQLVarBinary
  | SQLBinary
  | SQLChar
  | SQLVarChar
  | SQLInt
  | SQLTinyInt
  | SQLSmallInt
  | SQLMediumInt
  | SQLBigInt
  | SQLFloat
  | SQLDecimal
  | SQLDouble
  | SQLText
  | SQLBlob
  | SQLBit

export interface SQLTable {
  name: string
  columns: SQLColumnDefinition[]
  database?: Database
  isPersist?: boolean
}

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

export interface RaceMap<T = boolean> {
  HUMAN?: T
  ORC?: T
  DWARF?: T
  NIGHT_ELF?: T
  UNDEAD?: T
  TAUREN?: T
  GNOME?: T
  TROLL?: T
  BLOOD_ELF?: T
  DRAENEI?: T
}

export interface ClassMap<T = boolean> {
  WARRIOR?: T
  ROGUE?: T
  DRUID?: T
  MAGE?: T
  WARLOCK?: T
  SHAMAN?: T
  PRIEST?: T
  PALADIN?: T
  HUNTER?: T
}

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

export interface ExportData {
  data: any
  target: string
}

export interface ServerExportData extends ExportData {
  table: string
  database: Database
}
