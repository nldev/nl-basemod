import { SETUP_CLASS_SHAMAN_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassShaman extends NWTask {
  static readonly id = SETUP_CLASS_SHAMAN_TASK

  async setup () {
  }
}

export interface SetupClassShamanOptions extends TaskOptions {
  id: typeof SETUP_CLASS_SHAMAN_TASK
}
