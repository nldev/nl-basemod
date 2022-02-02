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

  init () {
    console.log('7')
    this.item = this.options.item
    console.log('8')
    this.index = this.options.index
    console.log('9')
    this.x = this.options.x
    console.log('10')
    this.y = this.options.y
    console.log('11')

    if (this.strata)
      this.item.ref.SetFrameStrata(this.strata)
    console.log('12')

    if (this.z)
      this.item.ref.SetFrameLevel(this.z)
    console.log('13')

    this.item.parent = this
    console.log('14')
    this.item.ref.SetPoint('CENTER')
    console.log('15')

    this.ref.SetPoint('TOPLEFT', this.x, this.y)
    console.log('16')
  }
}

export class GridElement extends FrameElement<GridOptions> {
  protected list: GridItem[] = []
  protected itemWidth: number
  protected index: number = 0
  protected x: number = 0
  protected y: number = 0

  protected itemsPerRow: number
  protected rowHeight: number

  init () {
    console.log('1')
    this.itemsPerRow = this.options.itemsPerRow || 3
    console.log('2')
    this.rowHeight = this.options.rowHeight || 100
    console.log('3')
    this.itemWidth = this.ref.GetWidth() / this.itemsPerRow
    console.log('4')
    this.ref.SetAllPoints(this.parent.inner || this.parent.ref)
    console.log('5')
    console.log('6')
  }

  public Add (item: Element<any, WoWAPI.Frame>) {
    console.log('start')
    const isEndOfRow = this.index === (this.itemsPerRow - 1)

    const element = new GridItem({
      item,
      id: Unique(`${this.id}-griditem`),
      index: this.index,
      x: this.x,
      y: this.y,
      z: this.z + 1,
      parent: this,
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
    console.log('start')
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

