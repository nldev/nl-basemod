import { Task } from '.'
import { SQLTable } from './types'

export interface CreateTableConfig {}

export const CreateTable: Task<SQLTable, CreateTableConfig> = {
  id: 'create-map',
  process: ($, template, config) =>
    $.Table(template.data)
}

