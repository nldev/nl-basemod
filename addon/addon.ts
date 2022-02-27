import * as TALENTS from './data/talents'

// utils
const names = {}

export function Unique (id: string) {
  const _id = names[id] ? names[id] : 0

  if (_id === 0) {
    names[id] = 0
  }

  names[id]++

  return `${id}-${_id}`
}

export function rgb (red: number, green: number, blue: number): Rgb {
  return [red / 255, green / 255, blue / 255]
}

// constants
export const BASE_BACKDROP = {
  // bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  // edgeFile: "Interface/DialogFrame/UI-DialogBox-Border",
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  bgFile: 'Interface/TutorialFrame/TutorialFrameBackground',
  tile: true,
  tileSize: 16,
  edgeSize: 16,
  insets: {
    left: 4,
    right: 4,
    top: 4,
    bottom: 4,
  },
}

export const BASE_COLORS = [0, 0, 0, 1]

export const SCROLL_WIDTH = 20

const REQUESTS = {
  GM: {
    SET_TALENT_POINTS: 'set-talent-points',
  },
  GET_TALENT_INFO: 'get-talent-info',
  LEARN_TALENT: 'learn-talent',
  UNLEARN_TALENT: 'unlearn-talent',
}

const RESPONSES = {
  GM: {
    SET_TALENT_POINTS_SUCCESS: 'set-talent-points-success',
  },
  GET_TALENT_INFO_SUCCESS: 'get-talent-info-success',
  LEARN_TALENT_SUCCESS: 'learn-talent-success',
  LEARN_TALENT_FAIL: 'learn-talent-fail',
  UNLEARN_TALENT_SUCCESS: 'unlearn-talent-success',
}

// types
export interface Mapping<T = any> {
  [key: string]: T
}

export type Rgb = [number, number, number]

export const ROOT = 'ROOT'

export const HUMAN = 'HUMAN'
export const ORC = 'ORC'
export const DWARF = 'DWARF'
export const NIGHT_ELF = 'NIGHT_ELF'
export const UNDEAD = 'UNDEAD'
export const TAUREN = 'TAUREN'
export const GNOME = 'GNOME'
export const TROLL = 'TROLL'
export const BLOOD_ELF = 'BLOOD_ELF'
export const DRAENEI = 'DRAENEI'

export const WARRIOR = 'WARRIOR'
export const ROGUE = 'ROGUE'
export const DRUID = 'DRUID'
export const MAGE = 'MAGE'
export const WARLOCK = 'WARLOCK'
export const SHAMAN = 'SHAMAN'
export const PRIEST = 'PRIEST'
export const PALADIN = 'PALADIN'
export const HUNTER = 'HUNTER'

export type CharacterClass =
  | typeof WARRIOR
  | typeof ROGUE
  | typeof DRUID
  | typeof MAGE
  | typeof WARLOCK
  | typeof SHAMAN
  | typeof PRIEST
  | typeof PALADIN
  | typeof HUNTER

export type CharacterRace =
  | typeof HUMAN
  | typeof ORC
  | typeof DWARF
  | typeof NIGHT_ELF
  | typeof UNDEAD
  | typeof TAUREN
  | typeof GNOME
  | typeof TROLL
  | typeof BLOOD_ELF
  | typeof DRAENEI

export interface ClassSelection {
  WARRIOR: boolean,
  ROGUE: boolean,
  DRUID: boolean,
  MAGE: boolean,
  WARLOCK: boolean,
  SHAMAN: boolean,
  PRIEST: boolean,
  PALADIN: boolean,
  HUNTER: boolean,
}

export interface RaceSelection {
  HUMAN: boolean,
  ORC: boolean,
  DWARF: boolean,
  NIGHT_ELF: boolean,
  UNDEAD: boolean,
  TAUREN: boolean,
  GNOME: boolean,
  TROLL: boolean,
  BLOOD_ELF: boolean,
  DRAENEI: boolean,
}

export interface PlayerInfo {
  name: string
  chrRace: string
  chrClass: string
  level: number
}

export interface TalentInfo {
  isEnabled: boolean
  used: number
  max: number
  active: Mapping<boolean>
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
      if (!this.isStarted)
        this.start(root)
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

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

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
  mod?: Mod | Mod[]
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

// frame
export const Frame: Component = options => {
  if (!options.name)
    throw new Error('Frame requires a name')

  const app = Get()

  const parent = options.parent
  const frame: WoWAPI.Frame = (app.elements[options.name] && app.elements[options.name].ref)
    || CreateFrame(options.type || 'Frame', options.name, parent ? parent.inner : app.root.ref, options.inherits) as WoWAPI.Frame

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else if (options.mod) {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

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

// scroll
export interface ScrollOptions extends ComponentOptions {
  scrollHeight?: number
}

export interface ScrollFns {
  Height: (amount: number) => void
}

export const Scroll: Component<ScrollOptions, any, ScrollFns> = options => {
  const a: Element<any, ScrollFns> = Frame(options) as any
  const frame = a.inner

  frame.SetAllPoints(frame.GetParent() as WoWAPI.Frame)

  const scrollframe = Frame({
    name: `${options.name}-scrollframe`,
    inherits: 'UIPanelScrollFrameTemplate',
    type: 'ScrollFrame',
    parent: a,
  })

  const ref = scrollframe.ref as WoWAPI.ScrollFrame

  const scrollchild = Frame({
    name: `${options.name}-scrollchild`,
    parent: scrollframe,
  }).ref

  const scrollbarName = ref.GetName()

  const scrollbar = _G[scrollbarName + 'ScrollBar']
  const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
  const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

  scrollupbutton.ClearAllPoints()
  scrollupbutton.SetPoint('TOPRIGHT', scrollframe.ref, 'TOPRIGHT', -2, -2)

  scrolldownbutton.ClearAllPoints()
  scrolldownbutton.SetPoint('BOTTOMRIGHT', scrollframe.ref, 'BOTTOMRIGHT', -2, 2)

  scrollbar.ClearAllPoints()
  scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
  scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

  // frame.SetSize(frame.GetWidth() * 0.667, frame.GetHeight() * 0.667)
  frame.SetPoint('CENTER')

  ref.SetScrollChild(scrollchild)
  ref.SetAllPoints(frame)

  scrollchild.SetSize(ref.GetWidth(), options.scrollHeight || ref.GetHeight() * 2)

  const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)

  moduleoptions.SetPoint('TOPLEFT')
  moduleoptions.SetWidth(scrollchild.GetWidth() - SCROLL_WIDTH)
  moduleoptions.SetHeight(scrollchild.GetHeight())

  a.fns = {
    Height: (amount: number) => {
      scrollchild.SetHeight(amount)
      moduleoptions.SetHeight(amount)
    }
  }

  a.inner = moduleoptions

  return a
}

// grid
export interface GridOptions extends ComponentOptions {
  itemsPerRow: number
  rowHeight: number
}

export interface GridItemOptions extends ComponentOptions {
  item: Element
  width: number
  height: number
  x: number
  y: number
}

export interface GridState {
  itemsPerRow: number
  rowHeight: number
  itemWidth: number
  list: Element[]
  index: number
  x: number
  y: number
}

export interface GridFns {
  Attach: ElementFn
  // Show
  // Hide
}

export const GridItem: Component<GridItemOptions> = options => {
  const frame = Frame(options)

  frame.ref.SetPoint('TOPLEFT', options.x, options.y)
  frame.ref.SetSize(options.width, options.height)

  options.item.ref.SetParent(frame.ref)
  options.item.ref.SetPoint('CENTER')

  return frame
}

export const Grid: Component<GridOptions, GridState, GridFns> = options => {
  const frame: Element<GridState, GridFns>  = Frame(options) as any

  frame.state.itemsPerRow = options.itemsPerRow
  frame.state.rowHeight = options.rowHeight
  frame.state.itemWidth = frame.parent.inner.GetWidth() / options.itemsPerRow
  frame.state.list = []
  frame.state.index = 0
  frame.state.x = 0
  frame.state.y = 0

  frame.fns.Attach = child => {
    const isEndOfRow = frame.state.index === ((frame.state.itemsPerRow || 3) - 1)

    const element = GridItem({
      parent: frame,
      name: Unique(`${options.name}-griditem`),
      item: child,
      width: frame.state.itemWidth,
      height: frame.state.rowHeight,
      x: frame.state.x,
      y: frame.state.y,
    })

    if (isEndOfRow) {
      frame.state.index = 0
      frame.state.x = 0
      frame.state.y -= frame.state.rowHeight
    } else {
      frame.state.index++
      frame.state.x += frame.state.itemWidth
    }

    frame.state.list.push(element)
  }

  // onShow () {
  //   this.list.forEach(item => item.Show(true))
  // }

  // onHide () {
  //   this.list.forEach(item => item.Hide(true))
  // }

  return frame
}

// lists
export interface ListItemOptions extends ComponentOptions {
  id: string,
  width: number
  height: number
  y: number
  child: Element<any, any>
}

export interface ListItemState {
  id: string
}

export interface ListItemFns {
  Reflow: (newY?: number) => void
}
export const ListItem: Component<ListItemOptions, ListItemState, ListItemFns> = options => {
  const frame: Element<ListItemState, ListItemFns> = Frame({ name: `${options.id}-list-item`, parent: options.parent }) as any
  let y = options.y || 0
  frame.ref.SetSize(options.width, options.height)
  options.child.ref.SetAllPoints(frame.ref)
  frame.state = {
    id: options.id,
  }
  frame.fns = {
    Reflow: (newY?: number) => {
      y = y
      frame.ref.SetPoint('TOPLEFT', 0, newY || y)
    }
  }
  frame.fns.Reflow()
  options.child.ref.SetParent(frame.ref)
  return frame
}

export interface ListOptions extends ComponentOptions {
  itemHeight: number
}

export interface ListState {
  items: Element<ListItemState, ListItemFns>[]
  map: Mapping<number>
  y: number
}

export interface ListFns {
  Attach: (id: string, element: Element<any, any>) => void
  Detach: (id: string) => void
  Reflow: () => void
}

export const List: Component<ListOptions, ListState, ListFns> = options => {
  const list: Element<ListState, ListFns> = Frame({ ...options }) as any

  list.ref.SetAllPoints(options.parent.inner)

  list.state = {
    items: [],
    map: {},
    y: 0,
  }

  list.fns = {
    Reflow: () => {
      list.state.y = 0
      list.state.map = {}

      list.state.items.forEach((item, index) => {
        list.state.map[item.state.id] = index
        item.fns.Reflow(list.state.y)
        list.state.y = list.state.y - options.itemHeight
      })
    },

    Attach: (id: string, child: Element<any, any>) => {
      const item = ListItem({
        id,
        child,
        width: list.ref.GetWidth(),
        height: options.itemHeight,
        y: list.state.y,
        parent: list,
      })

      list.state.y = list.state.y - options.itemHeight
      list.state.items.push(item)
      list.state.map[id] = list.state.items.length - 1
      item.ref.Show()
    },

    Detach: (id: string) => {
      const index = list.state.map[id]
      const item = list.state.items.splice(index, 1)[0]

      if (item) {
        item.ref.Hide()
        list.fns.Reflow()
      }
    }
  }

  return list
}

// talents
export interface TalentSpell {
  name: string
  id: string
  spellId: number
  icon: string
  cost: number
  class: ClassSelection
  classmask: number
}

export interface TalentOptions extends ComponentOptions {
  spell: TalentSpell
  onActivate?: () => void
  onDeactivate?: () => void
}

export interface TalentState {
  isActive: boolean
  isHover: boolean
}

export interface TalentFns {
  requestActivate: () => void
  requestDeactivate: () => void
  activate: () => void
  deactivate: () => void
  toggle: () => void
  // Show
  // Hide
}

export const Talent: Component<TalentOptions, TalentState, TalentFns> = options => {
  // frame
  const frame: Element<TalentState, TalentFns> =
    Frame({ name: `talent-${options.spell.id}` }) as any

  frame.ref.SetSize(40, 40)

  // cost
  const cost = Frame({ name: `talent-${options.spell.id}-cost`, parent: frame })

  cost.ref.SetSize(43, 20)
  cost.ref.SetPoint('BOTTOM', 0, -20)
  cost.ref.SetBackdrop(BASE_BACKDROP)
  cost.ref.SetBackdropColor(0, 0, 0, 1)

  const costText = frame.ref.CreateFontString(
    `talent-${options.spell.id}-costtext`,
    'OVERLAY',
    'GameTooltipText',
  )
  costText.SetParent(cost.ref)
  costText.SetPoint('CENTER')
  costText.SetText(`${options.spell.cost}`)
  costText.SetFont('Fonts/FRIZQT__.TTF', 10)

  // active: blue
  // unactive - nohover: white
  // unactive - hover: green

  const setCostTextColor = () => {
    const [red, green, blue] = frame.state.isActive
      ? [1, 1, 1]
      : [0.75, 0.75, 0.75]

    costText.SetTextColor(red, green, blue)
  }

  // style
  frame.ref.SetBackdrop({
    // bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true,
    tileSize: 16,
    insets: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })

  frame.ref.SetBackdropColor(0, 0, 0, 1)

  const texture = frame.ref.CreateTexture()

  texture.SetTexture(options.spell.icon)
  texture.SetAllPoints()

  // mouse
  frame.ref.EnableMouse(true)

  // onClick
  frame.inner.SetScript('OnMouseDown', (_, button) => {
    const remainder = app.talentInfo.max - app.talentInfo.used
    if (button === 'LeftButton' && !frame.state.isActive && (options.spell.cost <= remainder))
      frame.fns.requestActivate()

    if (button === 'RightButton' && frame.state.isActive)
      frame.fns.requestDeactivate()
  })

  // tooltip
  const drawTooltip = () => {
    if (frame.state.isHover) {
      GameTooltip.ClearLines()
      GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
      GameTooltip.SetHyperlink(`spell:${options.spell.spellId}`)
      if (!frame.state.isActive) {
        const [red, green, blue] = rgb(102, 217, 239)
        GameTooltip.AddDoubleLine('Cost: ', `${options.spell.cost}`, red, green, blue, 1, 1, 1)
      } else {
        GameTooltip.AddLine('Learned', ...rgb(166, 226, 46))
      }
      GameTooltip.Show()
    }
  }

  const clearTooltip = () => {
    GameTooltip.ClearLines()
    GameTooltip.Hide()
  }

  frame.ref.SetScript('OnEnter', () => {
    const remainder = app.talentInfo.max - app.talentInfo.used
    if (options.spell.cost <= remainder)
      SetDesaturation(texture, false)
    frame.state.isHover = true
    drawTooltip()
  })

  frame.ref.SetScript('OnLeave', () => {
    if (!frame.state.isActive)
      SetDesaturation(texture, true)
    frame.state.isHover = true
    clearTooltip()
  })

  // export
  frame.state = {
    isHover: false,
    isActive: false,
  }

  frame.fns = {
    requestActivate: () => {
      if (!frame.state.isActive)
        SendAddonMessage(REQUESTS.LEARN_TALENT, options.spell.id, 'WHISPER', app.playerInfo.name)
    },
    requestDeactivate: () => {
      if (frame.state.isActive)
       SendAddonMessage(REQUESTS.UNLEARN_TALENT, options.spell.id, 'WHISPER', app.playerInfo.name)
    },
    activate: () => {
      frame.state.isActive = true
      drawTooltip()
      setCostTextColor()
      SetDesaturation(texture, false)
      if (options.onActivate)
        options.onActivate()
    },
    deactivate: () => {
      frame.state.isActive = false
      drawTooltip()
      setCostTextColor()
      SetDesaturation(texture, true)
      if (options.onDeactivate)
        options.onDeactivate()
    },
    toggle: () => {
      frame.state.isActive
        ? frame.fns.deactivate()
        : frame.fns.activate()
    },
  }

  frame.state.isActive = false
  drawTooltip()
  setCostTextColor()
  SetDesaturation(texture, true)

  return frame
}

// Loot
export interface LootItemFns {
}

export interface LootItemState {
  id: number
  itemId: number
  amount: number
  mechanic: number
  isLocked: boolean
}

export interface LootItemOptions extends ComponentOptions {
  id: number
  itemId: number
  amount: number
  list: Element<ListState, ListFns>
  parent: Element<LootState, LootFns>
  timer: number
  // FIXME
  mechanic?: number
}

export const LootItem: Component<
  LootItemOptions,
  LootItemState,
  LootItemFns
> = options => {
  // app
  const app = Get()

  // frame
  const [frame, index] = GetLootFrame()

  frame.ref.SetBackdrop(BASE_BACKDROP)
  frame.ref.SetBackdropColor(0, 0, 0, 1)

  const listId = `loot-list-item-${index}`
  options.list.fns.Attach(listId, frame)

  // counter
  const counterTextName = `${frame.ref.GetName()}-counter`
  const counterText = frame.ref.CreateFontString(
    counterTextName,
    'OVERLAY',
    'GameTooltipText',
  )

  counterText.Hide()
  counterText.SetParent(frame.ref)
  counterText.SetPoint('TOPRIGHT', -8, -8)
  counterText.SetFont('Fonts/FRIZQT__.TTF', 10)
  counterText.SetText('')

  if (options.timer) {
    counterText.Show()

    const limit = GetTime() + options.timer

    frame.ref.SetScript('OnUpdate', () => {
      const current = GetTime()
      const time = limit - current
      counterText.SetText(`${Math.floor(time)}`)
      if (time < 0)
        Detach()
    })
  }

  // icon
  const iconName = `${frame.ref.GetName()}-icon`
  const icon: Element<any, any> = _G[iconName] || Frame({ name: iconName, parent: frame })
  _G[iconName] = icon

  icon.ref.SetSize(35, 35)

  icon.ref.SetBackdropColor(0, 0, 0, 1)

  const textureName = `${frame.ref.GetName()}-texture`
  const texture = _G[textureName] || icon.ref.CreateTexture(textureName)
  _G[textureName] = texture

  texture.SetTexture(GetItemIcon(options.itemId))
  texture.SetAllPoints()

  icon.ref.EnableMouse(true)
  icon.ref.SetScript('OnMouseDown', (_, button) => {
    SendAddonMessage('loot-item', `${options.itemId} ${options.amount}`, 'WHISPER', app.playerInfo.name)
    Detach()
  })

  icon.ref.SetPoint('LEFT', 8, 0)

  // title
  const titleTextName = `${frame.ref.GetName()}-title`
  const titleText = icon.ref.CreateFontString(
    titleTextName,
    'OVERLAY',
    'GameTooltipText',
  )

  const info = GetItemInfo(options.itemId)
  titleText.SetParent(icon.ref)
  titleText.SetFont('Fonts/FRIZQT__.TTF', 10)
  const quality = info[2]
  if (quality) {
    const color = GetItemQualityColor(info[2])
    titleText.SetTextColor(color[0], color[1], color[2], Number(color[3]))
  }

  let amountText = ''
  if (options.amount > 1)
    amountText = ` (${options.amount})`
  titleText.SetText(info[0] + amountText)
  titleText.SetSize(frame.ref.GetWidth() - 120, frame.ref.GetHeight())
  titleText.SetPoint('LEFT', 40, 0)

  // close
  // const closeName = `${frame.ref.GetName()}-close`
  // const close = icon.ref.CreateFontString(
  //   closeName,
  //   'OVERLAY',
  //   'GameTooltipText',
  // )

  // close.SetTextColor(1, 0, 0, 0.5)
  // close.SetText('X')
  // close.SetParent(frame.ref)
  // close.SetPoint('BOTTOMRIGHT', -8, 8)
  // close.SetScript('OnMouseDown', (_, button) => {
  //   // FIXME: send dismiss event
  //   Detach()
  // })
  // close.SetScript('OnEnter', () => {
  //   close.SetTextColor(1, 0, 0, 1)
  // })
  // close.SetScript('OnLeave', () => {
  //   close.SetTextColor(1, 0, 0, 0.5)
  // })

  // tooltip
  icon.ref.SetScript('OnEnter', () => {
    GameTooltip.ClearLines()
    GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
    GameTooltip.SetHyperlink(`item:${options.itemId}`)
    if (options.amount > 1)
    GameTooltip.AddLine(`Quantity: ${options.amount}`)
    GameTooltip.Show()
  })

  icon.ref.SetScript('OnLeave', () => {
    GameTooltip.ClearLines()
    GameTooltip.Hide()
  })

  // detach
  const Detach = () => {
    options.list.fns.Detach(listId)
    frame.ref.Hide()
    counterText.Hide()
    counterText.ClearAllPoints()
    titleText.Hide()
    titleText.ClearAllPoints()
    frame.state.isLocked = false
    options.parent.fns.Reflow()
  }

  frame.state = {
    id: options.id,
    itemId: options.itemId,
    amount: options.amount,
    mechanic: options.mechanic || 0,
    isLocked: true,
  }

  frame.ref.Show()

  return frame
}

const map: any = {}

const GetLootFrame = (): [Element<LootItemState, LootItemFns>, number] => {
  let i = -1
  let isSearching = true
  let f: Element<LootItemState, LootItemFns>

  while (isSearching) {
    i++

    if (!map[i]) {
      f = Frame({ name: `loot-frame-${i}` }) as any
      isSearching = false
    } else {
      f = map[i]

      if (!f.state.isLocked)
        isSearching = false
    }
  }

  map[i] = f

  return [f, i]
}

export interface Loot {
  id: number
  itemId: number
  amount?: number
  mechanic?: number
  timer?: number
}

export interface LootFns {
  Add: (options: Loot) => void
  Reflow: () => void
}

export interface LootState {}

export interface LootOptions {}

// FIXME pass in default
export function Movable (element: Element<any, any>, defaultPoint: WoWAPI.Point = 'CENTER', defaultX: number = 0, defaultY:number = 0) {
  const name = element.ref.GetName()

  let a = app.store.Get('STORE_TYPE_CHARACTER', `${name}-point-a`) || defaultPoint
  let b = app.store.Get('STORE_TYPE_CHARACTER', `${name}-point-b`) || defaultPoint
  let x = app.store.Get('STORE_TYPE_CHARACTER', `${name}-x`) || defaultX
  let y = app.store.Get('STORE_TYPE_CHARACTER', `${name}-y`) || defaultY

  if ((a !== '') && !a) {
    element.ref.SetPoint(defaultPoint, defaultX, defaultY)

    let [a1, _, a3, a4, a5] = element.ref.GetPoint()

    a = a1
    b = a3
    x = a4
    y = a5

    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-a`, a)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-b`, b)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-x`, x)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-y`, y)
  }

  element.ref.EnableMouse(true)
  element.ref.SetMovable(true)
  element.ref.RegisterForDrag('RightButton')

  element.ref.SetScript('OnDragStart', f => f.StartMoving())
  element.ref.SetScript('OnDragStop', f => {
    f.StopMovingOrSizing()

    let [a1, _, a3, a4, a5] = element.ref.GetPoint()

    a = a1
    b = a3
    x = a4
    y = a5

    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-a`, a)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-b`, b)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-x`, x)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-y`, y)
  })

  element.ref.SetPoint(a, app.root.ref, b, x, y)
}

export const Loot: Component<LootOptions, LootState, LootFns> = () => {
  const padding: Element<LootState, LootFns> = Frame({ name: 'loot' }) as any
  const app = Get()

  Movable(padding)

  padding.ref.SetSize(290, 290)
  padding.ref.SetBackdrop(BASE_BACKDROP)
  padding.ref.SetBackdropColor(0, 0, 0, 1)

  const frame = Frame({ name: 'loot-inner', parent: padding })

  frame.ref.SetSize(250, 250)
  frame.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'loot-scroll', scrollHeight: 250, parent: frame })
  const list = List({ name: 'loot-list', itemHeight: 50, parent: scroll })

  padding.fns = {
    Add: options => {
      LootItem({
        list,
        id: options.id,
        itemId: options.itemId,
        amount: options.amount || 1,
        timer: options.timer,
        mechanic: options.mechanic,
        parent: padding,
      })
      scroll.fns.Height(list.state.items.length * 50)
      padding.ref.Show()
    },
    Reflow: () => {
      scroll.fns.Height(list.state.items.length * 50)
      if (list.state.items.length === 0)
        padding.ref.Hide()
    },
  }

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== 'get-loot-item')
      return
    if (!text)
      return
    const [a, b, c, d, e] = text.split(' ')

    const id = Number(a)
    const itemId = Number(b)
    const amount = Number(c)
    const timer = Number(d)
    const mechanic = Number(e)

    padding.fns.Add({
      id,
      itemId,
      amount,
      timer,
      mechanic,
    })
  })

  padding.ref.Hide()

  return padding
}

// FIXME organize this this
const app = new App(app => {
  const root = Root()
  const loot = Loot()

  Events.ChatInfo.OnChatMsgSay(app.root.ref, (text, player) => {
    if (player.toLowerCase() !== name)
      return
    if (text.indexOf('@@') === 0) {
      loot.fns.Add({
        id: 0,
        itemId: 19138,
        amount: 1,
        timer: 300,
      })
    }
  })

  const a = Frame({
    name: 'talents',
    parent: root,
  })

  Movable(a)

  a.inner.EnableMouse(true)
  a.inner.SetMovable(true)
  a.inner.RegisterForDrag('RightButton')
  a.inner.SetScript('OnDragStart', f => f.StartMoving())
  a.inner.SetScript('OnDragStop', f => f.StopMovingOrSizing())

  a.inner.SetScript('OnMouseDown', (_, button) => {
    if (button === 'LeftButton')
      console.log('left click')
  })

  a.inner.SetSize(400, 400)
  a.inner.SetBackdrop(BASE_BACKDROP)
  a.inner.SetBackdropColor(0, 0, 0, 1)

  const title = Frame({
    name: 'title',
    parent: a,
  })

  title.ref.SetSize(140, 30)
  title.ref.SetBackdrop(BASE_BACKDROP)
  title.ref.SetBackdropColor(0, 0, 0, 1)
  title.ref.SetPoint('TOPRIGHT', 0, 35)
  const titleText = a.ref.CreateFontString(
    'talent-countertext',
    'OVERLAY',
    'GameTooltipText',
  )
  titleText.SetParent(title.ref)
  titleText.SetPoint('CENTER')
  titleText.SetText('basemod v0.1.0')
  titleText.SetFont('Fonts/FRIZQT__.TTF', 10)

  const b = Frame({
    name: 'b',
    parent: a,
  })

  b.inner.SetSize(a.inner.GetWidth() - 60, a.inner.GetHeight() - 60)
  b.inner.SetPoint('CENTER')

  const scroll = Scroll({
    name: 'scroll',
    parent: b,
  })

  const grid = Grid({
    name: 'grid',
    itemsPerRow: 4,
    rowHeight: 80,
    parent: scroll,
  })

  grid.ref.SetAllPoints(scroll.inner)

  // counterText
  const counter = Frame({ name: 'talent-counter', parent: a })
  counter.ref.SetSize(80, 30)
  counter.ref.SetBackdrop(BASE_BACKDROP)
  counter.ref.SetBackdropColor(0, 0, 0, 1)
  counter.ref.SetPoint('BOTTOMLEFT', 0, -35)
  const counterText = b.ref.CreateFontString(
    'talent-countertext',
    'OVERLAY',
    'GameTooltipText',
  )
  counterText.SetParent(counter.ref)
  counterText.SetPoint('CENTER')
  counterText.SetText(`${app.talentInfo.max - app.talentInfo.used} / ${app.talentInfo.max}`)
  counterText.SetFont('Fonts/FRIZQT__.TTF', 10)
  // costText.SetTextColor(red, green, blue)

  for (const key of Object.keys(TALENTS)) {
    const spell: TalentSpell = TALENTS[key]

    if (spell.class[app.playerInfo.chrClass]) {
      const talent = Talent({
        spell,
        onActivate: () => {
          // console.log(`${spell.id} activated`)
        },
        onDeactivate: () => {
          // console.log(`${spell.id} deactivated`)
        },
      })

      grid.fns.Attach(talent)
    }
  }

  // function onSetHyperlink(tooltip: WoWAPI.GameTooltip) {
  //   const [_, link] = tooltip.GetItem()
  //   const a = link.split(':')
  //   const id = a[1]
  //   SendAddonMessage('refresh-item', id, 'WHISPER', app.playerInfo.name)
  // }
  // GameTooltip.HookScript('OnTooltipSetItem', onSetHyperlink)

  // hooksecurefunc(GameTooltip, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip1, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip2, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip1, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip2, "SetHyperlink", onSetHyperlink)

  // ItemRefTooltip.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ItemRefShoppingTooltip1.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ItemRefShoppingTooltip2.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ShoppingTooltip1.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ShoppingTooltip2.HookScript('OnTooltipSetItem', onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip1, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip2, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip1, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip2, "SetItemRef", onSetHyperlink)

  const { name, level, chrRace, chrClass } = app.playerInfo

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== RESPONSES.GET_TALENT_INFO_SUCCESS)
      return
    if (!text)
      return
    const [a, b] = text.split(' ')
    const used = Number(a)
    const max = Number(b)
    if (used && max) {
      app.talentInfo.isEnabled = true
      app.talentInfo.used = used
      app.talentInfo.max = max
      counterText.SetText(`${app.talentInfo.max - app.talentInfo.used} / ${app.talentInfo.max}`)
    }
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, talentId) => {
    if (prefix !== RESPONSES.LEARN_TALENT_SUCCESS)
      return
    if (!talentId)
      return
    const ele = app.elements[`talent-${talentId}`] as Element<TalentState, TalentFns>
    if (ele && !ele.state.isActive)
      ele.fns.activate()
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, talentId) => {
    if (prefix !== RESPONSES.UNLEARN_TALENT_SUCCESS)
      return
    if (!talentId)
      return
    const ele = app.elements[`talent-${talentId}`] as Element<TalentState, TalentFns>
    if (ele && ele.state.isActive)
      ele.fns.deactivate()
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== RESPONSES.GM.SET_TALENT_POINTS_SUCCESS)
      return
    if (!text)
      return
    console.log('success')
  })

  SendAddonMessage(REQUESTS.GET_TALENT_INFO, '', 'WHISPER', name)

  Events.ChatInfo.OnChatMsgSay(app.root.ref, (text, player) => {
    if (player.toLowerCase() !== name)
      return
    if (text.indexOf('@talents ') === 0) {
      const amount = text.replace('@talents ', '')
      SendAddonMessage(REQUESTS.GM.SET_TALENT_POINTS, amount, 'WHISPER', name)
    }
  })
})

