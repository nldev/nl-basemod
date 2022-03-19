import { Templates } from '../basemod'
import { SQLTable } from '../basemod/types'

export const TABLES: Templates<SQLTable> = {
  taskId: 'create-table',
  list: [
    {
      id: 'store-table',
      data: {
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
              size: 16,
            },
            isNotNullable: true,
          },
          {
            name: 'type',
            type: 'mediumint',
            typeParams: {
              size: 16,
            },
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
    },
  ],
}