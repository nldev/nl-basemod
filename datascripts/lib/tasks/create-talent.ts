import { CREATE_TALENT_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { AssetId, CharacterClass } from '../types'

export interface Talent {
  id: string
  spell: AssetId
  cost: number
  class: CharacterClass
}

export interface TalentTemplate extends Template {
  id: typeof CREATE_TALENT_TASK
  options: Talent
}

export class CreateTalent extends NWTask {
  static readonly id = CREATE_TALENT_TASK

  setup () {
    this.builder.Table({
      name: 'talents',
      database: 'world',
      columns: [
        {
          name: 'id',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
        },
        {
          name: 'spell_id',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
        },
        {
          name: 'cost',
          type: 'smallint',
          typeParams: {
            size: 8,
          },
        },
        {
          name: 'class',
          type: 'smallint',
          typeParams: {
            size: 8,
          },
        },
      ],
    })
  }

  process (template: TalentTemplate) {
    if (typeof template.options.spell === 'number') {
      const spell = this.builder.std.Spells.load(template.options.spell)
    }
  }
}

