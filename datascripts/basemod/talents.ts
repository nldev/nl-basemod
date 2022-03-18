import { std } from 'wow/wotlk'
import { Task } from '.'
import { ClassMask, TitleCaseToDashCase } from './utils'
import { CharacterClass, ClassMap } from './types'

export interface Talent {
  id: string
  isActive: boolean
  // FIXME make string
  spellId: number
  cost: number
  class: ClassMap | CharacterClass
}

export type TalentOptions = {
  id?: string
  isActive?: boolean
  // FIXME make string
  spellId: number
  cost: number
  class: ClassMap | CharacterClass
}

export interface CreateTalentConfig {}

export const CreateTalent: Task<Talent, CreateTalentConfig> = {
  id: 'create-talent',
  identify: ($, config, options) => {
    if (!config.data.spellId)
      throw new Error('create-talent templates require a spellId to automatically assign ID')

    return `talent-${TitleCaseToDashCase(std.Spells.load(config.data.spellId).Name.enGB.get())}`
  },
  setup: ($, config) => {
    std.DBC.Talent.queryAll({}).forEach(t => t.delete())
    std.DBC.Talent.queryAll({}).forEach(talent => {
      talent.PrereqRank.set([0, 0, 0, 0, 0, 0, 0, 0])
      talent.Flags.set(0)
      talent.RequiredSpellID.set(0)
      talent.TierID.set(0)
      talent.ColumnIndex.set(0)
      talent.PrereqTalent.set([0, 0, 0, 0, 0, 0, 0, 0, 0])
    })

    $.Table({
      name: 'player_talents',
      database: 'world',
      isPersist: true,
      columns: [
        {
          name: 'playerGuid',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isPrimaryKey: true,
          isNotNullable: true,
        },
        {
          name: 'used',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
        {
          name: 'max',
          type: 'mediumint',
          typeParams: {
            size: 16,
          },
          isNotNullable: true,
        },
      ],
    })

    $.Table({
      name: 'talent_instances',
      database: 'world',
      isPersist: true,
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

    $.Table({
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
  },
  process: ($, template, config) => {
    const item: Talent = {
      isActive: template.data.isActive || false,
      id: template.id,
      spellId: template.data.spellId,
      cost: template.data.cost,
      class: template.data.class,
    }

    const spell = std.Spells.load(item.spellId)

    if (!item.isActive) {
      // spell.Attributes.CASTABLE_WHILE_DEAD.set(true)
      // spell.Attributes.PERSISTS_DEATH.set(true)
      // spell.Attributes.HIDE_FROM_AURA_BAR.set(true)
      // spell.Attributes.IS_PASSIVE.set(true)
      // spell.Attributes.CASTABLE_WHILE_SITTING.set(true)
      // spell.Attributes.CASTABLE_WHILE_MOUNTED.set(true)
      // spell.Attributes.NOT_BREAK_STEALTH.set(true)
      // spell.Attributes.UN_AUTOCASTABLE_BY_PET.set(true)
      // spell.Attributes.NOT_SHAPESHIFTED.set(true)
      // spell.Attributes.SHEATHE_UNCHANGED.set(true)
      // spell.Attributes.IS_HIDDEN_FROM_LOG.set(true)
      // spell.Cooldown.set(0, 0, 0)
      // spell.CastTime.set(1)
      spell.Subtext.enGB.set('Passive')
      // spell.Levels.set(0, 0, 0)
    } else {
      spell.Subtext.enGB.set('')
    }
   // FIXME move this to Spell
    spell.Attributes.IS_HIDDEN_IN_SPELLBOOK.set(0)
    spell.Rank.set(0, 0)

    const classMask = typeof item.class === 'string'
      ? ClassMask(item.class)
      : ClassMask(...(Object.keys(item.class) as any))

    $.WriteToDatabase('talents', {
      classMask,
      id: item.id,
      spellId: item.spellId,
      cost: item.cost,
      icon: spell.Icon.getPath().replace(/\\/g, '/'),
    })

    $.WriteToAddon('talents', {
      [item.id]: {
        classMask,
        id: item.id,
        name: spell.Name.enGB.get(),
        spellId: item.spellId,
        cost: item.cost,
        icon: spell.Icon.getPath().replace(/\\/g, '/'),
        class: item.class
      }
    })

    $.Set('talents', template.id, item)
  },
}
// export class CreateTalent extends NWTask {
//   static readonly id = CREATE_TALENT_TASK
//
//   setup () {
//     this.builder.dbc.Talent.queryAll({}).forEach(t => t.delete())
//     this.builder.std.DBC.Talent.queryAll({}).forEach(talent => {
//       talent.PrereqRank.set([0, 0, 0, 0, 0, 0, 0, 0])
//       talent.Flags.set(0)
//       talent.RequiredSpellID.set(0)
//       talent.TierID.set(0)
//       talent.ColumnIndex.set(0)
//       talent.PrereqTalent.set([0, 0, 0, 0, 0, 0, 0, 0, 0])
//     })
//
//     this.builder.Table({
//       name: 'player_talents',
//       database: 'world',
//       isPersist: true,
//       columns: [
//         {
//           name: 'playerGuid',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isPrimaryKey: true,
//           isNotNullable: true,
//         },
//         {
//           name: 'used',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//         {
//           name: 'max',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//       ],
//     })
//     this.builder.Table({
//       name: 'talent_instances',
//       database: 'world',
//       isPersist: true,
//       columns: [
//         {
//           name: 'entry',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isPrimaryKey: true,
//           isNotNullable: true,
//           isAutoIncrement: true,
//         },
//         {
//           name: 'playerGuid',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//         {
//           name: 'talentId',
//           type: 'mediumtext',
//           isNotNullable: true,
//         },
//         {
//           name: 'isActive',
//           type: 'bool',
//           isNotNullable: true,
//         },
//       ],
//     })
//     this.builder.Table({
//       name: 'talents',
//       database: 'world',
//       columns: [
//         {
//           name: 'entry',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isPrimaryKey: true,
//           isNotNullable: true,
//           isAutoIncrement: true,
//         },
//         {
//           name: 'id',
//           type: 'mediumtext',
//           isNotNullable: true,
//         },
//         {
//           name: 'spellId',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//         {
//           name: 'cost',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//         {
//           name: 'icon',
//           type: 'mediumtext',
//           isNotNullable: true,
//         },
//         {
//           name: 'classMask',
//           type: 'mediumint',
//           typeParams: {
//             size: 16,
//           },
//           isNotNullable: true,
//         },
//       ],
//     })
//   }
//
//   process (template: TalentTemplate) {
//     const asset = typeof template.options.spellId === 'string'
//        ? this.builder.Spell.get(template.options.id).asset
//        : this.builder.std.Spells.load(template.options.spellId)
//
//     // FIXME move this to Spell
//     asset.Subtext.enGB.set('')
//
//     const classMask = typeof template.options.class === 'string'
//       ? createClassMask(template.options.class)
//       : createClassMask(...(Object.keys(template.options.class) as any))
//
//     this.builder.ServerData('talents', {
//       classMask,
//       id: template.options.id,
//       spellId: asset.ID,
//       cost: template.options.cost,
//       icon: asset.Icon.getPath().replace(/\\/g, '/'),
//     })
//
//     this.builder.ClientData('talents', {
//       [template.options.id]: {
//         classMask,
//         id: template.options.id,
//         name: asset.Name.enGB.get(),
//         spellId: asset.ID,
//         cost: template.options.cost,
//         icon: asset.Icon.getPath().replace(/\\/g, '/'),
//         class: template.options.class
//       }
//     })
//   }
// }
