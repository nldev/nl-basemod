import { CREATE_TABLE_TASK } from '../constants'
import { NWTask, Template } from '../task'
import { Database, SQLTable } from '../types'

export interface TableTemplate extends Template {
  id: typeof CREATE_TABLE_TASK
  options: TableOptions
}

export type TableOptions = SQLTable & {
  database?: Database
}

export class CreateTable extends NWTask {
  static readonly id = CREATE_TABLE_TASK

  process ({ options }: TableTemplate) {
    this.builder.Table(options)
  }
}

