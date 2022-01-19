import { CREATE_SUMMON_TASK } from '../constants'
import { Entity } from '../entity'
import { NWTask, TaskOptions, Template } from '../task'
import { Optional } from '../types'

export interface Summon extends Entity {}

export type SummonOptions = Optional<Summon>

export interface SummonTemplate extends Template {
  id: typeof CREATE_SUMMON_TASK
  options: SummonOptions
}

export class CreateSummon extends NWTask {
  static readonly id = CREATE_SUMMON_TASK

  process (template: SummonTemplate) {
  }
}

export interface CreateSummonOptions extends TaskOptions {
  id: typeof CREATE_SUMMON_TASK
}