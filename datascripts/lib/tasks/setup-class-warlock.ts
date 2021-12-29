import { SETUP_CLASS_WARLOCK_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassWarlock extends NWTask {
  static readonly id = SETUP_CLASS_WARLOCK_TASK

  async setup () {
  }
}

export interface SetupClassWarlockOptions extends TaskOptions {
  id: typeof SETUP_CLASS_WARLOCK_TASK
}
