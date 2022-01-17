import { CREATE_SPELL_TASK } from '../constants'
import { SpellOptions } from '../spell'
import { createTemplates } from '../task'

export const SPELLS = createTemplates<SpellOptions>(CREATE_SPELL_TASK, [
  // {
  //   name: 'Test Modifier',
  //   base: 14162,
  // },

  // {
  //   name: 'Test Modified',
  //   base: 2098,
  // },
])
