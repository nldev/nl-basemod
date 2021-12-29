import { Builder } from './'
import { NWEntity } from './entity'
import { BaseState, Readable } from './state'
import { Data } from './types'

export interface Task<O = any, K extends string = string> {
  id: string
  setup: () => Promise<void>
  load: () => Promise<Template[]>
  process: (template: Template<O, K>) => Promise<void>
}

export interface Template<O = any, K extends string = string> {
  id: K
  options: O
}

export interface Attempt {
  template: Template
  task: NWTask
  fn: () => Promise<void>
}

export interface TaskConstructor<O extends Data = Data> {
  readonly id: string
  new (options: TaskOptions<O>, builder: Builder): NWTask<O>
}

export function createTemplates <T>(id: string, options: T[]) {
  return options.map(o => ({
    id,
    options: o,
  }))
}

export interface TaskOptions<O extends Data = Data> {
  id: string
  options: O
  isReducer?: boolean
}

export abstract class NWTask<O extends Data = Data> extends NWEntity implements Task {
  public static readonly id: string

  public readonly isReducer: boolean

  protected options: O

  constructor (
    options: TaskOptions<O>,
    protected readonly builder: Builder,
  ) {
    super(options.id)

    this.options = options.options

    this.isReducer = !!options.isReducer
  }

  public async setup () {}

  public async load () { return ([] as Template[]) }

  public async process (template: Template) {}
}

export class TaskState extends BaseState<NWTask> implements Readable<NWTask> {
  public async process<T extends Template> (template: T) {
    for (let task of this.list)
      if (task.isReducer || (template.id === task.id))
        await task.process(template)
  }
}
