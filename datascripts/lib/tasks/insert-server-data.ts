import { INSERT_SERVER_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { ServerExportData } from '../types'

export interface ServerDataTemplate extends Template {
  id: typeof INSERT_SERVER_DATA_TASK
  options: ServerExportData
}

export class InsertServerData extends NWTask {
  static readonly id = INSERT_SERVER_DATA_TASK

  process ({ options: { data, table, database } }: ServerDataTemplate) {
    console.log(database)
    this.builder.ServerData(data, table, database)
  }
}

export interface InsertServerDataOptions extends TaskOptions {}

