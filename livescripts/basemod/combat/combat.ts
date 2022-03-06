function Stampede () {
  // triggered from player distance
  // 0.75 second cast -> charge towards target location
  // normal aoe: knockdown on location
}

function Echo () {
  // triggered when attackers are within melee
  // 1 second cast -> intididating shout
}

function BreatheFire () {
  // triggered when attackers are within melee
  // 0.75 second cast -> fire damage in cone
}

function Volley () {
  // triggered when idle
  // 0.75 second cast -> magic school homing missile
}

function LeapStrike () {
  // triggered when player is casting
  // 0.75 second cast -> leap towards caster location
  // cleave aoe: one interrupt + school lockout (cleave animation)
}

function AttackFromDistance () {
  // triggered when player is casting
  // 0.75 second cast -> leap towards caster location
  // cleave aoe: one interrupt + school lockout (cleave animation)
}

function CastFromDistance () {
  // triggered when player is casting
  // 0.75 second cast -> leap towards caster location
  // cleave aoe: one interrupt + school lockout (cleave animation)
}

export function Combat (events: TSEvents) {
  events.Creatures.OnJustEnteredCombat((creature, target) => {
    creature.AddTimer(30, -1, (owner, timer) => {
      const c = owner.ToCreature()
      if (c.IsNull())
        timer.Stop()
    })
  })
  // TODO: call combat db
  // TODO: map npc combat to map dictionary
  // events.Maps.OnCreate(map => {
  //   const list = new TSJsonArray()
  //   map.SetJsonArray('', list)
  // })
  // events.Player.OnLogin(player => {
  //   const json = new TSJsonObject()
  //   const map = player.GetMap()
  //   const o = map.GetObject('foo', json)
  //   player.SendBroadcastMessage(o.GetString('test'))
  // })
}

