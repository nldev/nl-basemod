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

interface CellOptions {
  size: number
  width: number
}

const CELL_OPTIONS: CellOptions = {
  size: 1,
  width: 100,
}

class Cell {
  constructor () {
  }
}

interface RowOptions {
  size: number,
  height: number,
}

const ROW_OPTIONS: RowOptions = {
  size: 3,
  height: 100,
}

class Row {
  constructor () {
  }
}

interface GridOptions {
  rowSize: number
  widthPerSize: number
}

const GRID_OPTIONS: GridOptions = {
  rowSize: 3,
  widthPerSize: 100,
}

class Grid {
  private items: [] = []
  private rows: Mapping<Row> = {}

  constructor (private options: GridOptions = GRID_OPTIONS) {
  }

  private add (/* frame: WoWAPI.Frame, */id: string, index: number = 0) {
  }

  private remove (id: string) {
  }
}

const grid = new Grid()

// -----

console.log('addon loaded')


