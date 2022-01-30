import { Container } from '.'

export function App ($: Container) {
  const { name, level, chrRace, chrClass } = $.playerInfo

  console.log(`name: ${name}`)
  console.log(`level: ${level}`)
  console.log(`chrRace: ${chrRace}`)
  console.log(`chrClass: ${chrClass}`)
}
