import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { TableOptions } from '../types'

export const TABLES = createTemplates<TableOptions>(CREATE_TABLE_TASK, [
])


