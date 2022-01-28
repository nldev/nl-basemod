import { INSERT_SERVER_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { ServerExportData } from '../types'

export interface ServerDataTemplate extends Template {
  id: typeof INSERT_SERVER_DATA_TASK
  options: ServerExportData
}

export class InsertServerData extends NWTask {
  static readonly id = INSERT_SERVER_DATA_TASK

  process ({ options: { target, data, database } }: ServerDataTemplate) {
    this.builder.ServerData(target, data, database)
  }
}

