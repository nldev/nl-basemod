// import { Unique } from "../utils"
import { FrameElement, FrameOptions, Component, Element, CreateElement } from '../component'
import { Unique } from '../utils'

export interface GridOptions extends FrameOptions {
  itemsPerRow: number
  rowHeight: number
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

  protected init () {
    this.item = this.options.item
    this.index = this.options.index
    this.x = this.options.x
    this.y = this.options.y

    if (this.strata)
      this.item.ref.SetFrameStrata(this.strata)

    if (this.z)
      this.item.ref.SetFrameLevel(this.z)

    this.item.parent = this

    this.ref.SetPoint('TOPLEFT', this.x, this.y)
    this.item.ref.SetPoint('CENTER')
  }
}

export class GridElement extends FrameElement<GridOptions> {
  protected list: GridItem[] = []
  protected index: number = 0
  protected x: number = 0
  protected y: number = 0

  protected itemWidth: number
  protected itemsPerRow: number
  protected rowHeight: number

  protected init () {
    this.ref.SetAllPoints(this.parent.inner || this.parent.ref)
    this.itemsPerRow = this.options.itemsPerRow || 3
    this.rowHeight = this.options.rowHeight || 100
  }

  public Add (item: Element<any, WoWAPI.Frame>) {
    this.itemWidth = this.ref.GetWidth() / this.itemsPerRow

    const isEndOfRow = this.index === (this.itemsPerRow - 1)

    const element = new GridItem({
      item,
      id: Unique(`${this.id}-griditem`),
      index: this.index,
      parent: this,
      x: this.x,
      y: this.y,
      z: (this.z || 0) + 1,
      strata: this.strata,
      size: {
        height: this.rowHeight,
        width: this.itemWidth,
      },
    })

    // const ref = item.inner || item.ref

    // item.ref.SetFrameStrata(this.strata)
    // item.ref.SetFrameLevel(this.z)

    // if (item.inner) {
    //   item.ref.SetFrameStrata(this.strata)
    //   item.ref.SetFrameLevel(this.z)
    // }

    // ref.SetFrameStrata(this.strata)
    // ref.SetFrameLevel(this.z)

    if (isEndOfRow) {
      this.index = 0
      this.x = 0
      this.y -= (this.rowHeight * 2)
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

export const Grid: Component<GridOptions, GridElement> = options =>
    CreateElement(options, options => new GridElement(options))

