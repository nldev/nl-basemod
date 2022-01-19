import { GENERATE_EQUIPMENT_TASK } from '../constants'
import { NWTask, TaskOptions } from '../task'

export class GenerateEquipment extends NWTask {
  static readonly id = GENERATE_EQUIPMENT_TASK

  setup () {
  }
}

export interface GenerateEquipmentOptions extends TaskOptions {
  id: typeof GENERATE_EQUIPMENT_TASK
}
