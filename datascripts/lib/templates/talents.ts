import { CREATE_TALENT_TASK, ROGUE } from '../constants'
import { Talent } from '../tasks/create-talent'
import { createTemplates } from '../task'

export const TALENTS = createTemplates<Talent>(CREATE_TALENT_TASK, [
  {
    id: 'improved-eviscerate',
    spellId: 14164,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-gouge',
    spellId: 13792,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'vigor',
    spellId: 14983,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'shadowstep',
    spellId: 36554,
    cost: 30,
    class: { ROGUE: true },
  },
  {
    id: 'mutilate',
    spellId: 34412,
    cost: 20,
    class: { ROGUE: true },
  },
  {
    id: 'hemorrhage',
    spellId: 17348,
    cost: 20,
    class: { ROGUE: true },
  },
  {
    id: 'adrenaline-rush',
    spellId: 13750,
    cost: 30,
    class: { ROGUE: true },
  },
  {
    id: 'blade-flurry',
    spellId: 13877,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'aggression',
    spellId: 61331,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'close-quarters-combat',
    spellId: 13807,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'fleet-footed',
    spellId: 31209,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'ghostly-strike',
    spellId: 14278,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'weapon-expertise',
    spellId: 30920,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'waylay',
    spellId: 51696,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'vitality',
    spellId: 61329,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'vile-poisons',
    spellId: 16515,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'unfair-advantage',
    spellId: 51674,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'turn-the-tables',
    spellId: 51629,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'throwing-specialization',
    spellId: 51679,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'surprise-attacks',
    spellId: 32601,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'sleight-of-hand',
    spellId: 30893,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'slaughter-from-the-shadows',
    spellId: 51712,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'sinister-calling',
    spellId: 31220,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'shadow-dance',
    spellId: 51713,
    cost: 30,
    class: { ROGUE: true },
  },
  {
    id: 'improved-sprint',
    spellId: 13875,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'setup',
    spellId: 14071,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'serrated-blades',
    spellId: 14173,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'seal-fate',
    spellId: 14195,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'savage-combat',
    spellId: 58413,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'ruthlessness',
    spellId: 14161,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'riposte',
    spellId: 14251,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'remorseless-attacks',
    spellId: 14148,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'relentless-strikes',
    spellId: 58425,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'quick-recovery',
    spellId: 31245,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'puncturing-wounds',
    spellId: 13866,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'pray-on-the-weak',
    spellId: 51689,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'preparation',
    spellId: 14185,
    cost: 30,
    class: { ROGUE: true },
  },
  {
    id: 'premeditation',
    spellId: 14183,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'overkill',
    spellId: 58426,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'opportunity',
    spellId: 14072,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'nerves-of-steel',
    spellId: 31131,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'murder',
    spellId: 14159,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'master-poisoner',
    spellId: 58410,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'master-of-subtlety',
    spellId: 31223,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'malice',
    spellId: 14142,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'mace-specialization',
    spellId: 13803,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'lightning-reflexes',
    spellId: 13789,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'lethality',
    spellId: 14137,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'killing-spree',
    spellId: 51690,
    cost: 30,
    class: { ROGUE: true },
  },
  {
    id: 'improved-slice-and-dice',
    spellId: 14166,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-sinister-strike',
    spellId: 13863,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-poisons',
    spellId: 14117,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-kidney-shot',
    spellId: 14176,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-kick',
    spellId: 13867,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'improved-expose-armor',
    spellId: 14169,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'improved-ambush',
    spellId: 14080,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'hunger-for-blood',
    spellId: 51662,
    cost: 15,
    class: { ROGUE: true },
  },
  {
    id: 'honor-among-thieves',
    spellId: 51701,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'hack-and-slash',
    spellId: 13964,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'focused-attacks',
    spellId: 51636,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'find-weakness',
    spellId: 31236,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'filthy-tricks',
    spellId: 58415,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'enveloping-shadows',
    spellId: 31213,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'endurance',
    spellId: 13872,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'elusiveness',
    spellId: 14066,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'dual-wield-specialization',
    spellId: 13852,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'deflection',
    spellId: 13854,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'deadly-brew',
    spellId: 51626,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'deadliness',
    spellId: 30906,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'deadened-nerves',
    spellId: 31383,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'cut-to-the-chase',
    spellId: 51669,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'combat-potency',
    spellId: 35553,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'cold-blood',
    spellId: 14177,
    cost: 20,
    class: { ROGUE: true },
  },
  {
    id: 'cheat-death',
    spellId: 31230,
    cost: 10,
    class: { ROGUE: true },
  },
  {
    id: 'blood-splatter',
    spellId: 51633,
    cost: 5,
    class: { ROGUE: true },
  },
  {
    id: 'blade-twisting',
    spellId: 31126,
    cost: 5,
    class: { ROGUE: true },
  },
])

