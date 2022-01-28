import { CREATE_TABLE_TASK } from '../constants'
import { NWTask, Template } from '../task'
import { TableOptions } from '../types'

export interface TableTemplate extends Template {
  id: typeof CREATE_TABLE_TASK
  options: TableOptions
}

export class CreateTable extends NWTask {
  static readonly id = CREATE_TABLE_TASK

  process ({ options }: TableTemplate) {
    this.builder.Table(options)
  }
}

