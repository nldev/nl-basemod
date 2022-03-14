import fs from 'fs'
import { std, DBC, SQL } from 'wow/wotlk'

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
import { CreateTable } from './tasks/create-table'
import { CreateAutolearn } from './tasks/create-autolearn'
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
import { TABLES } from './templates/tables'
import { AUTOLEARN } from './templates/autolearn'
import { ENV, DEFAULT_MOD, DEFAULT_TABLE_PREFIX } from './constants'
import { Data, Database, Env, Mapping, SQLTable } from './types'
import { dashCaseToConstantCase, noop } from './utils'

export const ADDON_PATH = __dirname + '/../../../addon'
export const ADDON_DATA_PATH = ADDON_PATH + '/data'
export const DEFAULT_SPEED = 0.8
export const DEFAULT_VERSION = '0.1.0'

export const DEFAULT_CONFIG = {
  mod: DEFAULT_MOD,
  version: DEFAULT_VERSION,
  env: ENV.DEV,
  baseSpeed: DEFAULT_SPEED,
  tablePrefix: DEFAULT_TABLE_PREFIX,
  tasks: {
    // 'CREATE_MODIFIER': true,
    // 'CREATE_NPC': true,

    // 'CREATE_MOUNT': true,
    // 'CREATE_ITEM': true,
    // 'CREATE_SPELL': true,
    // 'CREATE_STAT': true,
    // 'CREATE_TALENT': true,
    // 'CREATE_TABLE': true,
    // 'CREATE_AUTOLEARN': true,
    // 'INSERT_SERVER_DATA': true,
    // 'INSERT_CLIENT_DATA': true,
  },
  templates: [
    ...TABLES,
    ...STATS,
    ...SPELLS,
    ...ITEMS,
    ...TALENTS,
    ...AUTOLEARN,
    // ...NPCS,
    // ...MODIFIERS,
    ...MOUNTS,
  ],
}

export const DEFAULT_OPTIONS = {
  tasks: [
    CreateStat,
    CreateSpell,
    CreateItem,
    CreateTalent,
    CreateTable,
    InsertServerData,
    InsertClientData,
    // CreateNpc,
    // CreateModifier,
    CreateMount,
    CreateAutolearn,
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
}

export interface BuilderOptions {
  tasks: Task[]
}

export interface BuilderConfig {
  mod: string
  version: string
  env: Env
  tasks: Mapping<Task>
  templates: any[]
  baseSpeed?: number
  tablePrefix?: string
}

export interface Template<T = any> {
  id: string
  data: T
}

export interface Task {
  id: string
  setup?: ($: Builder) => void
  process?: ($: Builder, template: Template) => void
}

export class Builder {
  public readonly Mod: string = DEFAULT_MOD
  public readonly Version: string = DEFAULT_VERSION
  public readonly Env: Env = ENV.DEV
  public readonly BaseSpeed: number = DEFAULT_SPEED

  protected readonly TablePrefix: string = DEFAULT_TABLE_PREFIX

  protected readonly templates: Template[] = []
  protected readonly tasks: Mapping<Task> = {}
  protected readonly addonFiles: Mapping<boolean> = {}
  protected readonly databaseTables: Mapping<boolean> = {}

  protected readonly data: any = {}

  constructor (options: BuilderOptions = DEFAULT_OPTIONS, config: BuilderConfig = DEFAULT_CONFIG) {
    if (config.mod)
      this.Mod = config.mod

    if (config.version)
      this.Version = config.version

    if (config.env)
      this.Env = config.env

    if (config.baseSpeed)
      this.BaseSpeed = config.baseSpeed

    if (config.tablePrefix)
      this.Mod = config.tablePrefix

    if (config.templates)
      config.templates.forEach(template => this.templates.push(template))

    for (const task of options.tasks) {
      if (config.tasks[task.id])
        this.tasks[task.id] = task
    }

    this.setup()
    this.process()
  }

  protected setup () {
    for (const [_, task] of Object.entries<Task>(this.tasks)) {
      if (task.setup)
        task.setup(this)
    }
  }

  protected process () {
    for (const template of this.templates)
      this.Run(template)
  }


  public Run (template: Template) {
    for (const [_, task] of Object.entries<Task>(this.tasks))
      if (task.process)
        task.process(this, template)
  }

  public Get <T>(a: string, b?: string) {
    if (b)
      return this.data[a][b] as T
    return this.data[a] as T
  }

  public Set <T>(a: string, b: string, data: T) {
    this.data[a][b] = data
  }

  public Table (options: SQLTable) {
    const lines = []

    if (!options.isPersist)
      lines.push(`drop table if exists ${this.TablePrefix}${options.name};`)

    lines.push(`create table if not exists ${this.TablePrefix}${options.name} (`)

    let primaryKey

    for (const column of options.columns) {
      let line = `  ${column.name} ${column.type}`

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
          line += `(${column.typeParams.size})`
          break
        case 'time':
        case 'datetime':
        case 'timestamp':
          line += `(${column.typeParams.fsp})`
          break
        case 'decimal':
        case 'double':
          line += `(${column.typeParams.size}, ${column.typeParams.digits})`
          break
        case 'float':
          line += `(${column.typeParams.precision})`
          break
      }

      if (column.isNotNullable)
        line += ' not null'

      if (column.isAutoIncrement)
        line += ' auto_increment'

      if (column.isPrimaryKey)
        primaryKey = column.name

      line += ','

      lines.push(line)
    }

    if (primaryKey)
      lines.push(`  primary key (${primaryKey}),`)

    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1)

    lines.push(');')

    this.databaseTables[options.name] = true

    const db = (options.database === 'auth')
      ? std.SQL.Databases.auth
      : std.SQL.Databases.world_dest

    const query = lines.join('\n')

    db.write(query)
  }

  public WriteToDatabase (table: string, data: any, database: Database = 'world') {
    if (!this.databaseTables[table])
      throw new Error(`Database table ${database}.${this.TablePrefix}${table} does not exist, cannot insert record.`)

    let lines = [`insert into ${this.TablePrefix}${table} (`]

    const columns = []
    const values = []

    for (const key of Object.keys(data)) {
      const value = data[key]

      columns.push(`  ${key},`)

      if (typeof value === 'string') {
        values.push(`  '${value}',`)
      } else {
        values.push(`  ${value},`)
      }
    }

    columns[columns.length - 1] = columns[columns.length - 1].slice(0, -1)
    values[values.length - 1] = values[values.length - 1].slice(0, -1)

    lines = lines.concat(columns)
    lines.push(') values (')

    lines = lines.concat(values)
    lines.push(');')

    const db = (database === 'auth')
      ? std.SQL.Databases.auth
      : std.SQL.Databases.world_dest
    const query = lines.join('\n')

    db.write(query)
  }

  public WriteToAddon (file: string, data: any) {
    const list: string[] = []

    for (const key of Object.keys(data))
      list.push(`export const ${dashCaseToConstantCase(key)} = ${JSON.stringify(data[key])};`)

    const filePath = `${ADDON_DATA_PATH}/${file}.ts`

    if (!fs.existsSync(ADDON_DATA_PATH))
      fs.mkdirSync(ADDON_DATA_PATH)

    let code = list.join('\n')

    if (this.addonFiles[file]) {
      const existing = fs.readFileSync(filePath, { encoding: 'utf8' })

      code = existing + code
    } else {
      this.addonFiles[file] = true
    }

    fs.writeFileSync(filePath, code, { encoding: 'utf8' })
  }
}

