// const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')
//
// btn.SetPoint('TOPLEFT')
// btn.SetSize(100, 40)
// btn.SetText('Click me')
// btn.SetScript('OnClick', (_, button) => {
//   console.log('You clicked me with ' + button)
// })

// -----

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
  itemsPerRow: 8,
  rowHeight: 100,
  gridHeight: 800,
  gridWidth: 800,
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

    this.frame = CreateFrame('ScrollFrame', null, UIParent)

    this.frame.SetBackdrop({
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      tile: true, tileSize: 16, edgeSize: 16,
      insets: { left: 4, right: 4, top: 4, bottom: 4 },
    })

    this.frame.SetBackdropColor(0, 0, 0, 1)
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

function TestFrame () {
  const frame = CreateFrame('Frame', null, UIParent)

  frame.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 16, edgeSize: 16,
    insets: { left: 4, right: 4, top: 4, bottom: 4 },
  })
  const texture = frame.CreateTexture()
  texture.SetTexture('Interface/Icons/Spell_Frost_WindWalkOn')
  texture.SetAllPoints()
  SetDesaturation(texture, true)

  frame.SetBackdropColor(0, 0, 0, 1)
  frame.SetSize(50, 50)

  const counter = CreateFrame('Frame', null, frame)

  counter.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 12, edgeSize: 12,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  })

  counter.SetBackdropColor(0, 0, 0, 1)
  counter.SetSize(30, 18)
  counter.SetPoint('BOTTOM', 0, -8)
  //  bgFile: 'Interface/Icons/Spell_Frost_WindWalkOn',

  const text = counter.CreateFontString(null, 'OVERLAY', 'GameTooltipText')

  text.SetPoint('CENTER', 0, 0)
  text.SetText('0/3')
  text.SetFont('Fonts\\FRIZQT__.TTF', 11)


  return frame
}

function run () {
const grid = new Grid()
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
grid.add(TestFrame())
}

// run()
//
// ---

let s = CreateFrame('Frame', null, UIParent)

s.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

s.SetBackdropColor(0, 0, 0, 1)
s.SetSize(800, 800)
s.SetPoint('CENTER')

const scrollframe = CreateFrame('ScrollFrame', 'ANewScrollFrame', null, 'UIPanelScrollFrameTemplate')
const scrollchild = CreateFrame('Frame')

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

scrollframe.SetScrollChild(scrollchild)
scrollframe.SetAllPoints(s)


scrollchild.SetSize(scrollframe.GetWidth(), (scrollframe.GetHeight() * 2))

const moduleoptions = CreateFrame('Frame', null, scrollchild)
moduleoptions.SetAllPoints(scrollchild)

const fs = moduleoptions.CreateFontString(null, 'OVERLAY', 'GameTooltipText')

fs.SetText('This is a test.')
fs.SetPoint('BOTTOMLEFT', moduleoptions, 'BOTTOMLEFT', 20, 60)


// -----

console.log('addon loaded')


