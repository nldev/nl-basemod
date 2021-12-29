import { CREATE_PROFESSION_TASK } from '../constants'
import { Entity } from '../entity'
import { NWTask, TaskOptions, Template } from '../task'
import { Optional } from '../types'

export interface Profession extends Entity {}

export type ProfessionOptions = Optional<Profession>

export interface ProfessionTemplate extends Template {
  id: typeof CREATE_PROFESSION_TASK
  options: ProfessionOptions
}

export class CreateProfession extends NWTask {
  static readonly id = CREATE_PROFESSION_TASK

  async process (template: ProfessionTemplate) {
  }
}

export interface CreateProfessionOptions extends TaskOptions {
  id: typeof CREATE_PROFESSION_TASK
}
