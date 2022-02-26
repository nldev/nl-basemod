import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { SQLTable } from '../types'

export const TABLES = createTemplates<SQLTable>(CREATE_TABLE_TASK, [
  {
    name: 'addon_data',
    columns: [
      {
        name: 'entry',
        type: 'mediumint',
        typeParams: {
          size: 16,
        },
        isPrimaryKey: true,
        isNotNullable: true,
        isAutoIncrement: true,
      },
      {
        name: 'playerGuid',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 't',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 'type',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 'key',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 'value',
        type: 'mediumtext',
        isNotNullable: true,
      },
    ],
    database: 'world',
    isPersist: true,
  },
])

