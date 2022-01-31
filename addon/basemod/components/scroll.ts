import { Component, FrameComponent, FrameOptions } from '../component'

export interface ScrollOptions extends FrameOptions {
}

export class ScrollComponent extends FrameComponent {
  protected init () {
  }
}

export function Scroll (options: ScrollOptions, children: Component[]) {
  return new ScrollComponent(options)
}

// let a = CreateFrame('Frame', 'a', UIParent)

// a.SetBackdrop({
//   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//   tile: true, tileSize: 16, edgeSize: 16,
//   insets: { left: 4, right: 4, top: 4, bottom: 4 },
// })

// a.SetBackdropColor(0, 0, 0, 1)
// a.SetSize(800, 800)
// a.SetPoint('CENTER')

// a.EnableMouse(true)
// a.RegisterForDrag('RightButton')
// a.SetMovable(true)
// a.SetScript('OnDragStart', f => f.StartMoving())
// a.SetScript('OnDragStop', f => f.StopMovingOrSizing())

// const scrollframe = CreateFrame('ScrollFrame', 'scrollframe', null, 'UIPanelScrollFrameTemplate')
// const scrollchild = CreateFrame('Frame', 'scrollchild')

// const scrollbarName = scrollframe.GetName()

// const scrollbar = _G[scrollbarName + 'ScrollBar']
// const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
// const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

// scrollupbutton.ClearAllPoints()
// scrollupbutton.SetPoint('TOPRIGHT', scrollframe, 'TOPRIGHT', -2, -2)

// scrolldownbutton.ClearAllPoints()
// scrolldownbutton.SetPoint('BOTTOMRIGHT', scrollframe, 'BOTTOMRIGHT', -2, 2)

// scrollbar.ClearAllPoints()
// scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
// scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

// a.SetSize(a.GetWidth() * 0.667, a.GetHeight() * 0.667)

// scrollframe.SetScale(0.667)
// scrollframe.SetScrollChild(scrollchild)

// const b = CreateFrame('Frame', 'b', UIParent)

// b.SetSize(a.GetWidth() * 0.95, a.GetHeight() * 0.95)
// b.SetParent(a)
// b.SetPoint('CENTER')

// scrollframe.SetAllPoints(b)

// scrollchild.SetSize(scrollframe.GetWidth(), (scrollframe.GetHeight() * 2))

// const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)
// moduleoptions.SetAllPoints(scrollchild)

// a.SetFrameLevel(0)
// b.SetFrameLevel(1)
// moduleoptions.SetFrameLevel(2)

