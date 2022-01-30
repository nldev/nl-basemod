import '../global'
import { Root } from './root'

export class UI {
  public root: Root

  constructor (public onLoad: (ui: UI) => void) {
    this.root = new Root(this.init)
  }

  init () {
    this.onLoad(this)
  }
}
