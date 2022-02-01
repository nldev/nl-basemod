import { FrameElement, FrameOptions, Component, Frame } from '../component'

export interface ScrollOptions extends FrameOptions {
  scrollHeight?: number
}

export class ScrollElement extends FrameElement<ScrollOptions> {
  protected scrollframe: WoWAPI.ScrollFrame

  protected Parent<T extends WoWAPI.Frame = WoWAPI.Frame> (parent: T) {
    this.ref.SetParent(parent)

    this.parent = parent

    return this
  }

  protected init () {
    this.scrollframe = CreateFrame('ScrollFrame', this.name + '-scrollframe', null, 'UIPanelScrollFrameTemplate')

    const scrollchild = CreateFrame('Frame', this.name + '-scrollchild')

    const scrollbarName = this.scrollframe.GetName()

    const scrollbar = _G[scrollbarName + 'ScrollBar']
    const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
    const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

    scrollupbutton.ClearAllPoints()
    scrollupbutton.SetPoint('TOPRIGHT', this.scrollframe, 'TOPRIGHT', -2, -2)

    scrolldownbutton.ClearAllPoints()
    scrolldownbutton.SetPoint('BOTTOMRIGHT', this.scrollframe, 'BOTTOMRIGHT', -2, 2)

    scrollbar.ClearAllPoints()
    scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
    scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

    this.ref.SetSize(this.ref.GetWidth() * 0.667, this.ref.GetHeight() * 0.667)

    this.scrollframe.SetScrollChild(scrollchild)
    this.scrollframe.SetAllPoints(this.ref)
    this.scrollframe.SetScale(0.667)

    scrollchild.SetSize(this.scrollframe.GetWidth(), this.options.scrollHeight || (this.scrollframe.GetHeight() * 2))

    const moduleoptions = CreateFrame('Frame', this.name + '-moduleoptions', scrollchild)

    moduleoptions.SetAllPoints(scrollchild)
    moduleoptions.SetFrameStrata(this.strata || 'LOW')
    moduleoptions.SetFrameLevel((this.z || 0))

    this.Inner(moduleoptions)
  }
}

export const Scroll: Component<
  ScrollOptions,
  ScrollElement
> = options =>
  new ScrollElement(options)

