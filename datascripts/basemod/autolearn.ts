import { std } from 'wow/wotlk'
import { Builder } from '.'
import { ClassMask, Dashify } from './utils'
import { CharacterClass } from './types'

export interface Autolearn {
  spellId: number
  level: number
  class: CharacterClass[]
}

export interface CreateAutolearnConfig {}


export const Autolearn = ($: Builder) => {
}

export const CreateAutolearn: Task<Autolearn, CreateAutolearnConfig> = {
  id: 'create-autolearn',
  identify: ($, config, options) => {
    if (!config.data.spellId)
      throw new Error('create-autolearn templates require a spellId to automatically assign ID')

    return `autolearn-${TitleCaseToDashCase(std.Spells.load(config.data.spellId).Name.enGB.get())}`
  },
  setup: ($, config) => {
    $.Table({
      name: 'autolearn',
      database: 'world',
      isPersist: false,
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
  },
  process: ($, template, config) => {
    // FIXME: move to spell transforms
    const spell = std.Spells.load(template.data.spellId)
    // spell.Rank.set(0, 0)
    if (spell.Rank.getFirstSpell() > 0)
      spell.Rank.set(spell.ID, 1)
    if (spell.Subtext.enGB.get() !== 'Passive')
      spell.Subtext.enGB.set('')

    spell.Levels.set(0, 0, 0)

    $.Set('autolearn', template.id, template)

    $.WriteToDatabase('autolearn', {
      id: template.id,
      spellId: template.data.spellId,
      level: template.data.level,
      classMask: ClassMask(...template.data.class),
    })
  },
}

