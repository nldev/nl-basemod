import { std } from 'wow/wotlk'
import { Builder } from '.'
import { ClassMask } from './utils'
import { CharacterClass } from './types'
import { ALL_CLASSES } from './constants'

export interface AutolearnTemplate {
  id: string
  spellId: number
  level: number
  class: CharacterClass[]
}

const TEMPLATES: AutolearnTemplate[] = [
  {
    id: 'recall',
    spellId: 8690,
    level: 1,
    class: ALL_CLASSES,
  },
  {
    id: 'stealth',
    spellId: 1784,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'ambush',
    spellId: 11267,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'sinister-strike',
    spellId: 11294,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'backstab',
    spellId: 25300,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'eviscerate',
    spellId: 11299,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'gouge',
    spellId: 1776,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'pick-pocket',
    spellId: 921,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'crippling-poison',
    spellId: 3408,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'safe-fall',
    spellId: 1860,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'glyph-of-safe-fall',
    spellId: 58033,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'disarm-trap',
    spellId: 1842,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'detect-traps',
    spellId: 2836,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'master-of-deception',
    spellId: 13971,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'camouflage',
    spellId: 14963,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'dirty-tricks',
    spellId: 14094,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'initiative',
    spellId: 13890,
    level: 1,
    class: ['ROGUE'],
  },
  {
    id: 'cheap-shot',
    spellId: 1833,
    level: 2,
    class: ['ROGUE'],
  },
  {
    id: 'kidney-shot',
    spellId: 8643,
    level: 3,
    class: ['ROGUE'],
  },
  {
    id: 'shiv',
    spellId: 5938,
    level: 4,
    class: ['ROGUE'],
  },
  {
    id: 'vanish',
    spellId: 1857,
    level: 5,
    class: ['ROGUE'],
  },
  {
    id: 'sap',
    spellId: 51724,
    level: 6,
    class: ['ROGUE'],
  },
  {
    id: 'sprint',
    spellId: 11305,
    level: 7,
    class: ['ROGUE'],
  },
  {
    id: 'evasion',
    spellId: 26669,
    level: 8,
    class: ['ROGUE'],
  },
  {
    id: 'distract',
    spellId: 1725,
    level: 9,
    class: ['ROGUE'],
  },
  {
    id: 'kick',
    spellId: 1766,
    level: 10,
    class: ['ROGUE'],
  },
  {
    id: 'rupture',
    spellId: 11274,
    level: 11,
    class: ['ROGUE'],
  },
  {
    id: 'garrote',
    spellId: 11290,
    level: 12,
    class: ['ROGUE'],
  },
  {
    id: 'blind',
    spellId: 2094,
    level: 13,
    class: ['ROGUE'],
  },
  {
    id: 'feint',
    spellId: 25302,
    level: 14,
    class: ['ROGUE'],
  },
  {
    id: 'slice-and-dice',
    spellId: 6774,
    level: 14,
    class: ['ROGUE'],
  },
  {
    id: 'expose-armor',
    spellId: 8647,
    level: 15,
    class: ['ROGUE'],
  },
  {
    id: 'deadly-poison',
    spellId: 25351,
    level: 16,
    class: ['ROGUE'],
  },
  {
    id: 'instant-poison',
    spellId: 11339,
    level: 17,
    class: ['ROGUE'],
  },
  {
    id: 'mind-numbing-poison',
    spellId: 5761,
    level: 17,
    class: ['ROGUE'],
  },
  {
    id: 'wound-poison',
    spellId: 13227,
    level: 18,
    class: ['ROGUE'],
  },
  {
    id: 'anesthetic-poison',
    spellId: 26785,
    level: 19,
    class: ['ROGUE'],
  },
  {
    id: 'deadly-throw',
    spellId: 26679,
    level: 19,
    class: ['ROGUE'],
  },
]

function run ($: Builder) {
  for (let template of TEMPLATES) {
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

