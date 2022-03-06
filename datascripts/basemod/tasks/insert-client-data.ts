import { INSERT_CLIENT_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { ExportData } from '../types'

export interface ClientDataTemplate extends Template {
  id: typeof INSERT_CLIENT_DATA_TASK
  options: ExportData
}

export class InsertClientData extends NWTask {
  static readonly id = INSERT_CLIENT_DATA_TASK

  process ({ options: { data, target } }: ClientDataTemplate) {
    this.builder.ClientData(target, data)
  }
}

