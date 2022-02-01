import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const a = Frame({
    name: 'a',
    size: { width: 300, height: 300 },
    padding: 40,
    point: 'CENTER',
    bg: {},
    z: 2,
    strata: 'LOW',
  })
    .OnClick('LeftButton', () => console.log($.playerInfo.name))
    .OnDrag('RightButton')
    // .OnClick('Middle', frame => frame.Hide())

  const s = Scroll({
    name: 'testscroll',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a.inner,
    allPoints: a.inner,
    strata: 'MEDIUM',
    z: 3,
  })

  const o = Scroll({ name: 'testscroll' })

  console.log(o.inner.GetName())
})

