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
    .OnClick('LeftButton', e => {
      console.log(e.children.length)
      e.children.forEach(child => console.log(child.ref.GetName()))
    })
    .OnDrag('RightButton')

  const s = Scroll({
    name: 'testscroll',
    size: { width: a.ref.GetWidth(), height: a.ref.GetHeight() },
    parent: a,
    allPoints: a.inner,
    strata: 'MEDIUM',
    z: 3,
  })

  const o = Scroll({ name: 'testscroll' })

  console.log(o.inner.GetName())
})

