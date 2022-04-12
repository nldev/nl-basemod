import { std } from 'wow/wotlk'
import { ClassMask } from './utils'
import { CharacterClass, ClassMap } from './types'
import { Spell } from 'wow/wotlk/std/Spell/Spell'
import $ from '.'

interface Template {
  id: string
  spellId: number
  cost: number
  class: ClassMap | CharacterClass
  isActive?: boolean
}

const TEMPLATES: Template[] = [
  {
    id: 'improved-eviscerate',
    spellId: 14164,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'improved-gouge',
    spellId: 13792,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'vigor',
    spellId: 14983,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'shadowstep',
    isActive: true,
    spellId: 36554,
    cost: 18,
    class: { ROGUE: true },
  },
  {
    id: 'mutilate',
    isActive: true,
    spellId: 34412,
    cost: 16,
    class: { ROGUE: true },
  },
  {
    id: 'hemorrhage',
    isActive: true,
    spellId: 17348,
    cost: 14,
    class: { ROGUE: true },
  },
  {
    id: 'adrenaline-rush',
    isActive: true,
    spellId: 13750,
    cost: 22,
    class: { ROGUE: true },
  },
  {
    id: 'blade-flurry',
    isActive: true,
    spellId: 13877,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'aggression',
    spellId: 61331,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'close-quarters-combat',
    spellId: 13807,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'fleet-footed',
    spellId: 31209,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'ghostly-strike',
    isActive: true,
    spellId: 14278,
    cost: 4,
    class: { ROGUE: true },
  },
  {
    id: 'weapon-expertise',
    spellId: 30920,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'waylay',
    spellId: 51696,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'vitality',
    spellId: 61329,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'vile-poisons',
    spellId: 16515,
    cost: 4,
    class: { ROGUE: true },
  },
  {
    id: 'unfair-advantage',
    spellId: 51674,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'turn-the-tables',
    spellId: 51629,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'throwing-specialization',
    spellId: 51679,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'surprise-attacks',
    spellId: 32601,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'sleight-of-hand',
    spellId: 30893,
    cost: 1,
    class: { ROGUE: true },
  },
  {
    id: 'slaughter-from-the-shadows',
    spellId: 51712,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'sinister-calling',
    spellId: 31220,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'shadow-dance',
    isActive: true,
    spellId: 51713,
    cost: 22,
    class: { ROGUE: true },
  },
  {
    id: 'improved-sprint',
    spellId: 13875,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'setup',
    spellId: 14071,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'serrated-blades',
    spellId: 14173,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'seal-fate',
    spellId: 14195,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'savage-combat',
    spellId: 58413,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'riposte',
    isActive: true,
    spellId: 14251,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'remorseless-attacks',
    spellId: 14148,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'quick-recovery',
    spellId: 31245,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'puncturing-wounds',
    spellId: 13866,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'pray-on-the-weak',
    spellId: 51689,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'preparation',
    isActive: true,
    spellId: 14185,
    cost: 24,
    class: { ROGUE: true },
  },
  {
    id: 'premeditation',
    isActive: true,
    spellId: 14183,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'overkill',
    spellId: 58426,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'opportunity',
    spellId: 14072,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'nerves-of-steel',
    spellId: 31131,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'murder',
    spellId: 14159,
    cost: 1,
    class: { ROGUE: true },
  },
  {
    id: 'master-poisoner',
    spellId: 58410,
    cost: 4,
    class: { ROGUE: true },
  },
  {
    id: 'master-of-subtlety',
    spellId: 31223,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'malice',
    spellId: 14142,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'mace-specialization',
    spellId: 13803,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'lightning-reflexes',
    spellId: 13789,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'lethality',
    spellId: 14137,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'killing-spree',
    isActive: true,
    spellId: 51690,
    cost: 20,
    class: { ROGUE: true },
  },
  {
    id: 'improved-slice-and-dice',
    spellId: 14166,
    cost: 1,
    class: { ROGUE: true },
  },
  {
    id: 'improved-sinister-strike',
    spellId: 13863,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'improved-poisons',
    spellId: 14117,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'improved-kidney-shot',
    spellId: 14176,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'improved-kick',
    spellId: 13867,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'improved-expose-armor',
    spellId: 14169,
    cost: 1,
    class: { ROGUE: true },
  },
  {
    id: 'improved-ambush',
    spellId: 14080,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'hunger-for-blood',
    isActive: true,
    spellId: 51662,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'honor-among-thieves',
    spellId: 51701,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'hack-and-slash',
    spellId: 13964,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'focused-attacks',
    spellId: 51636,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'find-weakness',
    spellId: 31236,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'filthy-tricks',
    spellId: 58415,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'enveloping-shadows',
    spellId: 31213,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'endurance',
    spellId: 13872,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'elusiveness',
    spellId: 14066,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'dual-wield-specialization',
    spellId: 13852,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'deflection',
    spellId: 13854,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'deadly-brew',
    spellId: 51626,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'deadliness',
    spellId: 30906,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'deadened-nerves',
    spellId: 31383,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'cut-to-the-chase',
    spellId: 51669,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'combat-potency',
    spellId: 35553,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'cold-blood',
    isActive: true,
    spellId: 14177,
    cost: 12,
    class: { ROGUE: true },
  },
  {
    id: 'cheat-death',
    spellId: 31230,
    cost: 6,
    class: { ROGUE: true },
  },
  {
    id: 'blood-splatter',
    spellId: 51633,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'blade-twisting',
    spellId: 31126,
    cost: 2,
    class: { ROGUE: true },
  },
  {
    id: 'cloak-of-shadows',
    isActive: true,
    spellId: 31224,
    cost: 20,
    class: { ROGUE: true },
  },
  {
    id: 'tricks-of-the-trade',
    isActive: true,
    spellId: 57934,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'fan-of-knives',
    isActive: true,
    spellId: 51723,
    cost: 8,
    class: { ROGUE: true },
  },
  {
    id: 'envenom',
    isActive: true,
    spellId: 57993,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'dismantle',
    isActive: true,
    spellId: 51722,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'ruthlessness',
    spellId: 14161,
    cost: 3,
    class: { ROGUE: true },
  },
  {
    id: 'guile',
    isActive: true,
    spellId: $.Spells['guile'].ID,
    cost: 10,
    class: { ROGUE: true },
  },
]

function run () {
  for (let template of TEMPLATES) {
    const spell = std.Spells.load(template.spellId)

    if (!template.isActive) {
      spell.Attributes.IS_PASSIVE.set(true)
      spell.Subtext.enGB.set('Passive')
    } else {
      spell.Subtext.enGB.set('')
    }

    if (spell.Rank.getFirstSpell() > 0)
      spell.Rank.set(spell.ID, 1)

    spell.Levels.set(0, 0, 0)

    const classMask = typeof template.class === 'string'
      ? ClassMask(template.class)
      : ClassMask(...(Object.keys(template.class) as any))

    $.WriteToDatabase('talents', {
      classMask,
      id: template.id,
      spellId: template.spellId,
      cost: template.cost,
      icon: spell.Icon.getPath().replace(/\\/g, '/'),
    })

    $.WriteToAddon('talents', {
      [template.id]: {
        classMask,
        id: template.id,
        name: spell.Name.enGB.get(),
        spellId: template.spellId,
        cost: template.cost,
        icon: spell.Icon.getPath().replace(/\\/g, '/'),
        class: template.class
      }
    })
  }
}

function setup () {
  std.DBC.Talent.queryAll({}).forEach(talent => {
    talent.PrereqRank.set([0, 0, 0, 0, 0, 0, 0, 0])
    // talent.Flags.set(0)
    // talent.SpellRank.set([0, 0, 0, 0, 0, 0, 0, 0])
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
}

setup()
run()

