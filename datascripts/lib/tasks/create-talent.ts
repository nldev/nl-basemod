import { CREATE_TALENT_TASK } from '../constants'
import { NWTask, Template } from '../task'
import { AssetId, CharacterClass, ClassMap } from '../types'
import { createClassMask } from '../utils'

export interface Talent {
  id: string
  spell: AssetId
  cost: number
  class: ClassMap | CharacterClass
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
          type: 'mediumtext',
          isPrimaryKey: true,
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
          name: 'classMask',
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

    const classMask = typeof template.options.class === 'string'
      ? createClassMask(template.options.class)
      : createClassMask(...(Object.keys(template.options.class) as any))

    this.builder.ServerData('talents', {
      classMask,
      id: template.options.id,
      spellId: asset.ID,
      cost: template.options.cost,
      icon: asset.Icon.getPath().replace(/\\/g, '/'),
    })

    this.builder.ClientData('talents', {
      [template.options.id]: {
        classMask,
        id: template.options.id,
        spellId: asset.ID,
        cost: template.options.cost,
        icon: asset.Icon.getPath().replace(/\\/g, '/'),
        class: template.options.class
      }
    })

    console.log(template)
  }
}

