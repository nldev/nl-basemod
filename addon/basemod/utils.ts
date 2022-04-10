import { Element } from './app'
import { Get } from './app'
import { Rgb } from './types'

export function Movable (element: Element<any, any>, defaultItemPoint: WoWAPI.Point = 'CENTER', defaultParentPoint: WoWAPI.Point = 'CENTER', defaultX: number = 0, defaultY:number = 0) {
  const $ = Get()

  const name = element.ref.GetName()

  let a = $.store.Get('CHARACTER', `${name}-point-a`) || defaultItemPoint
  let b = $.store.Get('CHARACTER', `${name}-point-b`) || defaultParentPoint
  let x = $.store.Get('CHARACTER', `${name}-x`) || defaultX
  let y = $.store.Get('CHARACTER', `${name}-y`) || defaultY

  if ((a !== '') && !a) {
    const parent: WoWAPI.Frame = element.ref.GetParent() as any
    element.ref.SetPoint(defaultItemPoint, parent, defaultParentPoint, defaultX, defaultY)

    let [a1, _, a3, a4, a5] = element.ref.GetPoint()

    a = a1
    b = a3
    x = a4
    y = a5

    $.store.Set('CHARACTER', `${name}-point-a`, a)
    $.store.Set('CHARACTER', `${name}-point-b`, b)
    $.store.Set('CHARACTER', `${name}-x`, x)
    $.store.Set('CHARACTER', `${name}-y`, y)
  }

  element.ref.EnableMouse(true)
  element.ref.SetMovable(true)
  element.ref.RegisterForDrag('RightButton')

  element.ref.HookScript('OnDragStart', f => f.StartMoving())
  element.ref.HookScript('OnDragStop', f => {
    f.StopMovingOrSizing()

    const point = f.GetPoint()

    let a = point[0]
    let b = point[2]
    let x = point[3]
    let y = point[4]

    $.store.Set('CHARACTER', `${name}-point-a`, a)
    $.store.Set('CHARACTER', `${name}-point-b`, b)
    $.store.Set('CHARACTER', `${name}-x`, x)
    $.store.Set('CHARACTER', `${name}-y`, y)
  })

  element.ref.SetPoint(a, $.root.ref, b, x, y)
}

export const AllChildren = (frame: WoWAPI.Frame, list: WoWAPI.Frame[] = []) => {
  if (frame && frame.GetChildren) {
    frame.GetChildren().forEach(f => {
      list.push(f as any)
      AllChildren(f as any, list)
    })
  }

  return list
}

const names = {}

export function Unique (id: string) {
  const _id = names[id] ? names[id] : 0

  if (_id === 0) {
    names[id] = 0
  }

  names[id]++

  return `${id}-${_id}`
}

export function rgb (red: number, green: number, blue: number): Rgb {
  return [red / 255, green / 255, blue / 255]
}

const turnSpeed = 34  // bigger = slower
const dragSpeed = 100 // bigger = slower
const zoomSpeed = 0.5 // smaller = slower
export function SetupModelZoomDragRotation(model: WoWAPI.DressUpModel) {
  model.SetPosition(0, 0, 0)
  model.EnableMouse(true)
  model.EnableMouseWheel(true)
  model.SetScript('OnMouseDown', function (self, button) {
    let startPos = GetCursorPosition()
    if (button == 'LeftButton') {
      model.SetScript('OnUpdate', function (self: WoWAPI.DressUpModel) {
        let curX = GetCursorPosition()[0]
        self.SetFacing((curX - startPos[0]) / turnSpeed + self.GetFacing())
        startPos[0] = curX
      })
    } else if (button == 'RightButton') {
      model.SetScript('OnUpdate', function (self: WoWAPI.DressUpModel) {
        let cursorPos = GetCursorPosition()
        let pos = self.GetPosition()
        pos[1] = (cursorPos[0] - startPos[0]) / dragSpeed + pos[1]
        pos[2] = (cursorPos[1] - startPos[1]) / dragSpeed + pos[2]
        self.SetPosition(pos[0], pos[1], pos[2])
        startPos[0] = cursorPos[0]
        startPos[1] = cursorPos[1]
      });
    }
  })
  model.SetScript('OnMouseUp', function (self: WoWAPI.DressUpModel, button) {
      self.SetScript('OnUpdate', null)
  })
  model.SetScript('OnMouseWheel', function (self: WoWAPI.DressUpModel, zoom) {
      let pos = model.GetPosition();
      if (zoom == 1) {
          pos[0] += zoomSpeed
      } else {
          pos[0] -= zoomSpeed
      }
      self.SetPosition(pos[0], pos[1], pos[2])
  })
}
