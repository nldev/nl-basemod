import { SETUP_CLASS_PALADIN_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassPaladin extends NWTask {
  static readonly id = SETUP_CLASS_PALADIN_TASK

  async setup () {
  }
}

export interface SetupClassPaladinOptions extends TaskOptions {
  id: typeof SETUP_CLASS_PALADIN_TASK
}
