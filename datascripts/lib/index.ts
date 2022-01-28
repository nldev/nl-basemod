import fs from 'fs'
import { std } from 'tswow-stdlib'
import { DBC, SQL } from 'wotlkdata'

import { TSAsset } from './asset'
import {
    DEFAULT_ICON_SPELL_BASE, DEFAULT_MOD, DEFAULT_MOUNT_NPC_BASE, DEFAULT_SPELL_BASE, ENV,
    QUERY_EFFECT_POINTS, QUERY_ICON, QUERY_ID, QUERY_MOUNT_NPC,
} from './constants'
import { HookConstructor, HookOptions, HookState, NWHook } from './hook'
import { LogTasks } from './hooks/log-tasks'
import { ObjectifyToJson } from './hooks/objectify-to-json'
import { ItemOptions, ItemState } from './item'
import { NpcOptions, NpcState } from './npc'
import { SpellOptions, SpellState } from './spell'
import { StoreState } from './store'
import { Attempt, NWTask, TaskConstructor, TaskOptions, TaskState, Template } from './task'
import { CreateAchievement } from './tasks/create-achievement'
import { CreateEnchant } from './tasks/create-enchant'
import { CreateGem } from './tasks/create-gem'
import { CreateItem } from './tasks/create-item'
import { CreateModifier } from './tasks/create-modifier'
import { CreateMount } from './tasks/create-mount'
import { CreateNpc } from './tasks/create-npc'
import { CreateProfession } from './tasks/create-profession'
import { CreateSpell } from './tasks/create-spell'
import { CreateStat } from './tasks/create-stat'
import { CreateTalent } from './tasks/create-talent'
import { GenerateEquipment } from './tasks/generate-equipment'
import { SetupCharacterCreation } from './tasks/setup-character-creation'
import { SetupClassDruid } from './tasks/setup-class-druid'
import { SetupClassHunter } from './tasks/setup-class-hunter'
import { SetupClassMage } from './tasks/setup-class-mage'
import { SetupClassPaladin } from './tasks/setup-class-paladin'
import { SetupClassPriest } from './tasks/setup-class-priest'
import { SetupClassRogue } from './tasks/setup-class-rogue'
import { SetupClassShaman } from './tasks/setup-class-shaman'
import { SetupClassWarlock } from './tasks/setup-class-warlock'
import { SetupClassWarrior } from './tasks/setup-class-warrior'
import { SetupSkills } from './tasks/setup-skills'
import { InsertServerData } from './tasks/insert-server-data'
import { InsertClientData } from './tasks/insert-client-data'
import { ITEMS } from './templates/items'
import { MODIFIERS } from './templates/modifiers'
import { MOUNTS } from './templates/mounts'
import { NPCS } from './templates/npcs'
import { SPELLS } from './templates/spells'
import { STATS } from './templates/stats'
import { TALENTS } from './templates/talents'
import { Data, Env, LogData, Logger, LogType, Map, Queryable, QueryType, Value } from './types'
import { noop, resolveIcon } from './utils'

// FIXME move to types
export type Database = 'world' | 'auth'

export interface SQLColumn {
  name: string
  type: string
  typeParams?: any
  isUnique?: boolean
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
}

// FIXME: move to constants
export const PROJECT = 'basemod'
export const VERSION = '0.0.0'
export const ADDON_PATH = __dirname + '\\..\\..\\..\\addon'
export const DEFAULT_SPEED = 0.7

export const DEFAULT_OPTIONS: Required<Options> = {
  mod: DEFAULT_MOD,
  version: VERSION,
  env: ENV.DEV,
  baseSpeed: DEFAULT_SPEED,
  hooks: {},
  tasks: {
    // 'create-modifier': true,
    // 'create-mount': true,
    // 'create-npc': true,
    'create-item': true,
    'create-spell': true,
    'create-stat': true,
    'create-talent': true,
    'insert-client-data': true,
    'insert-server-data': true,
  },
  templates: [
    ...STATS,
    ...SPELLS,
    ...ITEMS,
    ...TALENTS,
    // ...NPCS,
    // ...MODIFIERS,
    // ...MOUNTS,
  ],
}

export type Json =
  | Json[]
  | { [key: string]: Json | Value }

export const defaultConfig: Required<Config> = {
  project: PROJECT,
  hooks: [
    // LogTasks,
    // ObjectifyToJson,
  ],
  tasks: [
    CreateStat,
    CreateSpell,
    CreateItem,
    CreateTalent,
    InsertServerData,
    InsertClientData,
    // CreateNpc,
    // CreateModifier,
    // CreateMount,
    // CreateAchievement,
    // CreateEnchant,
    // CreateGem,
    // CreateProfession,
    // GenerateEquipment,
    // SetupCharacterCreation,
    // SetupClassDruid,
    // SetupClassHunter,
    // SetupClassMage,
    // SetupClassPaladin,
    // SetupClassPriest,
    // SetupClassRogue,
    // SetupClassShaman,
    // SetupClassWarlock,
    // SetupClassWarrior,
    // SetupSkills,
  ],
  addonModules: ['index'],
  logger: noop,
}

export function Build (config?: Config) {
  return (options?: Options) => {
    const $ = new Builder(config, options)

    $.init()

    return $
  }
}

export interface Config {
  project: string
  hooks?: HookConstructor[]
  tasks?: TaskConstructor[]
  logger?: Logger
  addonModules: string[],
}

export interface Options {
  mod: string
  version: string
  env: Env
  baseSpeed: number
  hooks?: Map<HookOptions | boolean>
  tasks?: Map<TaskOptions | boolean>
  templates?: Template[]
}

// FIXME: move this to types
export interface ErrorData {
  id: string
  fn: ((...args: any[]) => any)
}

export interface ErrorLog {
  message: ((...args: any[]) => string)
  info?: ErrorData[]
  data?: any
}

export class Builder {
  public readonly mod: string

  public readonly std: typeof std = std
  public readonly dbc: typeof DBC = DBC
  public readonly sql: typeof SQL = SQL

  public readonly Store = new StoreState({}, this)
  public readonly Spell = new SpellState({}, this)
  public readonly Item = new ItemState({}, this)
  public readonly Npc = new NpcState({}, this)

  public readonly Hook: HookState
  public readonly Task: TaskState

  public readonly baseSpeed: number

  protected readonly spells: SpellOptions[] = []
  protected readonly items: ItemOptions[] = []
  protected readonly npcs: NpcOptions[] = []

  protected templates: Template[]

  protected readonly logger: Logger

  constructor (
    public config: Config = defaultConfig,
    public options: Options = DEFAULT_OPTIONS,
  ) {
    this.mod = options.mod || DEFAULT_OPTIONS.mod

    this.logger = config.logger || noop

    this.Hook = this.hooks(options, config)
    this.Task = this.tasks(options, config)

    this.templates = options.templates || []
    this.baseSpeed = options.baseSpeed || 1
  }

  private hooks (options: Options, config: Config) {
    return new HookState((config.hooks || []).map(
      Constructor =>
        (options && options.hooks && options.hooks[Constructor.id])
          ? new Constructor(
              typeof options.hooks[Constructor.id] === 'boolean'
                ? { id: Constructor.id, options: {} }
                : (options.hooks[Constructor.id] as HookOptions),
              this,
            )
          : null
    ).reduce((previous, current) => {
      const map: Map<NWHook> = { ...previous }

      if (current)
        map[current.id] = current

      return map
    }, {}), this)
  }

  private tasks (options: Options, config: Config) {
    return new TaskState((config.tasks || []).map(
      Constructor =>
        (options && options.tasks && options.tasks[Constructor.id])
          ? new Constructor(
              typeof options.tasks[Constructor.id] === 'boolean'
                ? { id: Constructor.id, options: {} }
                : (options.tasks[Constructor.id] as TaskOptions),
              this,
            )
          : null
    ).reduce((previous, current) => {
      const map: Map<NWTask> = { ...previous }
      if (current)
        map[current.id] = current

      return map
    }, {}), this)
  }

  private setup () {
    for (const hook of this.Hook.list)
      hook.setup()

    for (const task of this.Task.list)
      task.setup()
  }

  private load () {
    for (const task of this.Task.list)
      this.templates = [
        ...this.templates,
        ...task.load(),
      ]
  }

  private process () {
    const attempts: Attempt[] = []

    for (const template of this.templates) for (const task of this.Task.list) {
      const attempt: Attempt = {
        template,
        task,
        fn: () => task.process(template),
      }

      if (task.isReducer || (template.id === task.id)) {
        // onTaskProcessBegin
        for (const hook of this.Hook.list)
          hook.onTaskProcessBegin(task, template)

        this.attempt(attempt.fn, {
          message: (d: any) => `failed at task '${d.task.id}'`,
          info: [
            {
              id: 'task',
              fn: (d: any) => ({
                id: d.task.id,
                data: d.task.data,
                isReducer: d.task.isReducer,
              }),
            },
            {
              id: 'template',
              fn: (d: any) => ({
                id: d.template.id,
                options: d.template.options,
              }),
            },
          ],
          data: {
            task,
            template,
          },
        })

        // onTaskProcessSuccess
        for (const hook of this.Hook.list)
          hook.onTaskProcessSuccess(task, template)
      }
    }

    for (const attempt of attempts) {
        const { task, template } = attempt
        attempt.fn()

        // onTaskProcessSuccess
        for (const hook of this.Hook.list)
          hook.onTaskProcessSuccess(task, template)
    }
  }

  public init () {
    // onInitBegin
    for (const hook of this.Hook.list)
      hook.onInitBegin()

    this.setup()
    this.load()
    this.process()

    // OnInitSuccess
    for (const hook of this.Hook.list)
      hook.onInitSuccess()
  }

  public query <T extends number = number>(options?: Queryable<number, QueryType>, defaultValue?: T): number
  public query <T extends string = string>(options?: Queryable<string, QueryType>, defaultValue?: T): string
  public query <T = any>(options?: Queryable<Value, QueryType>, defaultValue?: T) {
    if ((typeof options === 'string') || (typeof options === 'number'))
      return (defaultValue && !options) ? defaultValue : options

    if ((options === null) || (typeof options === 'undefined') || (typeof options === 'boolean'))
      return defaultValue ? defaultValue : null

    const { query: type, subquery: subtype, id } = options

    let result: string | number
    let asset: TSAsset = this.std.Spells.load(DEFAULT_ICON_SPELL_BASE)

    switch (type) {
      case QUERY_ICON:
        switch (subtype) {
          case 'spell':
            asset = typeof id === 'number'
              ? this.std.Spells.load(id)
              : this.Spell.get(id).asset
              break
          case 'item':
            asset = typeof id === 'number'
              ? this.std.Items.load(id)
              : this.Item.get(id).asset
              break
          case 'achievement':
            asset = typeof id === 'number'
              ? this.std.Achievements.load(id)
              : asset
              break
        }

        return resolveIcon(asset)

      case QUERY_ID:
        result = DEFAULT_SPELL_BASE

        switch (subtype) {
          case 'spell':
            result = typeof id === 'number'
              ? this.std.Spells.load(id).ID
              : this.Spell.get(id).asset.ID
              break
          case 'item':
            result = typeof id === 'number'
              ? this.std.Items.load(id).ID
              : this.Item.get(id).asset.ID
              break
          case 'npc':
            result = typeof id === 'number'
              ? this.std.CreatureTemplates.load(id).ID
              : this.Npc.get(id).asset.ID
              break
        }

        return result

      case QUERY_EFFECT_POINTS:
        result = typeof id === 'number'
          ? this.std.Spells.load(id)
            .Effects.get(subtype as number).PointsBase.get()

          : this.Spell.get(id).asset
            .Effects.get(subtype as number).PointsBase.get()

        return result

      case QUERY_MOUNT_NPC:
        result = DEFAULT_MOUNT_NPC_BASE

        switch (subtype) {
          case 'spell':

            asset = typeof id === 'number'
              ? this.std.Spells.load(id)
              : this.Spell.get(id).asset

            result = asset.Effects.get(0).MiscValueA.get()

            break
          case 'item':
            asset = typeof id === 'number'
              ? this.std.Items.load(id)
              : this.Item.get(id).asset

            result = this.std.Spells.load(asset.Spells.get(0).Spell.getRef().ID)
              .Effects.get(0).MiscValueA.get()

            break
        }

        return result
    }
  }

  private attempt (fn: (...args: any[]) => any, log: ErrorLog) {
    return fn()
  }

  public log (input: any = '', data?: LogData, type: LogType = 'log') {
    if (type === 'log')
      data ? console.log(input, data) : console.log(input)

    if (type === 'warn')
      data ? console.warn(input, data) : console.warn(input)

    if (type === 'error')
      data ? console.error(input, data) : console.error(input)

    this.logger(input, data, type)
  }

  public objectify (input: any) {
    let result: Data = {}

    if (input)
      result = input.objectify()

    return result
  }

  Table ({ name, columns, database }: SQLTable) {
    const db = (database === 'auth')
      ? this.sql.Databases.auth
      : this.sql.Databases.world_dest

    const lines = [`create table if not exists ${name} (`]
    let primaryKey

    for (const column of columns) {
      let line = `  ${column.name} `

      switch (column.type) {
        case 'tinytext':
        case 'mediumtext':
        case 'longtext':
        case 'tinyblob':
        case 'mediumblob':
        case 'longblob':
        case 'bool':
        case 'date':
        case 'time':
          line += `${column.type}`
          break
        case 'varbinary':
        case 'binary':
        case 'char':
        case 'varchar':
        case 'int':
        case 'tinyint':
        case 'smallint':
        case 'mediumint':
        case 'bigint':
        case 'text':
        case 'blob':
        case 'bit':
          line += `${column.type}(${column.typeParams.size})`
          break
        case 'time':
        case 'datetime':
        case 'timestamp':
          line += `${column.type}(${column.typeParams.fsp})`
          break
        case 'decimal':
        case 'double':
          line += `${column.type}(${column.typeParams.size}, ${column.typeParams.digits})`
          break
        case 'float':
          line += `${column.type}(${column.typeParams.precision})`
          break
      }

      if (column.isNotNullable)
        line += ' not null'

      if (column.isUnique)
        line += ' unique'

      if (column.isAutoIncrement)
        line += ' auto_increment'

      if (column.isPrimaryKey)
        primaryKey = column.name

      line += ','

      lines.push(line)
    }

    // remove last comma
    lines[lines.length - 1].slice(0, -1)

    if (primaryKey)
      lines.push(`  primary key (${primaryKey})`)

    lines.push(');')

    const query = lines.join('\n')

    db.write(query)
  }

  ServerData (data: any, table: string = 'json', database: Database = 'world') {
  }

  ClientData (data: any, module: string = 'index') {
    const list: string[] = []

    if (!this.config.addonModules.includes(module))
      return

    for (const key of Object.keys(data)) {
      const value = data[key]
      const prefix = `export const ${key} = `

      list.push(prefix + JSON.stringify(value))
    }

    const dataPath = ADDON_PATH + '\\data'
    const filePath = `${dataPath}\\${module}.ts`

    if (!fs.existsSync(dataPath))
      fs.mkdirSync(dataPath)

    let code = list.join('\n')

    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, { encoding: 'utf8' })

      code = existing + code
    }

    fs.writeFileSync(filePath, code, { encoding: 'utf8' })
  }
}

