import { CREATE_TALENT_TASK, ROGUE } from '../constants'
import { Talent } from '../tasks/create-talent'
import { createTemplates } from '../task'

export const TALENTS = createTemplates<Talent>(CREATE_TALENT_TASK, [
  {
    id: 'improved-eviscerate',
    spell: 14164,
    cost: 100,
    class: ROGUE,
  },
])

