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
  height?: number
  width?: number
  scale?: number
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
  const name = options.name || 'frame'

  const app = Get()

  const parent = options.parent
  const frame: WoWAPI.Frame = (app.elements[name] && app.elements[name].ref)
    || CreateFrame(options.type || 'Frame', name, parent ? parent.inner : app.root.ref, options.inherits) as WoWAPI.Frame

  // if (typeof options.mod === 'function') {
  //   options.mod(frame)
  // } else if (options.mod) {
  //   options.mod.forEach(fn => {
  //     fn(frame)
  //   })
  // }

  if (options.parent)
    frame.SetParent(options.parent.inner)

  if (options.width)
    frame.SetWidth(options.width)

  if (options.height)
    frame.SetHeight(options.height)

  if (options.scale)
    frame.SetScale(options.scale)

  const element = {
    parent,
    name,
    ref: frame,
    inner: frame,
    state: options.state || {},
    fns: options.fns || {},
  }

  app.elements[name] = element

  return element
}

// store
const ACCOUNT = 'ACCOUNT'
const CHARACTER = 'CHARACTER'

export type StoreType = typeof ACCOUNT | typeof CHARACTER
export type StoreValue = string | number | boolean | null

export class Store {
  isLoaded = false
  state: any = {
    [ACCOUNT]: {},
    [CHARACTER]: {},
  }

  public Init (onInit: () => void) {
    const app = Get()

    Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
      if (prefix !== 'store-get')
        return
      if (!text)
        return

      const [primitive, type, storeKey, ...storeValue] = text.split(' ')

      const n = Number(primitive)
      this.state[(type === '1') ? 'ACCOUNT' : 'CHARACTER'][storeKey] = (n === 0)
        ? Number(storeValue[0])
        : (n === 2)
        ? ((storeValue[0] === '1') ? true : false)
        : (n === 3)
        ? null
        : storeValue.join(' ')
    })

    Events.ChatInfo.OnChatMsgAddon(app.root.ref, prefix => {
      if (prefix !== 'store-init-success')
        return

      this.isLoaded = true

      onInit()
    })

    SendAddonMessage('store-init', ' ', 'WHISPER', app.playerInfo.name)
  }

  public Set (storeType: StoreType, storeKey: string, storeValue: StoreValue) {
    const app = Get()
    const primitive = typeof storeValue === 'number'
      ? 0 // number
      : typeof storeValue === 'string'
      ? 1 // string
      : typeof storeValue === 'boolean'
      ? 2 // boolean
      : 3 // null
    this.state[storeType][storeKey] = storeValue
    const t = (storeType === 'ACCOUNT') ? 1 : 0
    const v = (primitive === 2)
      ? (storeValue ? '1' : '0')
      : storeValue
    SendAddonMessage('store-set', `${primitive} ${t} ${storeKey} ${v}`, 'WHISPER', app.playerInfo.name)
  }

  public Get (type: StoreType, storeKey: string, defaultValue?: StoreValue) {
    let value = this.state[type][storeKey]

    if (!value && defaultValue) {
      this.Set(type, storeKey, defaultValue)
      value = defaultValue
    }

    return value
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
          level: UnitLevel('player'),
        }

        _G['app'] = this

        this.root = Root(root)
        this.isStarted = true

        this.store.Init(() => this.onInit(this))
      }
    }
  }
}

