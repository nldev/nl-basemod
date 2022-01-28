import { INSERT_SERVER_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { ExportData } from '../types'

export interface ServerDataTemplate extends Template {
  id: typeof INSERT_SERVER_DATA_TASK
  options: ExportData
}

export class InsertServerData extends NWTask {
  static readonly id = INSERT_SERVER_DATA_TASK

  process (template: ServerDataTemplate) {
  }
}

export interface InsertServerDataOptions extends TaskOptions {}

