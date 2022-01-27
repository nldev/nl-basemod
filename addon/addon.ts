const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')

btn.SetPoint('TOPLEFT')
btn.SetSize(100, 40)
btn.SetText('Click me')
btn.SetScript('OnClick', (_, button) => {
  console.log('You clicked me with ' + button)
})

// -----

const talents = CreateFrame('Frame', 'foo', UIParent)

talents.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

talents.SetBackdropColor(0, 0, 0, 1)
talents.SetSize(800, 800)
talents.SetPoint('CENTER')

// -----

const counter = CreateFrame('Frame', null, talents)

counter.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 0, right: 0, top: 0, bottom: 0 },
})

counter.SetBackdropColor(0, 0, 0, 1)
counter.SetSize(20, 20)
counter.SetPoint('TOPLEFT')

// -----

// const num = counter.CreateFontString(null, 'OVERLAY', 'GameTooltipText')
// num.SetPoint('CENTER', 0, 0)
// num.SetText('0')

interface Mapping<T = any> {
  [key: string]: T
}

interface IGridItem {
  frame: WoWAPI.Frame
  index: number
  height: number
  width: number
  x: number
  y: number
}

class GridItem {
  constructor (private params: IGridItem) {
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
  gridHeight: 800,
  gridWidth: 800,
}

class Grid {
  private list: GridItem[]
  private frame: WoWAPI.Frame

  private itemHeight: number = 0
  private itemWidth: number = 0
  private index: number = 0
  private x: number = 0
  private y: number = 0

  private params: IGrid

  constructor (private options: GridOptions = DEFAULT_GRID_OPTIONS) {
    this.params = { ...DEFAULT_GRID_OPTIONS, ...this.options }
  }

  public add (frame: WoWAPI.Frame) {
    const item = new GridItem({
      frame,
      index: this.index,
      height: this.itemHeight,
      width: this.itemWidth,
      x: this.x,
      y: this.y,
    })

    if (this.index === this.options.itemsPerRow) {
      this.index = 0
    } else {
      this.index++
    }
  }
}

const grid = new Grid()

// -----

console.log('addon loaded')


