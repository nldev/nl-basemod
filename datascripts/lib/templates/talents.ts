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
])

