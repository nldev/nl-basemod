import { CREATE_TALENT_TASK } from '../constants'
import { NWTask, Template } from '../task'
import { AssetId, CharacterClass, ClassMap } from '../types'
import { createClassMask } from '../utils'

export interface Talent {
  id: string
  spellId: AssetId
  cost: number
  class: ClassMap | CharacterClass
}

export interface TalentTemplate extends Template {
  id: typeof CREATE_TALENT_TASK
  options: Talent
}

export class CreateTalent extends NWTask {
  static readonly id = CREATE_TALENT_TASK

  // playerId
  // talentId
  // isActive
  setup () {
    this.builder.Table({
      name: 'talent_instances',
      database: 'world',
      columns: [
        {
          name: 'entry',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isPrimaryKey: true,
          isNotNullable: true,
          isAutoIncrement: true,
        },
        {
          name: 'playerGuid',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'talentId',
          type: 'mediumtext',
          isNotNullable: true,
        },
        {
          name: 'isActive',
          type: 'bool',
          isNotNullable: true,
        },
      ],
    })
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
          isPrimaryKey: true,
          isNotNullable: true,
          isAutoIncrement: true,
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
    const asset = typeof template.options.spellId === 'string'
       ? this.builder.Spell.get(template.options.id).asset
       : this.builder.std.Spells.load(template.options.spellId)

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
        name: asset.Name.enGB.get(),
        spellId: asset.ID,
        cost: template.options.cost,
        icon: asset.Icon.getPath().replace(/\\/g, '/'),
        class: template.options.class
      }
    })

    console.log(template)
  }
}

