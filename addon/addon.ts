import { render } from './basemod/app'
import { Frame } from './basemod/component'
// import { Scroll } from './basemod/components/scroll'

console.log('helo one!')

render($ => Frame({ name: 'bar' })
  // .Point('CENTER')
  // .Size(500, 500)
  // .Backdrop()
  // .Children([
  //   Frame({}, [
  //     Frame({}, [
  //       Frame(),
  //       Frame(),
  //       Frame(),
  //     ]),
  //   ]),
  // ])
  // .Click('LeftButtonDown', () => console.log('hello'))
  // .Run(() => console.log('hello world'))
)

console.log('helo!')
