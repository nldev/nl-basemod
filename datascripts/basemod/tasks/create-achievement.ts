import { CREATE_ACHIEVEMENT_TASK } from '../constants'
import { Entity } from '../entity'
import { NWTask, TaskOptions, Template } from '../task'
import { Optional } from '../types'

export interface Achievement extends Entity {}

export type AchievementOptions = Optional<Achievement>

export interface AchievementTemplate extends Template {
  id: typeof CREATE_ACHIEVEMENT_TASK
  options: AchievementOptions
}

export class CreateAchievement extends NWTask {
  static readonly id = CREATE_ACHIEVEMENT_TASK

  process (template: AchievementTemplate) {
  }
}

