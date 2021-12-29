import { SETUP_CLASS_ROGUE_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassRogue extends NWTask {
  static readonly id = SETUP_CLASS_ROGUE_TASK

  async setup () {
  }
}

export interface SetupClassRogueOptions extends TaskOptions {
  id: typeof SETUP_CLASS_ROGUE_TASK
}
