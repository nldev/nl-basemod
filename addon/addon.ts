import * as TALENTS from './data/talents'

const talentsMap: Mapping<Talent> = TALENTS as any

// --------

let isLoading = true

function load () {
  if (isLoading) {
    const player = UnitGUID('player')

    if (!player) {
      const info = GetPlayerInfoByGUID(player)

      if (!info[0]) {
        isLoading = false

        init()
      }
    }
  }
}

function init () {
  const grid = new Grid()

  for (const key of Object.keys(TALENTS))
    grid.add(TalentButton(TALENTS[key]))

  grid.frame.SetParent(moduleoptions)
  grid.frame.SetPoint('TOPLEFT')
}

const root = CreateFrame('Frame', 'root', UIParent)

root.SetScript('OnUpdate', () => {
  init()
})

// const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')
//
// btn.SetPoint('TOPLEFT')
// btn.SetSize(100, 40)
// btn.SetText('Click me')
// btn.SetScript('OnClick', (_, button) => {
//   console.log('You clicked me with ' + button)
// })

// -----

const names = {}

function Unique (name: string) {
  const id = names[name] ? names[name] : 0

  if (id === 0) {
    names[name] = 0
  }

  names[name]++

  return `${name}-${id}`
}

interface Mapping<T = any> {
  [key: string]: T
}

interface IGridItem {
  parent: WoWAPI.Frame
  child: WoWAPI.Frame
  index: number
  height: number
  width: number
  x: number
  y: number
}

class GridItem {
  public frame: WoWAPI.Frame

  constructor (public params: IGridItem) {
    this.frame = CreateFrame('Frame', Unique('griditem'), this.params.parent)

    // this.frame.SetBackdrop({
    //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    //   tile: true, tileSize: 16, edgeSize: 16,
    //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
    // })

    // this.frame.SetBackdropColor(0, 0, 0, 1)
    this.frame.SetSize(this.params.width, this.params.height)
    this.frame.SetPoint('TOPLEFT', this.params.x, this.params.y)
    this.frame.SetParent(this.params.parent)

    this.params.child.SetParent(this.frame)
    this.params.child.SetPoint('CENTER')
  }
}

interface IGrid {
  itemsPerRow: number
  rowHeight: number
  gridHeight: number
  gridWidth: number
}

type GridOptions = Partial<IGrid>

const DEFAULT_GRID_OPTIONS: IGrid = {
  itemsPerRow: 4,
  rowHeight: 100,
  gridHeight: 400,
  gridWidth: 450,
}

class Grid {
  // private list: GridItem[]
  public frame: WoWAPI.Frame
  public params: IGrid

  public itemWidth: number

  public index: number = 0
  public x: number = 0
  public y: number = 0

  constructor (options: GridOptions = DEFAULT_GRID_OPTIONS) {
    this.params = { ...DEFAULT_GRID_OPTIONS, ...options }

    this.itemWidth = this.params.gridWidth / this.params.itemsPerRow

    this.frame = CreateFrame('ScrollFrame', 'grid', UIParent)

    // this.frame.SetBackdrop({
    //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    //   tile: true, tileSize: 16, edgeSize: 16,
    //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
    // })

    // this.frame.SetBackdropColor(0, 0, 0, 1)

    this.frame.SetSize(this.params.gridWidth, this.params.gridHeight)
    this.frame.SetPoint('CENTER')
  }

  public add (frame: WoWAPI.Frame) {
    const isEndOfRow = this.index === (this.params.itemsPerRow - 1)

    new GridItem({
      parent: this.frame,
      child: frame,
      index: this.index,
      height: this.params.rowHeight,
      width: this.itemWidth,
      x: this.x,
      y: this.y,
    })

    if (isEndOfRow) {
      this.index = 0
      this.x = 0
      this.y -= this.params.rowHeight
    } else {
      this.index++
      this.x += this.itemWidth
    }

    // this.list.push(item)
    // console.log('pushed to list')
  }
}

// ------

let a = CreateFrame('Frame', 'a', UIParent)

a.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

a.SetBackdropColor(0, 0, 0, 1)
a.SetSize(800, 800)
a.SetPoint('CENTER')

a.EnableMouse(true)
a.RegisterForDrag('RightButton')
a.SetMovable(true)
a.SetScript('OnDragStart', f => f.StartMoving())
a.SetScript('OnDragStop', f => f.StopMovingOrSizing())

const scrollframe = CreateFrame('ScrollFrame', 'scrollframe', null, 'UIPanelScrollFrameTemplate')
const scrollchild = CreateFrame('Frame', 'scrollchild')

const scrollbarName = scrollframe.GetName()

const scrollbar = _G[scrollbarName + 'ScrollBar']
const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

scrollupbutton.ClearAllPoints()
scrollupbutton.SetPoint('TOPRIGHT', scrollframe, 'TOPRIGHT', -2, -2)

scrolldownbutton.ClearAllPoints()
scrolldownbutton.SetPoint('BOTTOMRIGHT', scrollframe, 'BOTTOMRIGHT', -2, 2)

scrollbar.ClearAllPoints()
scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

a.SetSize(a.GetWidth() * 0.667, a.GetHeight() * 0.667)

scrollframe.SetScale(0.667)
scrollframe.SetScrollChild(scrollchild)

const b = CreateFrame('Frame', 'b', UIParent)

b.SetSize(a.GetWidth() * 0.95, a.GetHeight() * 0.95)
b.SetParent(a)
b.SetPoint('CENTER')

scrollframe.SetAllPoints(b)

scrollchild.SetSize(scrollframe.GetWidth(), (scrollframe.GetHeight() * 2))

const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)
moduleoptions.SetAllPoints(scrollchild)

a.SetFrameLevel(0)
b.SetFrameLevel(1)
moduleoptions.SetFrameLevel(2)

// ------

class Foo {
  constructor () {
    this.load()
  }

  private load () {
    const player = UnitGUID('player')

    if (!player)
      return this.load()

    const [localizedClass] = GetPlayerInfoByGUID(UnitGUID('player'))

    if (!localizedClass)
      return this.load()

    this.init()
  }

  private init () {
    console.log('is loaded')
  }
}

// ------

interface Talent {
  id: string
  spellId: number
  cost: number
  icon: string
  class: Mapping<boolean>
  classMask: number
}

function TalentButton (talent: Talent) {
  const frame = CreateFrame('Frame', Unique('testframe'), UIParent)

  frame.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 16, edgeSize: 16,
    insets: { left: 4, right: 4, top: 4, bottom: 4 },
  })

  const texture = frame.CreateTexture()
  texture.SetTexture(talent.icon)
  texture.SetAllPoints(frame)
  SetDesaturation(texture, true)

  frame.SetBackdropColor(0, 0, 0, 1)

  const counter = CreateFrame('Frame', Unique('testframe-counter'), frame)
  frame.SetSize(50, 50)

  counter.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 12, edgeSize: 12,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  })

  counter.SetBackdropColor(0, 0, 0, 1)
  counter.SetSize(50, 18)
  counter.SetPoint('BOTTOM', 0, -8)
  //  bgFile: 'Interface/Icons/Spell_Frost_WindWalkOn',


  const text = counter.CreateFontString(null, 'OVERLAY', 'GameTooltipText')

  text.SetPoint('CENTER', 0, 0)
  text.SetText(`${talent.cost}`)
  text.SetFont('Fonts\\FRIZQT__.TTF', 11)

  // frame.SetScript('OnLoad', () => console.log('loaded'))
  frame.SetFrameLevel(3)
  frame.EnableMouse(true)

  // frame.SetScript('OnClick', () => console.log(`clicked ${talent.spellId}`))

  // frame.SetScript('OnClick', () => console.log(`clicked ${talent.spell_id}`))
  frame.SetScript('OnEnter', frame => {
    const unit = UnitGUID('player')
    SetDesaturation(texture, false)
    console.log(`enter ${talent.spellId}`)
    GameTooltip.SetOwner(a, 'ANCHOR_CURSOR')
    GameTooltip.SetHyperlink(`spell:${talent.spellId}`)
    GameTooltip.Show()
  })

  frame.SetScript('OnLeave', frame => {
    SetDesaturation(texture, true)
    console.log(`leave ${talent.spellId}`)
    GameTooltip.Hide()
  })

  return frame
}


