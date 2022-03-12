import { CREATE_TABLE_TASK } from '../constants'
import { createTemplates } from '../task'
import { SQLTable } from '../types'

export const TABLES = createTemplates<SQLTable>(CREATE_TABLE_TASK, [
  {
    name: 'store',
    database: 'world',
    isPersist: true,
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
        name: 'guid',
        type: 'mediumint',
        typeParams: {
          size: 16,
        },
        isNotNullable: true,
      },
      {
        name: 'primitive',
        type: 'mediumint',
        typeParams: {
          size: 8,
        },
        isNotNullable: true,
      },
      {
        name: 'type',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 'storeKey',
        type: 'mediumtext',
        isNotNullable: true,
      },
      {
        name: 'storeValue',
        type: 'mediumtext',
        isNotNullable: true,
      },
    ],
  },
])

