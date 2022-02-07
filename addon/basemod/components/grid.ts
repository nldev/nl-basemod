import { Get } from '../app'
import { FrameOptions, Component, Element } from '../component'
import { Unique } from '../utils'

export interface GridOptions extends FrameOptions {
  itemsPerRow: number
  rowHeight: number
}

export interface GridItemOptions extends FrameOptions {
  item: Element
}

class GridItemElement extends Element<GridItemOptions> {
  public index: number
  public item: Element

  protected onInit () {
    this.item = this.options.item

    // if (this.strata)
    //   this.item.ref.SetFrameStrata(this.strata)

    // if (this.z)
    //   this.item.ref.SetFrameLevel(this.z)

    this.item.ref.SetParent(this.ref)
    this.item.ref.SetPoint('CENTER')
  }
}

export class GridElement extends Element<GridOptions> {
  protected list: GridItemElement[] = []
  protected index: number = 0
  protected x: number = 0
  protected y: number = 0
  protected itemsPerRow: number = 3

  protected itemWidth: number = 0
  protected rowHeight: number = 0

  protected onInit () {
    this.itemsPerRow = this.options.itemsPerRow
    this.rowHeight = this.options.rowHeight || 100
    this.itemWidth = this.ref.GetWidth() / this.itemsPerRow
  }

  public _Attach (child: Element) {
    if (!this.parent)
      return

    const isEndOfRow = this.index === ((this.itemsPerRow || 3) - 1)

    const element = new GridItemElement(Unique(`${this.id}-griditem`), {
      item: child,
      box: {
        type: 'BOX_POINT',
        point: 'TOPLEFT',
        width: this.itemWidth,
        height: this.rowHeight,
        x: this.x,
        y: this.y,
      }
      // z: (this.z || 0) + 1,
      // strata: this.strata,
      // size: {
      //   height: this.rowHeight,
      //   width: this.itemWidth,
      // },
    })

    element.ref.SetParent(this.ref)

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

export const Grid: Component<GridOptions> = (id, options, children) =>
  Get().elements[id] || new GridElement(id, options, children)

