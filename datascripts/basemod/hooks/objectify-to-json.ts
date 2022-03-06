import { NWHook } from '../hook'
import { Task, Template } from '../task'

export class ObjectifyToJson extends NWHook {
  public onTaskProcessBegin (task: Task, template: Template) {
  }
}
