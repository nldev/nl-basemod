import fs from 'fs'
import { std } from 'wow/wotlk'

import { ENV, DEFAULT_MOD, DEFAULT_TABLE_PREFIX } from './constants'
import { Database, Env, Mapping, SQLTable } from './types'
import { DashCaseToConstantCase } from './utils'
import { CreateTable } from './sql'
import { CreateSpell } from './spells'
import { CreateItem } from './items'
import { CreateNpc } from './npcs'
import { CreateTalent } from './talents'
import { CreateAutolearn } from './autolearn'
import { CreateMap } from './maps'

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
    'create-table': true,
    'create-spell': true,
    'create-item': true,
    'create-npc': true,
    'create-talent': true,
    'create-autolearn': true,
    'create-map': true,
  },
  templates: [
  ],
}

export type TaskOptions<T = any> = boolean | Mapping<T>

export const DEFAULT_OPTIONS = {
  tasks: [
    CreateTable,
    CreateSpell,
    CreateItem,
    CreateNpc,
    CreateTalent,
    CreateAutolearn,
    CreateMap,
  ],
}

export interface BuilderOptions {
  tasks: Task[]
}

export interface BuilderConfig {
  mod: string
  version: string
  env: Env
  tasks: Mapping<TaskOptions>
  templates: TemplateOptions[]
  baseSpeed?: number
  tablePrefix?: string
}

export interface Templates<T = any> {
  taskId: string
  list: TemplateOptions<T>[]
}

export interface TemplateOptions<T = any> {
  data?: T
  id?: string
  taskId?: string
  needs?: string[]
}

export interface Template<T = any> extends TemplateOptions {
  data: T
  id: string
  taskId: string
  needs: string[]
}

export interface Task<T = any, O = any> {
  id: string
  identify?: ($: Builder, template: Template<T>, options: O) => string
  setup?: ($: Builder, options: O) => void
  process?: ($: Builder, template: Template<T>, options: O) => void
}

export function Select <T = any>(o: T, s: string): T | null {
  s = s.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')
  const a = s.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i]
    if (k in o) {
      o = (o as any)[k]
    } else {
      return null
    }
  }
  return o
}

export class Builder {
  public readonly Mod: string = DEFAULT_MOD
  public readonly Version: string = DEFAULT_VERSION
  public readonly Env: Env = ENV.DEV
  public readonly BaseSpeed: number = DEFAULT_SPEED

  protected readonly templates: TemplateOptions[] = []
  protected readonly tasks: Mapping<Task> = {}
  protected readonly addonFiles: Mapping<boolean> = {}
  protected readonly databaseTables: Mapping<boolean> = {}
  protected readonly tablePrefix: string = DEFAULT_TABLE_PREFIX
  protected readonly data: any = {}
  protected readonly ranTemplates: any = {}
  protected readonly processQueue: TemplateOptions[] = []

  constructor (
    cb: ($: Builder) => void = () => {},
    protected readonly options: BuilderOptions = DEFAULT_OPTIONS,
    protected readonly config: BuilderConfig = DEFAULT_CONFIG,
  ) {
    // setup
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

    for (const [key, isActive] of Object.entries<TaskOptions>(config.tasks)) {
      for (const task of options.tasks)
        if ((task.id === key) && isActive)
          this.tasks[key] = task
    }

    // init
    for (const [_, task] of Object.entries<Task>(this.tasks))
      if (task.setup)
        task.setup(this, config.tasks[task.id])

    for (const template of this.templates)
      this.Process(template)

    cb(this)

    if (this.processQueue.length)
      throw new Error(`${this.processQueue.length} items left in processing queue`)
  }

  public ProcessMany <T = any>({ taskId, list }: Templates<T>) {
    for (const [_, task] of Object.entries<Task<T>>(this.tasks))
      if (task.process)
        for (const template of list)
          if (task.id === taskId)
            this.Process({ ...template, taskId })
  }

  public Process <T = any>(template: TemplateOptions<T>, lastId: (null | string) = null) {
    let isNeedsSatisfied = true

    if (!template.id && template.taskId) {
      const identify: any = this.tasks[template.taskId].identify
      template.id = identify(this, template, this.config.tasks[template.taskId])
    }

    if (!template.id)
      throw new Error(`Templates must have a unique ID`)

    if (this.ranTemplates[template.id])
      throw new Error(`Template ${template.id} has already been processed`)

    if (template.needs)
      template.needs.forEach(n => {
        const t = this.ranTemplates[n]
        if (!t)
          isNeedsSatisfied = false
      })

    if (!isNeedsSatisfied) {
      let isAlreadyExists = false
      this.processQueue.forEach((item, i) => {
        if (item.id === template.id)
          isAlreadyExists = true
      })
      if (!isAlreadyExists)
        this.processQueue.push(template)
      return
    }

    for (const [_, task] of Object.entries<Task<T>>(this.tasks))
    if (task.process && (task.id === template.taskId)) {
      const t: Template = {
        data: template.data || {},
        needs: template.needs || [],
        taskId: template.taskId || '',
        id: template.id,
      }

      task.process(this, t, this.config.tasks[task.id])
    }

    this.processQueue.forEach((item, i) => {
      if (item.id === template.id)
        this.processQueue.splice(i, 1)
    })

    this.ranTemplates[template.id] = template

    this.processQueue.forEach(item => this.Process(item, template.id))
  }

  public Get <T = any>(selection: string): T {
    return Select(this.data, selection)
  }

  public Set <T = any>(a: string, b: string, data: T) {
    if (!this.data[a])
      this.data[a] = {}
    this.data[a][b] = data
  }

  public Table (options: SQLTable) {
    const lines = []

    if (!options.isPersist)
      lines.push(`drop table if exists ${this.tablePrefix}${options.name};`)

    lines.push(`create table if not exists ${this.tablePrefix}${options.name} (`)

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
      throw new Error(`Database table ${database}.${this.tablePrefix}${table} does not exist, cannot insert record.`)

    let lines = [`insert into ${this.tablePrefix}${table} (`]

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
      list.push(`export const ${DashCaseToConstantCase(key)} = ${JSON.stringify(data[key])};`)

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

