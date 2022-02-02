// import { Unique } from "../utils"
import { FrameElement, FrameOptions, Component, Frame, Element } from '../component'
import { Unique } from '../utils'

export interface GridOptions extends FrameOptions {
  itemsPerRow: number
  rowHeight: number
  gridHeight: number
  gridWidth: number
}

export interface GridItemOptions extends FrameOptions {
  // parent: Element<any, any>
  // inner: Element<any, any>
  item: Element<any, WoWAPI.Frame>
  index: number
  x: number
  y: number
}

class GridItem extends FrameElement<GridItemOptions> {
  public index: number
  public item: Element<any, WoWAPI.Frame>

  protected x: number
  protected y: number

  init () {
    this.item = this.options.item
    this.index = this.options.index
    this.x = this.options.x
    this.y = this.options.y


    if (this.strata)
      this.item.ref.SetFrameStrata(this.strata)

    if (this.z)
      this.item.ref.SetFrameLevel(this.z)

    this.item.parent = this
    this.item.ref.SetPoint('CENTER')
    // this.params.child.SetParent(this.frame)
    // this.params.child.SetPoint('CENTER')

    // this.frame.SetSize(this.params.width, this.params.height)
    // this.frame.SetParent(this.params.parent)
    this.ref.SetPoint('TOPLEFT', this.x, this.y)

  }
}

export class Grid extends FrameElement<GridOptions> {
  protected list: GridItem[] = []
  protected itemWidth: number
  protected index: number = 0
  protected x: number = 0
  protected y: number = 0

  protected itemsPerRow: number
  protected rowHeight: number

  init () {
    this.itemsPerRow = this.options.itemsPerRow || 3
    this.rowHeight = this.options.rowHeight || 100
    this.itemWidth = this.ref.GetWidth() / this.itemsPerRow
  }

  public Add (item: Element<any, WoWAPI.Frame>) {
    const isEndOfRow = this.index === (this.itemsPerRow - 1)

    const element = new GridItem({
      item,
      id: Unique(`${this.id}-griditem`),
      index: this.index,
      x: this.x,
      y: this.y,
      z: this.z + 1,
      strata: this.strata,
      size: {
        height: this.rowHeight,
        width: this.itemWidth,
      },
    })

    if (isEndOfRow) {
      this.index = 0
      this.x = 0
      this.y -= this.rowHeight
    } else {
      this.index++
      this.x += this.itemWidth
    }

    this.list.push(element)
  }

  onShow () {
    this.list.forEach(item => item.Show(true))
  }

  onHide () {
    this.list.forEach(item => item.Hide(true))
  }
}

