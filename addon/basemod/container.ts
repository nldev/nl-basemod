import '../global'

interface PlayerInfo {
  name: string
}

export class Container {
  constructor () {
    console.log('got here')
    this.load()
  }

  load () {
    const player = UnitGUID('player')

    if (!player)
      return this.load()

    const info = GetPlayerInfoByGUID(player)

    if (!info[0])
      return this.load()

      console.log('got here again')

    return this.ready()
  }

  ready () {
    console.log('got to ready state')
  }
}
