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

class GridItem {
  constructor (public frame: WoWAPI.Frame, public index: number) {
  }
}

class Grid {
  private list: GridItem[]
  private frame: WoWAPI.Frame

  private index: number = 0
  private height: number = 0
  private width: number = 0

  constructor (private itemsPerRow: number = 4) {
  }

  public add (frame: WoWAPI.Frame) {
    const item = new GridItem(frame, this.index)

    if (this.index !== this.itemsPerRow) {
      this.index++
    } else {
      this.index = 0
    }
  }
}

const grid = new Grid()

// -----

console.log('addon loaded')


