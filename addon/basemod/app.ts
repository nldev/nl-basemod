import { foo } from './foo'

export const App = () => {
    foo.push('hello')
}

console.log(foo[0])
