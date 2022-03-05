import { CREATE_AUTOLEARN_TASK } from '../constants'
import { NWTask, Template } from '../task'
import { AssetId, CharacterClass } from '../types'
import { createClassMask } from '../utils'

export interface Autolearn {
  id: string
  spellId: AssetId
  level: number
  class: CharacterClass[]
}

export interface AutolearnTemplate extends Template {
  id: typeof CREATE_AUTOLEARN_TASK
  options: Autolearn
}

export class CreateAutolearn extends NWTask {
  static readonly id = CREATE_AUTOLEARN_TASK

  setup () {
    this.builder.Table({
      name: 'autolearn',
      database: 'world',
      isPersist: true,
      columns: [
        {
          name: 'entry',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isAutoIncrement: true,
          isPrimaryKey: true,
          isNotNullable: true,
        },
        {
          name: 'id',
          type: 'mediumtext',
          isNotNullable: true,
        },
        {
          name: 'spellId',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'classMask',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'level',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
      ],
    })
  }

  process (template: AutolearnTemplate) {
    this.builder.ServerData('autolearn', {
      id: template.options.id,
      spellId: template.options.spellId,
      level: template.options.level,
      classMask: createClassMask(...template.options.class),
    })
  }
}

