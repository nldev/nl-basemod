import { PlayerInfo, TalentInfo, Mapping, CharacterClass, CharacterRace } from './types'
import { ROOT } from './constants'

// component
export type ElementFn = (element: Element<any, any>) => void

export interface Element<S = Mapping, F = Mapping<ElementFn>> {
  name: string
  ref: WoWAPI.Frame
  inner: WoWAPI.Frame
  parent: Element<any, any>
  state: S
  fns: F
}

export type ComponentOptions = {
  name?: string
  parent?: Element<any, any>
  // mod?: Mod | Mod[]
  inherits?: string
  type?: WoWAPI.FrameType
  state?: Mapping
  fns?: Mapping<ElementFn>
}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  S = Mapping,
  F = Mapping<ElementFn>,
> = (options?: O) => Element<S, F>

// root
export const Root = (ref?: WoWAPI.Frame): Element<any, any> => {
  const app = _G['app']
  const frame = (app.elements[ROOT] && app.elements[ROOT].ref)
    || ref

  frame.SetAllPoints(UIParent)

  const element = {
    name: ROOT,
    ref: frame,
    inner: frame,
    parent: null as Element,
    state: {},
    fns: {},
  }

  app.elements[ROOT] = element

  return element
}

export const Frame: Component = options => {
  if (!options.name)
    throw new Error('Frame requires a name')

  const app = Get()

  const parent = options.parent
  const frame: WoWAPI.Frame = (app.elements[options.name] && app.elements[options.name].ref)
    || CreateFrame(options.type || 'Frame', options.name, parent ? parent.inner : app.root.ref, options.inherits) as WoWAPI.Frame

  // if (typeof options.mod === 'function') {
  //   options.mod(frame)
  // } else if (options.mod) {
  //   options.mod.forEach(fn => {
  //     fn(frame)
  //   })
  // }

  if (options.parent)
    frame.SetParent(options.parent.inner)

  const element = {
    parent,
    name: options.name,
    ref: frame,
    inner: frame,
    state: options.state || {},
    fns: options.fns || {},
  }

  app.elements[options.name] = element

  return element
}

// store
const STORE_TYPE_ACCOUNT = 'STORE_TYPE_ACCOUNT'
const STORE_TYPE_CHARACTER = 'STORE_TYPE_CHARACTER'

export type StoreType = typeof STORE_TYPE_ACCOUNT | typeof STORE_TYPE_CHARACTER
export type StoreValue = string | number | null

export class Store {
  isLoaded = false
  state: any = {
    [STORE_TYPE_ACCOUNT]: {},
    [STORE_TYPE_CHARACTER]: {},
  }

  public Init (onInit: () => void) {
    const app = Get()

    Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
      if (prefix !== 'store-get')
        return
      if (!text)
        return

      const [t, type, key, value] = text.split(' ')

      this.state[type][key] = t === 'number'
        ? Number(value)
        : t === 'null'
        ? null
        : value
    })

    Events.ChatInfo.OnChatMsgAddon(app.root.ref, prefix => {
      if (prefix !== 'store-init-success')
        return

      this.isLoaded = true

      onInit()
    })

    SendAddonMessage('store-init', ' ', 'WHISPER', app.playerInfo.name)
  }

  public Set (type: StoreType, key: string, value: StoreValue) {
    const app = Get()

    const t = typeof value === 'number'
      ? 'number'
      : typeof value === 'string'
      ? 'string'
      : null

    this.state[type][key] = value

    SendAddonMessage('store-set', `${t} ${type} ${key} ${value}`, 'WHISPER', app.playerInfo.name)
  }

  public Get (type: StoreType, key: string) {
    return this.state[type][key]
  }
}

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isStarted: boolean = false

  public root: Element
  public playerInfo: PlayerInfo
  public talentInfo: TalentInfo
  public elements: Mapping<Element<any, any>> = {}
  public store: Store = new Store()

  constructor (public onInit: ($: App) => void) {
    this.talentInfo = {
      isEnabled: false,
      used: 0,
      max: 0,
      active: {},
    }

    const root = CreateFrame('Frame', ROOT, UIParent)

    root.SetScript('OnUpdate', () => {
      if (!this.isStarted) {
        this.start(root)
      } else {
        root.SetScript('OnUpdate', () => {})
      }
    })
  }

  protected start (root: WoWAPI.Frame) {
    if (this.playerInfo)
      return

    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        this.playerInfo = {
          name: info[5].toLowerCase(),
          chrRace: info[2].toUpperCase() as CharacterRace,
          chrClass: info[0].toUpperCase() as CharacterClass,
          level: info[4],
        }

        _G['app'] = this

        this.root = Root(root)
        this.isStarted = true

        this.store.Init(() => this.onInit(this))
      }
    }
  }
}