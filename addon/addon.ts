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
    this.frame = CreateFrame('Frame', null, this.params.parent)

    this.frame.SetBackdrop({
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      tile: true, tileSize: 16, edgeSize: 16,
      insets: { left: 4, right: 4, top: 4, bottom: 4 },
    })

    this.frame.SetBackdropColor(0, 0, 0, 1)
    this.frame.SetSize(this.params.width, this.params.height)

    this.params.child.SetParent(this.frame)
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

  public frame: WoWAPI.Frame
  public params: IGrid

  public itemWidth: number = 0
  public index: number = -1
  public x: number = 0
  public y: number = 0

  constructor (options: GridOptions = DEFAULT_GRID_OPTIONS) {
    this.params = { ...DEFAULT_GRID_OPTIONS, ...options }

    this.itemWidth = this.params.gridWidth / this.params.itemsPerRow

    this.frame = CreateFrame('Frame', null, UIParent)

    this.frame.SetBackdrop({
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      tile: true, tileSize: 16, edgeSize: 16,
      insets: { left: 4, right: 4, top: 4, bottom: 4 },
    })

    this.frame.SetBackdropColor(0, 0, 0, 1)
    this.frame.SetSize(this.params.gridWidth, this.params.gridHeight)
  }

  public add (frame: WoWAPI.Frame) {
    if (this.index === (this.params.itemsPerRow - 1)) {
      this.index = 0

      const item = new GridItem({
        parent: this.frame,
        child: frame,
        index: this.index,
        height: this.params.rowHeight,
        width: this.itemWidth,
        x: this.x,
        y: this.y,
      })

      this.x += this.itemWidth
    } else {
      this.x += 0
      this.y += this.params.gridHeight
      this.index++
    }
  }
}

const grid = new Grid()

// -----

console.log('addon loaded')


