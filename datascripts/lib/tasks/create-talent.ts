
import { CREATE_TALENT_TASK } from '../constants'
import { ItemOptions } from '../item'
import { NWTask, TaskOptions, Template } from '../task'
import { AssetId } from '../types'

export interface Talent {
  id: string
  spell: AssetId
  cost: number
}

export type TalentOptions = Partial<Talent>

export interface TalentTemplate extends Template {
  id: typeof CREATE_TALENT_TASK
  options: TalentOptions
}

export class CreateTalent extends NWTask {
  static readonly id = CREATE_TALENT_TASK

  process (template: TalentTemplate) {
    console.log(template)
  }
}

export interface CreateTalentOptions extends TaskOptions {}

