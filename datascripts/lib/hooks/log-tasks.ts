import { NWHook } from '../hook'
import { Task, Template } from '../task'

export class LogTasks extends NWHook {
  public onTaskProcessBegin (task: Task, template: Template) {
    this.builder.log(`running task id: ${task.id}`)
    this.builder.log(template.options)
    this.builder.log()
  }
}
