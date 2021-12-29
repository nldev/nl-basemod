import { SETUP_SKILLS_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class SetupSkills extends NWTask {
  static readonly id = SETUP_SKILLS_TASK

  async setup () {
  }
}

export interface SetupSkillsOptions extends TaskOptions {
  id: typeof SETUP_SKILLS_TASK
}
