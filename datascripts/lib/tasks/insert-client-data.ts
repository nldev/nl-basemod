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
    const list: string[] = []

    for (let key of Object.keys(template.options)) {
      const value = template.options[key]
      const prefix = `export const ${key} = `

      list.push(prefix + JSON.stringify(value))
    }

    const data = list.join('\n')
    console.log(data)
  }
}

export interface InsertClientDataOptions extends TaskOptions {}

