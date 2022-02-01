// import { Unique } from "../utils"
import { FrameElement, FrameOptions, Component, Frame } from '../component'

interface GridOptions extends FrameOptions {
  itemsPerRow: number
  rowHeight: number
  gridHeight: number
  gridWidth: number
}

class Grid extends FrameElement<GridOptions> {
// protected list: GridItem[] = []
  protected itemWidth: number
  protected index: number = 0
  protected x: number = 0
  protected y: number = 0

  protected itemsPerRow: number
  protected rowHeight: number

  protected init () {
    this.itemsPerRow = this.options.itemsPerRow || 3
    this.rowHeight = this.options.rowHeight || 100
    this.itemWidth = this.ref.GetWidth() / this.itemsPerRow
  }

  public Add () {
  }
}

//interface IGridItem {
//  parent: WoWAPI.Frame
//  child: WoWAPI.Frame
//  index: number
//  height: number
//  width: number
//  x: number
//  y: number
//}

//class GridItem {
//  public frame: WoWAPI.Frame

//  constructor (public params: IGridItem) {
//    this.frame = CreateFrame('Frame', Unique('griditem'), this.params.parent)

//    // this.frame.SetBackdrop({
//    //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//    //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//    //   tile: true, tileSize: 16, edgeSize: 16,
//    //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
//    // })

//    // this.frame.SetBackdropColor(0, 0, 0, 1)
//    this.frame.SetSize(this.params.width, this.params.height)
//    this.frame.SetPoint('TOPLEFT', this.params.x, this.params.y)
//    this.frame.SetParent(this.params.parent)

//    this.params.child.SetParent(this.frame)
//    this.params.child.SetPoint('CENTER')
//  }
//}

//interface IGrid {
//  itemsPerRow: number
//  rowHeight: number
//  gridHeight: number
//  gridWidth: number
//}

//type GridOptions = Partial<IGrid>

//const DEFAULT_GRID_OPTIONS: IGrid = {
//  itemsPerRow: 4,
//  rowHeight: 100,
//  gridHeight: 400,
//  gridWidth: 450,
//}
//class Grid {
//  private list: GridItem[]
//  public frame: WoWAPI.Frame
//  public params: IGrid

//  public itemWidth: number

//  public index: number = 0
//  public x: number = 0
//  public y: number = 0

//  constructor (options: GridOptions = DEFAULT_GRID_OPTIONS) {
//    this.params = { ...DEFAULT_GRID_OPTIONS, ...options }

//    this.itemWidth = this.params.gridWidth / this.params.itemsPerRow

//    this.frame = CreateFrame('ScrollFrame', 'grid', UIParent)

//    // this.frame.SetBackdrop({
//    //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//    //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//    //   tile: true, tileSize: 16, edgeSize: 16,
//    //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
//    // })

//    // this.frame.SetBackdropColor(0, 0, 0, 1)

//    this.frame.SetSize(this.params.gridWidth, this.params.gridHeight)
//    this.frame.SetPoint('CENTER')
//  }

//  public add (frame: WoWAPI.Frame) {
//    const isEndOfRow = this.index === (this.params.itemsPerRow - 1)

//    new GridItem({
//      parent: this.frame,
//      child: frame,
//      index: this.index,
//      height: this.params.rowHeight,
//      width: this.itemWidth,
//      x: this.x,
//      y: this.y,
//    })

//    if (isEndOfRow) {
//      this.index = 0
//      this.x = 0
//      this.y -= this.params.rowHeight
//    } else {
//      this.index++
//      this.x += this.itemWidth
//    }

//    // this.list.push(item)
//    // console.log('pushed to list')
//  }
//}


