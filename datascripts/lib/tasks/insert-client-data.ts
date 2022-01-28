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
      const prefix = `const ${key} = `

      if (isNil(value)) {
        list.push(`const ${key} = null`)
        continue
      }

      if (Array.isArray(value)) {
        list.push(prefix + JSON.stringify(value))
        continue
      }

      if (typeof value === 'object') {
        list.push(prefix + JSON.stringify(value))
        continue
      }

      if (typeof value === 'string') {
        list.push(prefix + `\`${value}\``)
        continue
      }

      if (typeof value === 'number') {
        list.push(prefix + value)
        continue
      }

      if (typeof value === 'boolean') {
        list.push(
          value
            ? prefix + 'true'
            : prefix + 'false'
        )
        continue
      }
    }
  }
}

export interface InsertClientDataOptions extends TaskOptions {}

