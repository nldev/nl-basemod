import fs from 'fs'
import { std } from 'wow/wotlk'

import { ADDON_DATA_PATH, DEFAULT_MOD, DEFAULT_OPTIONS, DEFAULT_SPEED, DEFAULT_TABLE_PREFIX, DEFAULT_VERSION } from './constants'
import { Database, Env, Mapping, SQLTable } from './types'
import { Constantify } from './utils'

export interface BuilderOptions {
  mod: string
  version: string
  baseSpeed?: number
  tablePrefix?: string
}

export class Builder {
  public readonly Mod: string = DEFAULT_MOD
  public readonly Version: string = DEFAULT_VERSION
  public readonly BaseSpeed: number = DEFAULT_SPEED

  protected readonly tasks: string[] = []
  protected readonly addonFiles: Mapping<boolean> = {}
  protected readonly databaseTables: Mapping<boolean> = {}
  protected readonly tablePrefix: string = DEFAULT_TABLE_PREFIX

  constructor (protected readonly options: BuilderOptions = DEFAULT_OPTIONS) {
    if (options.mod)
      this.Mod = options.mod

    if (options.version)
      this.Version = options.version

    if (options.baseSpeed)
      this.BaseSpeed = options.baseSpeed

    if (options.tablePrefix)
      this.Mod = options.tablePrefix
  }

  public Run <T>(id: string, fn: () => T): T {
    if (this.tasks.includes(id))
      throw 'A task with an ID of ${taskID} has already been ran'
    const value = fn()
    this.tasks.push(id)
    return value
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
      throw `Database table ${database}.${this.tablePrefix}${table} does not exist, cannot insert record.`

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
      list.push(`export const ${Constantify(key)} = ${JSON.stringify(data[key])};`)

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

const $ = new Builder()
const x = $.Run('hello', () => 5)

