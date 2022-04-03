import { std } from 'wow/wotlk'
import { Task } from '.'
import { ClassMask, TitleCaseToDashCase } from './utils'
import { CharacterClass, ClassMap } from './types'
import { Spell } from 'wow/wotlk/std/Spell/Spell'

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
  spellId: string | number
  cost: number
  class: ClassMap | CharacterClass
}

export interface CreateTalentConfig {}

export const CreateTalent: Task<Talent, CreateTalentConfig> = {
  id: 'create-talent',
  identify: ($, template, options) => {
    if (!template.data.spellId)
      throw new Error('create-talent templates require a spellId to automatically assign ID')

    const spellId = typeof template.data.spellId === 'number'
      ? `talent-${TitleCaseToDashCase(std.Spells.load(template.data.spellId).Name.enGB.get())}`
      : `talent-${template.data.spellId}`

    return spellId
  },
  setup: ($, config) => {
    // std.DBC.Talent.queryAll({}).forEach(t => t.delete())
    std.DBC.Talent.queryAll({}).forEach(talent => {
      talent.PrereqRank.set([0, 0, 0, 0, 0, 0, 0, 0])
      // talent.Flags.set(0)
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
    const spell = typeof template.data.spellId === 'number'
      ? std.Spells.load(template.data.spellId)
      : $.Get(`spells.${template.data.spellId}`).asset as Spell

    const item: Talent = {
      spellId: spell.ID,
      isActive: template.data.isActive || false,
      id: template.id,
      cost: template.data.cost,
      class: template.data.class,
    }
    //const spell = std.Spells.load(spellId)

    if (!item.isActive) {
      // spell.Attributes.CASTABLE_WHILE_DEAD.set(true)
      // spell.Attributes.PERSISTS_DEATH.set(true)
      // spell.Attributes.HIDE_FROM_AURA_BAR.set(true)
      spell.Attributes.IS_PASSIVE.set(true)
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
    // spell.Attributes.IS_HIDDEN_IN_SPELLBOOK.set(0)
    if (spell.Rank.getFirstSpell() > 0)
      spell.Rank.set(spell.ID, 1)

    spell.Levels.set(0, 0, 0)

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

