import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({
    size: { width: 300, height: 300 },
    z: 2,
    bg: {},
    color: {},
    point: 'CENTER',
    onClick: { type: 'LeftButton', handler: () => console.log($.playerInfo.name) },
    onDrag: { type: 'RightButton' },
  })
  .Padding(60)
  .Z(2)

  a.ref.SetFrameStrata('BACKGROUND')
  a.inner.SetFrameStrata('BACKGROUND')

  const s = Scroll({
    name: 'bar',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a.inner,
    allPoints: a.inner,
  })
  .Z(5)

  s.ref.SetFrameStrata('HIGH')
})

