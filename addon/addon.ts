import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({
    size: { width: 300, height: 300 },
    padding: 40,
    point: 'CENTER',
    bg: {},
    z: 2,
    strata: 'LOW',
  })
    .OnClick('LeftButton', () => console.log($.playerInfo.name))
    .OnDrag('RightButton')

  const s = Scroll({
    name: 'bar',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a.inner,
    allPoints: a.inner,
    strata: 'MEDIUM',
    z: 3,
  })


  const test = Frame({
    size: { width: 50, height: 50 },
    color: { red: 1 },
    bg: {},
    z: 4,
    parent: s.inner,
    point: 'CENTER',
    strata: 'HIGH',
  })
})

