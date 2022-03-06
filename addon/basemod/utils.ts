import { Element } from './frame'
import { Get } from './app'
import { Rgb } from './types'

export function Movable (element: Element<any, any>, defaultPoint: WoWAPI.Point = 'CENTER', defaultX: number = 0, defaultY:number = 0) {
  const app = Get()

  const name = element.ref.GetName()

  let a = app.store.Get('STORE_TYPE_CHARACTER', `${name}-point-a`) || defaultPoint
  let b = app.store.Get('STORE_TYPE_CHARACTER', `${name}-point-b`) || defaultPoint
  let x = app.store.Get('STORE_TYPE_CHARACTER', `${name}-x`) || defaultX
  let y = app.store.Get('STORE_TYPE_CHARACTER', `${name}-y`) || defaultY

  if ((a !== '') && !a) {
    element.ref.SetPoint(defaultPoint, defaultX, defaultY)

    let [a1, _, a3, a4, a5] = element.ref.GetPoint()

    a = a1
    b = a3
    x = a4
    y = a5

    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-a`, a)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-b`, b)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-x`, x)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-y`, y)
  }

  element.ref.EnableMouse(true)
  element.ref.SetMovable(true)
  element.ref.RegisterForDrag('RightButton')

  element.ref.SetScript('OnDragStart', f => f.StartMoving())
  element.ref.SetScript('OnDragStop', f => {
    f.StopMovingOrSizing()

    const point = f.GetPoint()

    let a = point[0]
    let b = point[2]
    let x = point[3]
    let y = point[4]

    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-a`, a)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-point-b`, b)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-x`, x)
    app.store.Set('STORE_TYPE_CHARACTER', `${name}-y`, y)
  })

  element.ref.SetPoint(a, app.root.ref, b, x, y)
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

