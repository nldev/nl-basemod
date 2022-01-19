import { SETUP_CLASS_DRUID_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupClassDruid extends NWTask {
  static readonly id = SETUP_CLASS_DRUID_TASK

  setup () {
  }
}

export interface SetupClassDruidOptions extends TaskOptions {
  id: typeof SETUP_CLASS_DRUID_TASK
}
