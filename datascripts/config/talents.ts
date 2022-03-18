import { Task, Templates } from '../basemod'
import { TalentOptions } from '../basemod/talents'

export const TALENTS: Templates<TalentOptions> = {
  taskId: 'create-talent',
  list: [
    {
      id: 'improved-eviscerate',
      data: {
        spellId: 14164,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-gouge',
      data: {
        spellId: 13792,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'vigor',
      data: {
        spellId: 14983,
        cost: 5,
        class: { ROGUE: true },
      },
    },
    {
      id: 'shadowstep',
      data: {
        spellId: 36554,
        cost: 18,
        class: { ROGUE: true },
      },
    },
    {
      id: 'mutilate',
      data: {
        spellId: 34412,
        cost: 16,
        class: { ROGUE: true },
      },
    },
    {
      id: 'hemorrhage',
      data: {
        spellId: 17348,
        cost: 14,
        class: { ROGUE: true },
      },
    },
    {
      id: 'adrenaline-rush',
      data: {
        spellId: 13750,
        cost: 22,
        class: { ROGUE: true },
      },
    },
    {
      id: 'blade-flurry',
      data: {
        spellId: 13877,
        cost: 10,
        class: { ROGUE: true },
      },
    },
    {
      id: 'aggression',
      data: {
        spellId: 61331,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'close-quarters-combat',
      data: {
        spellId: 13807,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'fleet-footed',
      data: {
        spellId: 31209,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'ghostly-strike',
      data: {
        spellId: 14278,
        cost: 4,
        class: { ROGUE: true },
      },
    },
    {
      id: 'weapon-expertise',
      data: {
        spellId: 30920,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'waylay',
      data: {
        spellId: 51696,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'vitality',
      data: {
        spellId: 61329,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'vile-poisons',
      data: {
        spellId: 16515,
        cost: 4,
        class: { ROGUE: true },
      },
    },
    {
      id: 'unfair-advantage',
      data: {
        spellId: 51674,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'turn-the-tables',
      data: {
        spellId: 51629,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'throwing-specialization',
      data: {
        spellId: 51679,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'surprise-attacks',
      data: {
        spellId: 32601,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'sleight-of-hand',
      data: {
        spellId: 30893,
        cost: 1,
        class: { ROGUE: true },
      },
    },
    {
      id: 'slaughter-from-the-shadows',
      data: {
        spellId: 51712,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'sinister-calling',
      data: {
        spellId: 31220,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'shadow-dance',
      data: {
        spellId: 51713,
        cost: 22,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-sprint',
      data: {
        spellId: 13875,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'setup',
      data: {
        spellId: 14071,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'serrated-blades',
      data: {
        spellId: 14173,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'seal-fate',
      data: {
        spellId: 14195,
        cost: 10,
        class: { ROGUE: true },
      },
    },
    {
      id: 'savage-combat',
      data: {
        spellId: 58413,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'riposte',
      data: {
        spellId: 14251,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'remorseless-attacks',
      data: {
        spellId: 14148,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'quick-recovery',
      data: {
        spellId: 31245,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'puncturing-wounds',
      data: {
        spellId: 13866,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'pray-on-the-weak',
      data: {
        spellId: 51689,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'preparation',
      data: {
        spellId: 14185,
        cost: 24,
        class: { ROGUE: true },
      },
    },
    {
      id: 'premeditation',
      data: {
        spellId: 14183,
        cost: 5,
        class: { ROGUE: true },
      },
    },
    {
      id: 'overkill',
      data: {
        spellId: 58426,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'opportunity',
      data: {
        spellId: 14072,
        cost: 5,
        class: { ROGUE: true },
      },
    },
    {
      id: 'nerves-of-steel',
      data: {
        spellId: 31131,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'murder',
      data: {
        spellId: 14159,
        cost: 1,
        class: { ROGUE: true },
      },
    },
    {
      id: 'master-poisoner',
      data: {
        spellId: 58410,
        cost: 4,
        class: { ROGUE: true },
      },
    },
    {
      id: 'master-of-subtlety',
      data: {
        spellId: 31223,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'malice',
      data: {
        spellId: 14142,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'mace-specialization',
      data: {
        spellId: 13803,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'lightning-reflexes',
      data: {
        spellId: 13789,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'lethality',
      data: {
        spellId: 14137,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'killing-spree',
      data: {
        spellId: 51690,
        cost: 20,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-slice-and-dice',
      data: {
        spellId: 14166,
        cost: 1,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-sinister-strike',
      data: {
        spellId: 13863,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-poisons',
      data: {
        spellId: 14117,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-kidney-shot',
      data: {
        spellId: 14176,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-kick',
      data: {
        spellId: 13867,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-expose-armor',
      data: {
        spellId: 14169,
        cost: 1,
        class: { ROGUE: true },
      },
    },
    {
      id: 'improved-ambush',
      data: {
        spellId: 14080,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'hunger-for-blood',
      data: {
        spellId: 51662,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'honor-among-thieves',
      data: {
        spellId: 51701,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'hack-and-slash',
      data: {
        spellId: 13964,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'focused-attacks',
      data: {
        spellId: 51636,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'find-weakness',
      data: {
        spellId: 31236,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'filthy-tricks',
      data: {
        spellId: 58415,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'enveloping-shadows',
      data: {
        spellId: 31213,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'endurance',
      data: {
        spellId: 13872,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'elusiveness',
      data: {
        spellId: 14066,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'dual-wield-specialization',
      data: {
        spellId: 13852,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'deflection',
      data: {
        spellId: 13854,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'deadly-brew',
      data: {
        spellId: 51626,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'deadliness',
      data: {
        spellId: 30906,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'deadened-nerves',
      data: {
        spellId: 31383,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'cut-to-the-chase',
      data: {
        spellId: 51669,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'combat-potency',
      data: {
        spellId: 35553,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'cold-blood',
      data: {
        spellId: 14177,
        cost: 16,
        class: { ROGUE: true },
      },
    },
    {
      id: 'cheat-death',
      data: {
        spellId: 31230,
        cost: 6,
        class: { ROGUE: true },
      },
    },
    {
      id: 'blood-splatter',
      data: {
        spellId: 51633,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'blade-twisting',
      data: {
        spellId: 31126,
        cost: 2,
        class: { ROGUE: true },
      },
    },
    {
      id: 'cloak-of-shadows',
      data: {
        spellId: 31224,
        cost: 20,
        class: { ROGUE: true },
      },
    },
    {
      id: 'tricks-of-the-trade',
      data: {
        spellId: 57934,
        cost: 3,
        class: { ROGUE: true },
      },
    },
    {
      id: 'fan-of-knives',
      data: {
        spellId: 51723,
        cost: 8,
        class: { ROGUE: true },
      },
    },
    {
      id: 'envenom',
      data: {
        spellId: 57993,
        cost: 5,
        class: { ROGUE: true },
      },
    },
    {
      id: 'dismantle',
      data: {
        spellId: 51722,
        cost: 5,
        class: { ROGUE: true },
      },
    },
    {
      id: 'ruthlessness',
      data: {
        spellId: 14161,
        cost: 3,
        class: { ROGUE: true },
      },
    },
  ],
}

