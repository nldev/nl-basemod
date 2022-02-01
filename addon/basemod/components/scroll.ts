import { FrameElement, FrameOptions, Component, Frame } from '../component'

export interface ScrollOptions extends FrameOptions {
  scrollHeight?: number
}

export class ScrollElement extends FrameElement<ScrollOptions> {
  protected container: WoWAPI.Frame

  protected init () {
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

    scrollframe.SetScrollChild(scrollchild)
    scrollframe.SetAllPoints(this.ref)
    scrollframe.SetScale(0.667)

    scrollchild.SetSize(scrollframe.GetWidth(), this.options.scrollHeight || (scrollframe.GetHeight() * 2))

    const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)

    moduleoptions.SetAllPoints(scrollchild)
    moduleoptions.SetFrameStrata(this.strata || 'LOW')
    moduleoptions.SetFrameLevel((this.z || 0))

    this.container = moduleoptions
  }
}

export const Scroll: Component<
  ScrollOptions,
  ScrollElement
> = (options = {}) =>
  new ScrollElement(options)

