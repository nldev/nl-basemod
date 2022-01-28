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
          name: 'talent_id',
          type: 'mediumtext',
          isNotNullable: true,
        },
        {
          name: 'spell_id',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'cost',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'icon',
          type: 'mediumtext',
          isNotNullable: true,
        },
        {
          name: 'class_mask',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
      ],
    })
  }

  process (template: TalentTemplate) {
    const asset = typeof template.options.spell === 'string'
       ? this.builder.Spell.get(template.options.spell).asset
       : this.builder.std.Spells.load(template.options.spell)

    this.builder.ServerData('talents', {
      talent_id: template.options.id,
      spell_id: asset.ID,
      cost: template.options.cost,
      icon: asset.Icon.getPath().replace(/\\/g, '/'),
      class_mask: createClassMask(...template.options.class),
    })

    this.builder.ClientData('talents', {
      [template.options.id]: {
        talent_id: template.options.id,
        spell_id: asset.ID,
        cost: template.options.cost,
        icon: asset.Icon.getPath().replace(/\\/g, '/'),
        class_mask: createClassMask(...template.options.class),
      }
    })

    console.log(template)
  }
}

