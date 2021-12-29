import { CREATE_STAT_TASK } from '../constants'
import { createTemplates } from '../task'
import { StatOptions } from '../tasks/create-stat'

export const STATS = createTemplates<StatOptions>(CREATE_STAT_TASK, [
  {
    type: 'spell-pen',
    max: 100,
  },

  {
    type: 'hp5',
    max: 100,
  },

  {
    type: 'movespeed',
    max: 100,
  },

  {
    type: 'spell-dmg',
    school: 'fire',
    max: 200,
  },

  {
    type: 'spell-dmg',
    school: 'frost',
    max: 200,
  },

  {
    type: 'spell-dmg',
    school: 'nature',
    max: 200,
  },

  {
    type: 'spell-dmg',
    school: 'shadow',
    max: 200,
  },

  {
    type: 'spell-dmg',
    school: 'holy',
    max: 200,
  },

  {
    type: 'spell-dmg',
    school: 'arcane',
    max: 200,
  },
])
