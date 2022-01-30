import '../global'

interface PlayerInfo {
  name: string

}
class Container {
  constructor () {
  }

  load () {
    const player = UnitGUID('player')

    if (!player)
      return this.load()

    const info = GetPlayerInfoByGUID(player)

    if (!info[0])
      return this.load()

    return this.ready()
  }

  ready () {
    console.log('got to ready state')
  }
}
