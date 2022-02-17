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
])

