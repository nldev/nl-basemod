import { BASE_BACKDROP } from './constants'
import { Frame, Component, ComponentOptions, Element, Get } from './app'
import { Scroll } from './components/scroll'
import { List, ListState, ListFns } from './components/list'
import { Movable } from './utils'

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
      if (time < 0) {
        Detach()
        frame.ref.SetScript('OnUpdate', () => {})
      }
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
    if (IsControlKeyDown()) {
      DressUpItemLink(GetItemInfo(options.itemId)[1])
    } else {
      SendAddonMessage('loot-item', `${options.itemId} ${options.amount}`, 'WHISPER', app.playerInfo.name)
      Detach()
    }
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
  icon.ref.SetScript('OnKeyDown', (frame, key) => {
    console.log(key)
  })

  icon.ref.SetScript('OnEnter', () => {
    if (IsControlKeyDown()) {
      SetCursor('Interface/CURSOR/Inspect.blp')
    } else {
      SetCursor('Interface/CURSOR/Point.blp')
    }
    GameTooltip.ClearLines()
    GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
    GameTooltip.SetHyperlink(`item:${options.itemId}`)
    if (options.amount > 1)
    GameTooltip.AddLine(`Quantity: ${options.amount}`)
    GameTooltip.Show()
  })

  icon.ref.SetScript('OnLeave', () => {
    SetCursor('Interface/CURSOR/Point.blp')
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

export const EasyLoot: Component<LootOptions, LootState, LootFns> = () => {
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

  padding.ref.SetScale(0.8)

  return padding
}

