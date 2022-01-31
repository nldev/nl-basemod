import { FrameElement, FrameOptions, Component, Frame } from '../component'

export interface ScrollOptions extends FrameOptions {}

export class ScrollElement extends FrameElement {
  protected create () {
    this.ref = CreateFrame('ScrollFrame', this.name, this.parent)
  }

  protected init () {
    // a.SetBackdrop({
    //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    //   tile: true, tileSize: 16, edgeSize: 16,
    //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
    // })

    this.ref.EnableMouse(true)
    this.ref.RegisterForDrag('RightButton')
    this.ref.SetMovable(true)
    this.ref.SetScript('OnDragStart', f => f.StartMoving())
    this.ref.SetScript('OnDragStop', f => f.StopMovingOrSizing())

    const scrollframe = CreateFrame('ScrollFrame', 'scrollframe', null, 'UIPanelScrollFrameTemplate')
    const scrollchild = CreateFrame('Frame', 'scrollchild')

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

    this.ref.SetSize(this.ref.GetWidth() * 0.667, this.ref.GetHeight() * 0.667)

    scrollframe.SetScale(0.667)
    scrollframe.SetScrollChild(scrollchild)

    const b = CreateFrame('Frame', 'b', this.ref)

    b.SetSize(this.ref.GetWidth() * 0.95, this.ref.GetHeight() * 0.95)
    b.SetParent(this.ref)
    b.SetPoint('CENTER')

    scrollframe.SetParent(b)
    scrollframe.SetAllPoints(b)

    scrollchild.SetSize(scrollframe.GetWidth(), (scrollframe.GetHeight() * 2))

    const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)
    moduleoptions.SetAllPoints(scrollchild)

    this.ref.SetFrameLevel(0)
    b.SetFrameLevel(1)
    moduleoptions.SetFrameLevel(2)

    const c = Frame({ name: 'test', parent: moduleoptions })

    c.Size(500, 1000)

    console.log('hello')
  }
}

export const Scroll: Component<
  ScrollOptions,
  ScrollElement
> = (options = {}, children) =>
  new ScrollElement(options, children)

