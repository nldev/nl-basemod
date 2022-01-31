import { render } from './basemod/app'
import { Frame } from './basemod/component'
import { Scroll } from './basemod/components/scroll'

render($ => {
  const scroll = Scroll({ name: 'bar' }, [
    Frame({}, [
      Frame({}, [
        Frame(),
        Frame(),
        Frame(),
      ]),
    ]),
  ])

  scroll.Click('LeftButtonDown', () => console.log('hello'))

  console.log(scroll.ref.GetName())
})

