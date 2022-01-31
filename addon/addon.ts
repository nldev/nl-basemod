import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame()
    .Size(500, 500)
    .Backdrop()
    .Point('CENTER')
    .Padding(50)
    .Execute(() => console.log('ran'))

  a.ref.EnableMouse(true)
  a.ref.RegisterForDrag('RightButton')
  a.ref.SetMovable(true)
  a.ref.SetScript('OnDragStart', f => f.StartMoving())
  a.ref.SetScript('OnDragStop', f => f.StopMovingOrSizing())


  Scroll({ name: 'bar' })
    .Point('CENTER')
    .Parent(a.ref)
    .Size(600, 600)
    .Click('LeftButton', () => console.log($.playerInfo.name))
})


