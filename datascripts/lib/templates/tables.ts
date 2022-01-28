import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { SQLTable } from '../types'

export const TABLES = createTemplates<SQLTable>(CREATE_TABLE_TASK, [
])


