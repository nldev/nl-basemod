import { INSERT_CLIENT_DATA_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { isNil } from '../utils'

export interface ClientDataTemplate extends Template {
  id: typeof INSERT_CLIENT_DATA_TASK
  options: any
}

export class InsertClientData extends NWTask {
  static readonly id = INSERT_CLIENT_DATA_TASK

  process (template: ClientDataTemplate) {
    console.log('did a thing')
    const list: string[] = []

    for (let key of Object.keys(template.options)) {
      console.log(key)

      const value = template.options[key]

      if (isNil(value)) {
        continue
      }

      if (Array.isArray(value)) {
        continue
      }

      if (typeof value === 'object') {
        continue
      }

      if (typeof value === 'string') {
        continue
      }

      if (typeof value === 'number') {
        continue
      }

      if (typeof value === 'boolean') {
        continue
      }
    }
  }
}

export interface InsertClientDataOptions extends TaskOptions {}

