import { CLASS_IDS, CLASS_MASKS, CREATE_TALENT_TASK } from '../constants'
import { NWTask, TaskOptions, Template } from '../task'
import { AssetId, CharacterClass } from '../types'
import { createClassMask } from '../utils'

export interface Talent {
  id: string
  spell: AssetId
  cost: number
  class: CharacterClass[]
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
          name: 'icon',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
        },
        {
          name: 'class_mask',
          type: 'smallint',
          typeParams: {
            size: 16,
          },
        },
      ],
    })
  }

  process (template: TalentTemplate) {
    const asset = typeof template.options.spell === 'string'
       ? this.builder.Spell.get(template.options.spell).asset
       : this.builder.std.Spells.load(template.options.spell)

    this.builder.ServerData('talents', {
      id: template.options.id,
      spell: asset.ID,
      cost: template.options.cost,
      class_mask: createClassMask(...template.options.class),
      icon: asset.Icon.getPath(),
    })

    this.builder.ClientData('talents', {
      [template.options.id]: {
        spell: asset.ID,
        cost: template.options.cost,
        class_mask: createClassMask(...template.options.class),
        icon: asset.Icon.getPath(),
      }
    })
  }
}

