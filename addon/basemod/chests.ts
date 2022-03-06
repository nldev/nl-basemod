import { Mapping } from './types'
import { Frame, Component, ComponentOptions, Element } from './app'
import { BASE_BACKDROP } from './constants'
import { Movable } from './utils'
import { Grid } from './components/grid'

export interface ChestItemOptions extends ComponentOptions {
  index: number
}

export const ChestItem: Component<ChestItemOptions> = options => {
  const frame = Frame({ name: `chest-item-${options.index}` })
  const { ref } = frame
  ref.SetBackdropColor(0, 0, 0, 1)
  ref.SetBackdrop(BASE_BACKDROP)
  ref.SetSize(50, 50)
  ref.EnableMouse(true)
  let texture
  let id = null
  const DrawTooltip = () => {
    GameTooltip.ClearLines()
    GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
    GameTooltip.SetHyperlink(`item:${id}`)
    GameTooltip.Show()
  }
  ref.SetScript('OnEnter', frame => {
    if (id)
      DrawTooltip()
  })
  ref.SetScript('OnLeave', frame => {
    GameTooltip.ClearLines()
    GameTooltip.Hide()
  })
  ref.SetScript('OnMouseDown', frame => {
    if (SelectedItem) {
      texture = texture || frame.CreateTexture()
      texture.SetTexture(GetItemIcon(SelectedItem.id))
      texture.SetAllPoints()
      texture.Show()
      id = SelectedItem.id
      SelectedItem = null
      SelectedItemInventoryId = 0
      DrawTooltip()
      ClearCursor()
    } else {
      id = null
      if (texture)
        texture.Hide()
      ClearCursor()
      GameTooltip.Hide()
    }
  })
  return frame
}

export const Chests: Component = () => {
  const padding = Frame({ name: 'chest' })
  padding.ref.RegisterEvent('LOOT_OPENED')
  padding.ref.RegisterEvent('LOOT_CLOSED')
  padding.ref.SetScript('OnEvent', (f, e) => {
    if (e === 'LOOT_OPENED') {
      padding.ref.Show()
    }
    if (e === 'LOOT_CLOSED') {
      padding.ref.Hide()
    }
  })

  Movable(padding)

  padding.ref.SetSize(510, 350)
  padding.ref.SetPoint('CENTER')
  padding.ref.SetBackdrop(BASE_BACKDROP)
  padding.ref.SetBackdropColor(0, 0, 0, 1)

  const inner = Frame({ name: 'chest-inner', parent: padding })
  // padding.inner = inner as any
  inner.ref.SetSize(480, 320)
  inner.ref.SetPoint('CENTER')

  const grid = Grid({ name: 'chest-grid', itemsPerRow: 6, rowHeight: 80, parent: inner })

  grid.ref.SetAllPoints(inner.ref)

  for (let i = 0; i < 24; i++) {
    const item = ChestItem({ index: i })

    grid.fns.Attach(item)
  }

  padding.ref.Hide()

  return padding
}

export interface ItemInfo {
  id: number
  name: string
  link: string
  quality: number
  level: number
  minLevel: number
  type: string
  subType: string
  stackCount: number
  equipLoc: string
  texture: number
  sellPrice: number
  classId: number
  subclassId: number
  bindType: number
  expacId: number
  setId: number
  isCraftingReagent: boolean
}

export const ItemInfo = (id: number): ItemInfo => {
  const list = GetItemInfo(id) as any

  return {
    id,
    name: list[1],
    link: list[2],
    quality: list[3],
    level: list[4],
    minLevel: list[5],
    type: list[6],
    subType: list[7],
    stackCount: list[8],
    equipLoc: list[9],
    texture: list[10],
    sellPrice: list[11],
    classId: list[12],
    subclassId: list[13],
    bindType: list[14],
    expacId: list[15],
    setId: list[16],
    isCraftingReagent: list[17],
  }
}

let SelectedItemInventoryId: number = 0
let SelectedItem: ItemInfo

for (let i = 1; i <= 16; i++) {
  const slot: WoWAPI.Button = _G[`ContainerFrame1Item${i}`]
  console.log(slot)
  console.log(i)
  if (slot) {
    slot.HookScript('OnClick', (frame, button) => {
      if (CursorHasItem()) {
        const cursor = GetCursorInfo()
        SelectedItem = ItemInfo(cursor[1])
        SelectedItemInventoryId = i
      }
    })
    slot.HookScript('OnDragStart', (frame, button) => {
      if (CursorHasItem()) {
        const cursor = GetCursorInfo()
        SelectedItem = ItemInfo(cursor[1])
        SelectedItemInventoryId = i
      }
    })
  }
}

