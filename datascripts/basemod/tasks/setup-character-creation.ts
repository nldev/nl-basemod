import { SETUP_CHARACTER_CREATION_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupCharacterCreation extends NWTask {
  static readonly id = SETUP_CHARACTER_CREATION_TASK

  setup () {
  }
}
