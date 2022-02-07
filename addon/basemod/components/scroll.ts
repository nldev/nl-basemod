import { Get } from '../app'
import { Component, Element, FrameOptions } from '../component'

export interface ScrollOptions extends FrameOptions {
  scrollHeight?: number
}

export class ScrollElement extends Element<ScrollOptions> {
  protected scrollframe: WoWAPI.ScrollFrame
  protected scrollchild: WoWAPI.Frame
  protected scrollbar: WoWAPI.Frame
  protected scrollupbutton: WoWAPI.Frame
  protected scrolldownbutton: WoWAPI.Frame
  protected moduleoptions: WoWAPI.Frame

  protected scrollHeight: number = this.options.scrollHeight

  protected onInit () {

    this.scrollframe = CreateFrame('ScrollFrame', this.id + '-scrollframe', null, 'UIPanelScrollFrameTemplate')
    this.scrollchild = CreateFrame('Frame', this.id + '-scrollchild')

    const scrollbarName = this.scrollframe.GetName()

    this.scrollbar = _G[scrollbarName + 'ScrollBar']
    this.scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
    this.scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

    this.scrollupbutton.ClearAllPoints()
    this.scrollupbutton.SetPoint('TOPRIGHT', this.scrollframe, 'TOPRIGHT', -2, -2)
    // this.scrollupbutton.SetFrameStrata(this.strata || 'LOW')
    // this.scrollupbutton.SetFrameLevel(this.z || 0)

    this.scrolldownbutton.ClearAllPoints()
    this.scrolldownbutton.SetPoint('BOTTOMRIGHT', this.scrollframe, 'BOTTOMRIGHT', -2, 2)
    // this.scrolldownbutton.SetFrameStrata(this.strata || 'LOW')
    // this.scrolldownbutton.SetFrameLevel(this.z || 0)

    this.scrollbar.ClearAllPoints()
    this.scrollbar.SetPoint('TOP', this.scrollupbutton, 'BOTTOM', 0, -2)
    this.scrollbar.SetPoint('BOTTOM', this.scrolldownbutton, 'TOP', 0, 2)
    // this.scrollbar.SetFrameStrata(this.strata || 'LOW')
    // this.scrollbar.SetFrameLevel(this.z || 0)

    this.scrollframe.SetParent(this.ref)
    this.scrollframe.SetScrollChild(this.scrollchild)
    this.scrollframe.SetAllPoints(this.ref)

    this.scrollHeight = this.options.scrollHeight || (this.scrollframe.GetHeight() * 2)

    this.scrollchild.SetSize(this.ref.GetWidth(), this.scrollHeight)

    this.moduleoptions = CreateFrame('Frame', this.id + '-moduleoptions', this.scrollchild)

    this.moduleoptions.SetAllPoints(this.scrollchild)
    // this.moduleoptions.SetFrameStrata(this.strata || 'LOW')
    // this.moduleoptions.SetFrameLevel(this.z || 0)
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

  protected _Attach (child: Element) {
    child.ref.SetParent(this.moduleoptions)

    if (this.scrollchild)
      child.Box({
        type: 'BOX_POINT',
        point: 'TOPLEFT',
        width: this.scrollchild.GetWidth() - 18,
        height: this.scrollchild.GetHeight(),
      })
  }
}

export const Scroll: Component = (id, options, children) =>
  Get().elements[id] || new ScrollElement(id, options, children)

