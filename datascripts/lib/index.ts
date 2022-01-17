import { std } from 'tswow-stdlib'
import { DBC, SQL } from 'wotlkdata'

import { TSAsset } from './asset'
import {
    DEFAULT_ICON_SPELL_BASE, DEFAULT_MOD, DEFAULT_MOUNT_NPC_BASE, DEFAULT_SPELL_BASE, ENV,
    QUERY_EFFECT_POINTS, QUERY_ICON, QUERY_ID, QUERY_MOUNT_NPC,
} from './constants'
import { HookConstructor, HookOptions, HookState, NWHook } from './hook'
import { LogTasks } from './hooks/log-tasks'
import { ObjectifyToJson } from './hooks/objectify-to-json'
import { ItemOptions, ItemState } from './item'
import { NpcOptions, NpcState } from './npc'
import { SpellOptions, SpellState } from './spell'
import { StoreState } from './store'
import { Attempt, NWTask, TaskConstructor, TaskOptions, TaskState, Template } from './task'
import { CreateAchievement } from './tasks/create-achievement'
import { CreateEnchant } from './tasks/create-enchant'
import { CreateGem } from './tasks/create-gem'
import { CreateItem } from './tasks/create-item'
import { CreateModifier } from './tasks/create-modifier'
import { CreateMount } from './tasks/create-mount'
import { CreateNpc } from './tasks/create-npc'
import { CreateProfession } from './tasks/create-profession'
import { CreateSpell } from './tasks/create-spell'
import { CreateStat } from './tasks/create-stat'
import { GenerateEquipment } from './tasks/generate-equipment'
import { SetupCharacterCreation } from './tasks/setup-character-creation'
import { SetupClassDruid } from './tasks/setup-class-druid'
import { SetupClassHunter } from './tasks/setup-class-hunter'
import { SetupClassMage } from './tasks/setup-class-mage'
import { SetupClassPaladin } from './tasks/setup-class-paladin'
import { SetupClassPriest } from './tasks/setup-class-priest'
import { SetupClassRogue } from './tasks/setup-class-rogue'
import { SetupClassShaman } from './tasks/setup-class-shaman'
import { SetupClassWarlock } from './tasks/setup-class-warlock'
import { SetupClassWarrior } from './tasks/setup-class-warrior'
import { SetupSkills } from './tasks/setup-skills'
import { ITEMS } from './templates/items'
import { MODIFIERS } from './templates/modifiers'
import { MOUNTS } from './templates/mounts'
import { NPCS } from './templates/npcs'
import { SPELLS } from './templates/spells'
import { STATS } from './templates/stats'
import { Data, Env, LogData, Logger, LogType, Map, Queryable, QueryType, Value } from './types'
import { noop, resolveIcon } from './utils'

// TODO: move to constants
export const PROJECT = 'basemod'
export const VERSION = '0.0.0'
export const DEFAULT_SPEED = 0.7

export const DEFAULT_OPTIONS: Required<Options> = {
  mod: DEFAULT_MOD,
  version: VERSION,
  env: ENV.DEV,
  baseSpeed: DEFAULT_SPEED,
  hooks: {},
  tasks: {
    // 'create-modifier': true,
    // 'create-mount': true,
    // 'create-npc': true,
    'create-item': true,
    'create-spell': true,
    'create-stat': false,
  },
  templates: [
    ...STATS,
    ...SPELLS,
    ...ITEMS,
    // ...NPCS,
    // ...MODIFIERS,
    // ...MOUNTS,
  ],
}

export type Json =
  | Json[]
  | { [key: string]: Json | Value }

export const defaultConfig: Required<Config> = {
  project: PROJECT,
  hooks: [
    LogTasks,
    // ObjectifyToJson,
  ],
  tasks: [
    CreateStat,
    CreateSpell,
    CreateItem,
    // CreateNpc,
    // CreateModifier,
    // CreateMount,
    // CreateAchievement,
    // CreateEnchant,
    // CreateGem,
    // CreateProfession,
    // GenerateEquipment,
    // SetupCharacterCreation,
    // SetupClassDruid,
    // SetupClassHunter,
    // SetupClassMage,
    // SetupClassPaladin,
    // SetupClassPriest,
    // SetupClassRogue,
    // SetupClassShaman,
    // SetupClassWarlock,
    // SetupClassWarrior,
    // SetupSkills,
  ],
  logger: noop,
}

export function Build (config?: Config) {
  return async (options?: Options) => {
    const $ = new Builder(config, options)

    await $.init()

    return $
  }
}

export interface Config {
  project: string
  hooks?: HookConstructor[]
  tasks?: TaskConstructor[]
  logger?: Logger
}

export interface Options {
  mod: string
  version: string
  env: Env
  baseSpeed: number
  hooks?: Map<HookOptions | boolean>
  tasks?: Map<TaskOptions | boolean>
  templates?: Template[]
}

export class Builder {
  public readonly mod: string

  public readonly std: typeof std = std
  public readonly dbc: typeof DBC = DBC
  public readonly sql: typeof SQL = SQL

  public readonly Store = new StoreState({}, this)
  public readonly Spell = new SpellState({}, this)
  public readonly Item = new ItemState({}, this)
  public readonly Npc = new NpcState({}, this)

  public readonly Hook: HookState
  public readonly Task: TaskState

  public readonly baseSpeed: number

  protected readonly spells: SpellOptions[] = []
  protected readonly items: ItemOptions[] = []
  protected readonly npcs: NpcOptions[] = []

  protected templates: Template[]

  protected readonly logger: Logger

  constructor (
    public config: Config = defaultConfig,
    public options: Options = DEFAULT_OPTIONS,
  ) {
    this.mod = options.mod || DEFAULT_OPTIONS.mod

    this.logger = config.logger || noop

    this.Hook = this.hooks(options, config)
    this.Task = this.tasks(options, config)

    this.templates = options.templates || []
    this.baseSpeed = options.baseSpeed || 1
  }

  private hooks (options: Options, config: Config) {
    return new HookState((config.hooks || []).map(
      Constructor =>
        (options && options.hooks && options.hooks[Constructor.id])
          ? new Constructor(
              typeof options.hooks[Constructor.id] === 'boolean'
                ? { id: Constructor.id, options: {} }
                : (options.hooks[Constructor.id] as HookOptions),
              this,
            )
          : null
    ).reduce((previous, current) => {
      const map: Map<NWHook> = { ...previous }

      if (current)
        map[current.id] = current

      return map
    }, {}), this)
  }

  private tasks (options: Options, config: Config) {
    return new TaskState((config.tasks || []).map(
      Constructor =>
        (options && options.tasks && options.tasks[Constructor.id])
          ? new Constructor(
              typeof options.tasks[Constructor.id] === 'boolean'
                ? { id: Constructor.id, options: {} }
                : (options.tasks[Constructor.id] as TaskOptions),
              this,
            )
          : null
    ).reduce((previous, current) => {
      const map: Map<NWTask> = { ...previous }
      if (current)
        map[current.id] = current

      return map
    }, {}), this)
  }

  private async setup () {
    for (const hook of this.Hook.list)
      await hook.setup()

    for (const task of this.Task.list)
      await task.setup()
  }

  private async load (): Promise<void> {
    for (const task of this.Task.list)
      this.templates = [
        ...this.templates,
        ...await task.load(),
      ]
  }

  private async process () {
    const attempts: Attempt[] = []

    for (const template of this.templates) for (const task of this.Task.list) {
      const attempt: Attempt = {
        template,
        task,
        fn: async () => await task.process(template),
      }

      if (task.isReducer || (template.id === task.id)) {
        // onTaskProcessBegin
        for (const hook of this.Hook.list)
          await hook.onTaskProcessBegin(task, template)

        await attempt.fn()

        // onTaskProcessSuccess
        for (const hook of this.Hook.list)
          await hook.onTaskProcessSuccess(task, template)
      }
    }

    for (const attempt of attempts) {
        const { task, template } = attempt
        await attempt.fn()

        // onTaskProcessSuccess
        for (const hook of this.Hook.list)
          await hook.onTaskProcessSuccess(task, template)
    }
  }

  public async init () {
    // onInitBegin
    for (const hook of this.Hook.list)
      await hook.onInitBegin()

    await this.setup()
    await this.load()
    await this.process()

    // OnInitSuccess
    for (const hook of this.Hook.list)
      await hook.onInitSuccess()
  }

  public query <T extends number = number>(options?: Queryable<number, QueryType>, defaultValue?: T): number
  public query <T extends string = string>(options?: Queryable<string, QueryType>, defaultValue?: T): string
  public query <T = any>(options?: Queryable<Value, QueryType>, defaultValue?: T) {
    if ((typeof options === 'string') || (typeof options === 'number'))
      return (defaultValue && !options) ? defaultValue : options

    if ((options === null) || (typeof options === 'undefined') || (typeof options === 'boolean'))
      return defaultValue ? defaultValue : null

    const { query: type, subquery: subtype, id } = options

    let result: string | number
    let asset: TSAsset = this.std.Spells.load(DEFAULT_ICON_SPELL_BASE)

    switch (type) {
      case QUERY_ICON:
        switch (subtype) {
          case 'spell':
            asset = typeof id === 'number'
              ? this.std.Spells.load(id)
              : this.Spell.get(id).asset
              break
          case 'item':
            asset = typeof id === 'number'
              ? this.std.Items.load(id)
              : this.Item.get(id).asset
              break
          case 'achievement':
            asset = typeof id === 'number'
              ? this.std.Achievements.load(id)
              : asset
              break
        }

        return resolveIcon(asset)

      case QUERY_ID:
        result = DEFAULT_SPELL_BASE

        switch (subtype) {
          case 'spell':
            result = typeof id === 'number'
              ? this.std.Spells.load(id).ID
              : this.Spell.get(id).asset.ID
              break
          case 'item':
            result = typeof id === 'number'
              ? this.std.Items.load(id).ID
              : this.Item.get(id).asset.ID
              break
          case 'npc':
            result = typeof id === 'number'
              ? this.std.CreatureTemplates.load(id).ID
              : this.Npc.get(id).asset.ID
              break
        }

        return result

      case QUERY_EFFECT_POINTS:
        result = typeof id === 'number'
          ? this.std.Spells.load(id)
            .Effects.get(subtype as number).PointsBase.get()

          : this.Spell.get(id).asset
            .Effects.get(subtype as number).PointsBase.get()

        return result

      case QUERY_MOUNT_NPC:
        result = DEFAULT_MOUNT_NPC_BASE

        switch (subtype) {
          case 'spell':

            asset = typeof id === 'number'
              ? this.std.Spells.load(id)
              : this.Spell.get(id).asset

            result = asset.Effects.get(0).MiscValueA.get()

            break
          case 'item':
            asset = typeof id === 'number'
              ? this.std.Items.load(id)
              : this.Item.get(id).asset

            result = this.std.Spells.load(asset.Spells.get(0).Spell.getRef().ID)
              .Effects.get(0).MiscValueA.get()

            break
        }

        return result
    }
  }

  public log (input: any = '', data?: LogData, type: LogType = 'log') {
    if (type === 'log')
      data ? console.log(input, data) : console.log(input)

    if (type === 'warn')
      data ? console.warn(input, data) : console.warn(input)

    if (type === 'error')
      data ? console.error(input, data) : console.error(input)

    this.logger(input, data, type)
  }

  public objectify (input: any) {
    let result: Data = {}

    if (input)
      result = input.objectify()

    return result
  }
}

