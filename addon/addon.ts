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

  console.log(scroll.ref.GetName())
})
  // .Backdrop()
  // .Parent($.root)
  // .Children([
  //   Frame({ prefix: 'hello' }),
  //   Frame({ prefix: 'hello' }),
  //   Frame({ prefix: 'hello' }, [
  //     Frame(null, [
  //       Frame(null, [
  //         Frame(),
  //         Frame(),
  //       ]),
  //     ]),
  //   ]),
  // ])
