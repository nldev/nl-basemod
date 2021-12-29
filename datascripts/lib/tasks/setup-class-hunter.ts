import { SETUP_CLASS_HUNTER_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassHunter extends NWTask {
  static readonly id = SETUP_CLASS_HUNTER_TASK

  async setup () {
  }
}

export interface SetupClassHunterOptions extends TaskOptions {
  id: typeof SETUP_CLASS_HUNTER_TASK
}
