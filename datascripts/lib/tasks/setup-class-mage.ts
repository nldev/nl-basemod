import { SETUP_CLASS_MAGE_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassMage extends NWTask {
  static readonly id = SETUP_CLASS_MAGE_TASK

  setup () {
  }
}

export interface SetupClassMageOptions extends TaskOptions {
  id: typeof SETUP_CLASS_MAGE_TASK
}
