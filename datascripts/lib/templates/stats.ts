import { CREATE_STAT_TASK } from '../constants'
import { createTemplates } from '../task'
import { StatOptions } from '../tasks/create-stat'

export const STATS = createTemplates<StatOptions>(CREATE_STAT_TASK, [
  {
    type: 'HP5',
    max: 1,
  },
  // {
  //   type: 'MP5',
  //   max: 200,
  // },
  // {
  //   type: 'EP5',
  //   max: 10,
  // },
  // {
  //   type: 'RP5',
  //   max: 10,
  // },
  // {
  //   type: 'SPIRIT',
  //   max: 100,
  // },
  // {
  //   type: 'AGILITY',
  //   max: 100,
  // },
  // {
  //   type: 'STAMINA',
  //   max: 100,
  // },
  // {
  //   type: 'STRENGTH',
  //   max: 100,
  // },
  // {
  //   type: 'INTELLECT',
  //   max: 100,
  // },
  // {
  //   type: 'MOVESPEED',
  //   max: 100,
  // },
  // {
  //   type: 'SPELL-POWER',
  //   max: 200,
  // },
  // {
  //   type: 'ATTACK-POWER',
  //   max: 200,
  // },
  // {
  //   type: 'CRITICAL-STRIKE',
  //   max: 200,
  // },
  // {
  //   type: 'ARMOR-PENETRATION',
  //   max: 500,
  // },
  // {
  //   type: 'SPELL-PENETRATION',
  //   max: 100,
  // },
  // {
  //   type: 'ALL-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'ARCANE-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'ARCANE-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'ARCANE-PENETRATION',
  //   max: 200,
  // },
  // {
  //   type: 'FIRE-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'FIRE-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'FIRE-PENETRATION',
  //   max: 200,
  // },
  // {
  //   type: 'FROST-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'FROST-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'FROST-PENETRATION',
  //   max: 200,
  // },
  // {
  //   type: 'NATURE-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'NATURE-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'NATURE-PENETRATION',
  //   max: 200,
  // },
  // {
  //   type: 'SHADOW-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'SHADOW-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'SHADOW-PENETRATION',
  //   max: 200,
  // },
  // {
  //   type: 'HOLY-RESIST',
  //   max: 200,
  // },
  // {
  //   type: 'HOLY-DAMAGE',
  //   max: 200,
  // },
  // {
  //   type: 'HOLY-PENETRATION',
  //   max: 200,
  // },
])
