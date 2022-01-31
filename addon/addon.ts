import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const scroll = Scroll({ name: 'bar' })
    .Point({ point: 'CENTER' })
    .Size(500, 500)
    .Backdrop()
    .Children([
      Frame({}, [
        Frame({}, [
          Frame(),
          Frame(),
          Frame(),
        ]),
      ]),
    ])

  console.log(scroll.ref.GetName())

  scroll.Click('LeftButtonDown', () => console.log('hello'))
})

