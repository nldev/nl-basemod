import { CREATE_TALENT_TASK } from '../constants'
import { ItemOptions } from '../item'
import { NWTask, TaskOptions, Template } from '../task'
import { AssetId, Optional, CharacterClass } from '../types'

export interface Talent {
  id: string
  spell: AssetId
  cost: number
  class: CharacterClass
}

export interface TalentTemplate extends Template {
  id: typeof CREATE_TALENT_TASK
  options: Talent
}

export class CreateTalent extends NWTask {
  static readonly id = CREATE_TALENT_TASK

  process (template: TalentTemplate) {
    console.log(template)
  }
}

export interface CreateTalentOptions extends TaskOptions {}

