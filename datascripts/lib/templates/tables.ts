import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { SQLTable } from '../types'

export const TABLES = createTemplates<SQLTable>(CREATE_TABLE_TASK, [
  {
    name: 'addon-data',
    columns: [
      {
        name: 'id',
        type: 'mediumint',
        typeParams: {
          size: 32,
        },
      },
      {
        name: 'playerGuid',
        type: 'text',
        typeParams: {
          size: 32,
        },
        isPrimaryKey: true,
        isNotNullable: true,
      },
      {
        name: 't',
        type: 'text',
        typeParams: {
          size: 32,
        },
        isNotNullable: true,
      },
      {
        name: 'type',
        type: 'text',
        typeParams: {
          size: 32,
        },
        isNotNullable: true,
      },
      {
        name: 'key',
        type: 'text',
        typeParams: {
          size: 32,
        },
        isNotNullable: true,
      },
      {
        name: 'value',
        type: 'text',
        typeParams: {
          size: 500,
        },
        isNotNullable: true,
      },
    ],
    database: 'world',
    isPersist: true,
  },
])


