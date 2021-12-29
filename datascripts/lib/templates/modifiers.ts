import { CREATE_MODIFIER_TASK } from '../constants'
import { createTemplates } from '../task'
import { ModifierOptions } from '../tasks/create-modifier'

export const MODIFIERS = createTemplates<ModifierOptions>(CREATE_MODIFIER_TASK, [
  {
    modifier: 'test-modifier',
    modified: 'test-modified',
    effect: 1,
  },
])
