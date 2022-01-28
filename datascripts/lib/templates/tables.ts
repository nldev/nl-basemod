import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { TableOptions } from '../tasks/create-table'

export const TABLES = createTemplates<TableOptions>(CREATE_TABLE_TASK, [
])


