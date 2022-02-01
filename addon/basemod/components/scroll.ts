import { FrameElement, FrameOptions, Component, Frame, CreateElement } from '../component'

export interface ScrollOptions extends FrameOptions {
  scrollHeight?: number
}

export class ScrollElement extends FrameElement<ScrollOptions> {
  protected scrollframe: WoWAPI.ScrollFrame
  protected scrollchild: WoWAPI.Frame
  protected scrollbar: WoWAPI.Frame
  protected scrollupbutton: WoWAPI.Frame
  protected scrolldownbutton: WoWAPI.Frame
  protected moduleoptions: WoWAPI.Frame

  init () {
    this.scrollframe = CreateFrame('ScrollFrame', this.id + '-scrollframe', null, 'UIPanelScrollFrameTemplate')
    this.scrollchild = CreateFrame('Frame', this.id + '-scrollchild')

    const scrollbarName = this.scrollframe.GetName()

    this.scrollbar = _G[scrollbarName + 'ScrollBar']
    this.scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
    this.scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

    this.scrollupbutton.ClearAllPoints()
    this.scrollupbutton.SetPoint('TOPRIGHT', this.scrollframe, 'TOPRIGHT', -2, -2)
    this.scrollupbutton.SetFrameStrata(this.strata || 'LOW')
    this.scrollupbutton.SetFrameLevel(this.z || 0)

    this.scrolldownbutton.ClearAllPoints()
    this.scrolldownbutton.SetPoint('BOTTOMRIGHT', this.scrollframe, 'BOTTOMRIGHT', -2, 2)
    this.scrolldownbutton.SetFrameStrata(this.strata || 'LOW')
    this.scrolldownbutton.SetFrameLevel(this.z || 0)

    this.scrollbar.ClearAllPoints()
    this.scrollbar.SetPoint('TOP', this.scrollupbutton, 'BOTTOM', 0, -2)
    this.scrollbar.SetPoint('BOTTOM', this.scrolldownbutton, 'TOP', 0, 2)
    this.scrollbar.SetFrameStrata(this.strata || 'LOW')
    this.scrollbar.SetFrameLevel(this.z || 0)

    this.ref.SetSize(this.ref.GetWidth() * 0.667, this.ref.GetHeight() * 0.667)

    this.scrollframe.SetScrollChild(this.scrollchild)
    this.scrollframe.SetAllPoints(this.ref)
    this.scrollframe.SetScale(0.667)

    this.scrollchild.SetSize(this.scrollframe.GetWidth(), this.options.scrollHeight || (this.scrollframe.GetHeight() * 2))

    this.moduleoptions = CreateFrame('Frame', this.id + '-moduleoptions', this.scrollchild)

    this.moduleoptions.SetAllPoints(this.scrollchild)
    this.moduleoptions.SetFrameStrata(this.strata || 'LOW')
    this.moduleoptions.SetFrameLevel(this.z || 0)

    this.Inner(this.moduleoptions)
  }

  onShow () {
    this.scrollframe.Show()
    this.scrollchild.Show()
    this.scrollupbutton.Show()
    this.scrolldownbutton.Show()
    this.moduleoptions.Show()
  }

  onHide () {
    this.scrollframe.Hide()
    this.scrollchild.Hide()
    this.scrollupbutton.Hide()
    this.moduleoptions.Hide()
  }
}

export const Scroll: Component<ScrollOptions, ScrollElement> = options =>
    CreateElement(options, options => new ScrollElement(options))

