import { CREATE_NPC_TASK } from '../constants'
import { NpcOptions } from '../npc'
import { createTemplates } from '../task'

export const NPCS = createTemplates<NpcOptions>(CREATE_NPC_TASK, [
])
