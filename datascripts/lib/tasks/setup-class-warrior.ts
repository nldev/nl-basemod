import { SETUP_CLASS_WARRIOR_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassWarrior extends NWTask {
  static readonly id = SETUP_CLASS_WARRIOR_TASK

  async setup () {
  }
}

export interface SetupClassWarriorOptions extends TaskOptions {
  id: typeof SETUP_CLASS_WARRIOR_TASK
}
