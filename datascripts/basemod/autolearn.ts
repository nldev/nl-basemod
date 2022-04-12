import { std } from 'wow/wotlk'
import { Builder } from '.'
import { ClassMask } from './utils'
import { CharacterClass } from './types'

export interface AutolearnTemplate {
  id: string
  spellId: number
  level: number
  class: CharacterClass[]
}

const templates: AutolearnTemplate[] = []

function run ($: Builder) {
  for (let template of templates) {
    const spell = std.Spells.load(template.spellId)
    if (spell.Rank.getFirstSpell() > 0)
      spell.Rank.set(spell.ID, 1)
    if (spell.Subtext.enGB.get() !== 'Passive')
      spell.Subtext.enGB.set('')

    spell.Levels.set(0, 0, 0)

    $.WriteToDatabase('autolearn', {
      id: template.id,
      spellId: template.spellId,
      level: template.level,
      classMask: ClassMask(...template.class),
    })
  }
}

function setup ($: Builder) {
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
}

export function Autolearn ($: Builder) {
  setup($)
  run($)
}

