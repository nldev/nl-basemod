import { CREATE_TABLE_TASK } from '../constants'
import { TableTemplate } from '../tasks/create-table'
import { createTemplates } from '../task'

export const TABLES = createTemplates<TableTemplate>(CREATE_TABLE_TASK, [
])

