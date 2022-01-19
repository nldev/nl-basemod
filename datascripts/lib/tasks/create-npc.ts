import { CREATE_NPC_TASK } from '../constants'
import { NpcOptions } from '../npc'
import { NWTask, TaskOptions, Template } from '../task'

export interface NpcTemplate extends Template {
  id: typeof CREATE_NPC_TASK
  options: NpcOptions
}

export class CreateNpc extends NWTask {
  static readonly id = CREATE_NPC_TASK

  process (template: NpcTemplate) {
    this.builder.Npc.add(template.options)
  }
}

export interface CreateNpcOptions extends TaskOptions {}
