import { CREATE_ITEM_TASK } from '../constants'
import { ItemOptions } from '../item'
import { NWTask, TaskOptions, Template } from '../task'

export interface ItemTemplate extends Template {
  id: typeof CREATE_ITEM_TASK
  options: ItemOptions
}

export class CreateItem extends NWTask {
  static readonly id = CREATE_ITEM_TASK

  process (template: ItemTemplate) {
    this.builder.Item.add(template.options)
  }
}

export interface CreateItemOptions extends TaskOptions {}

