import { INSERT_CLIENT_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { ClientExportData } from '../types'

export interface ClientDataTemplate extends Template {
  id: typeof INSERT_CLIENT_DATA_TASK
  options: ClientExportData
}

export class InsertClientData extends NWTask {
  static readonly id = INSERT_CLIENT_DATA_TASK

  process ({ options: { data, module } }: ClientDataTemplate) {
    this.builder.ClientData(data, module)
  }
}

