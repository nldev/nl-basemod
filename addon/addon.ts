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

let s = CreateFrame("Frame", null, UIParent)

s.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

s.SetBackdropColor(0, 0, 0, 1)
s.SetSize(800, 800)
s.SetPoint('CENTER')

console.log('now create the template Scroll Frame (this frame must be given a name so that it can be looked up via the _G function (youll see why later on in the code)')
const scrollframe = CreateFrame("ScrollFrame", "ANewScrollFrame", null, "UIPanelScrollFrameTemplate")
//
console.log('create the standard frame which will eventually become the Scroll Frames scrollchild')
console.log('importantly, each Scroll Frame can have only ONE scrollchild')
const scrollchild = CreateFrame("Frame") // ; -- not sure what happens if you do, but to be safe, don't parent this yet (or do anything with it)
//
console.log('define the scrollframes objects/elements:')
const scrollbarName = scrollframe.GetName()
const scrollbar = _G[scrollbarName + "ScrollBar"]
const scrollupbutton = _G[scrollbarName + "ScrollBarScrollUpButton"]
const scrolldownbutton = _G[scrollbarName + "ScrollBarScrollDownButton"]
//
console.log('all of these objects will need to be re-anchored (if not, they appear outside the frame and about 30 pixels too high)')
scrollupbutton.ClearAllPoints()
scrollupbutton.SetPoint("TOPRIGHT", scrollframe, "TOPRIGHT", -2, -2)
//
scrolldownbutton.ClearAllPoints()
scrolldownbutton.SetPoint("BOTTOMRIGHT", scrollframe, "BOTTOMRIGHT", -2, 2)
//
scrollbar.ClearAllPoints()
scrollbar.SetPoint("TOP", scrollupbutton, "BOTTOM", 0, -2)
scrollbar.SetPoint("BOTTOM", scrolldownbutton, "TOP", 0, 2)
//
console.log('now officially set the scrollchild as your Scroll Frames scrollchild (this also parents self.scrollchild to self.scrollframe)')
console.log('IT IS IMPORTANT TO ENSURE THAT YOU SET THE SCROLLCHILDS SIZE AFTER REGISTERING IT AS A SCROLLCHILD:')
scrollframe.SetScrollChild(scrollchild)
//
console.log('set self.scrollframe points to the first frame that you created (in this case, self)')
scrollframe.SetAllPoints(s)

console.log('now that SetScrollChild has been defined, you are safe to define your scrollchilds size. Would make sense to make its height > scrollframes height,')
console.log('otherwise theres no point having a scrollframe!')
console.log('note: you may need to define your scrollchilds height later on by calculating the combined height of the content that the scrollchilds child holds.')
console.log('(see the bit below about showing content).')

scrollchild.SetSize(scrollframe.GetWidth(), (scrollframe.GetHeight() * 2))
//
//
console.log('THE SCROLLFRAME IS COMPLETE AT THIS POINT.  THE CODE BELOW DEMONSTRATES HOW TO SHOW DATA ON IT.')
//
//
console.log('you need yet another frame which will be used to parent your widgets etc to.  This is the frame which will actually be seen within the Scroll Frame')
console.log('It is parented to the scrollchild.  I like to think of scrollchild as a sort of pin-board that you can pin a piece of paper to (or take it back off)')
const moduleoptions = CreateFrame("Frame", null, scrollchild)
moduleoptions.SetAllPoints(scrollchild)
//
console.log('a good way to immediately demonstrate the new scrollframe in action is to do the following...')
//
console.log('create a fontstring or a texture or something like that, then place it at the bottom of the frame that holds your info (in this case self.moduleoptions)')
const fs = moduleoptions.CreateFontString(null, 'OVERLAY', 'GameTooltipText')

console.log('settext')
fs.SetText("This is a test.")
console.log('setpoint')
fs.SetPoint("BOTTOMLEFT", moduleoptions, "BOTTOMLEFT", 20, 60)
//
console.log('you should now need to scroll down to see the text "This is a test.";')

// -----

console.log('addon loaded')


