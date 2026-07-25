import { avatars, enemies } from "../components/data.js";
const zones = ['Head', 'Neck', 'Body', 'Belly', 'Legs'];
function createStore(initialState){
  let state = initialState;
  const listeners = [];
  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if(index > -1) listeners.splice(index, 1);
      };
    },
    dispatch: (stateOrFunction) => {
      const nextState = typeof stateOrFunction === 'function' 
      ? stateOrFunction(state) : state;
      if(nextState !== state){
        state = nextState;
      }
      listeners.forEach((listener) => {
        listener(state);
      })
    } 
  }
}
export function buildBattle(){
  const enemyIndex = Math.floor(Math.random() * enemies.length); 
  const selectedEnemy = enemies[enemyIndex];
  const enemyAvatar = avatars[selectedEnemy.name.toUpperCase()];
  const defaultState = {
    player: {
      name: JSON.parse(localStorage.getItem('name')),
      maxHp: 150,
      currentHp: 150,
      damage: 10,
      attacks: 1,
      avatar: avatars[JSON.parse(localStorage.getItem('avatar'))],
    },
    enemy: {
      name: selectedEnemy.name,
      maxHp: selectedEnemy.hp,
      currentHp: selectedEnemy.hp,
      avatar: enemyAvatar,
      attacks: selectedEnemy.attacks,
      defences: selectedEnemy.defences,
      damage: selectedEnemy.damage,
    },
    currentTurnChoice:{
      attackZone: null,
      heroDefences: [],
    },
    log: [],
    newLog: [],
    isGameOver: false,
  }
 
  const main = document.querySelector('#main');
  main.className = 'battle';
  main.innerHTML = `
    <div class='game-field'>

      <div class='character hero'>
        <span class='char-name'>${defaultState.player.name}</span>
        <div class='char-image-wrapper'>
          <img src='${defaultState.player.avatar}' alt='character image'>
        </div>
        <div data-char='hero' class='progress-bar'></div>
        <span class='progress-num'></span>
      </div>

      <div class='gameplay'>
        <span class='game-instruction'>Please pick 1 Attack zone and 2 Defence zones</span>
        <div class='game-panel'>
          <div class='attack-zones-block zones-block'>
            <span class='attack-zones zones-title'>Attack Zones</span>
            <div class='radio-buttons-block'>
              <div class='radio-button-left'>
                <label for='head'>Head</label>
                <input data-zone='attack' type='radio' value='Head'>
              </div>
              <div class='radio-button-left'>
                <label for='neck'>Neck</label>
                <input data-zone='attack' type='radio' value='Neck'>
              </div>
              <div class='radio-button-left'>
                <label for='body'>Body</label>
                <input data-zone='attack' type='radio' value='Body'>
              </div>
              <div class='radio-button-left'>
                <label for='belly'>Belly</label>
                <input data-zone='attack' type='radio' value='Belly'>
              </div>
              <div class='radio-button-left'>
                <label for='legs'>Legs</label>
                <input data-zone='attack' type='radio' value='Legs'>
              </div>
            </div>
          </div>
          <span class='separator'></span>
          <div class='defence-zones-block zones-block'>
            <span class='defence-zones zones-title'>Defence Zones</span>
            <div class='radio-buttons-block'>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='Head'>
                <label for='head'>Head</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='Neck'>
                <label for='neck'>Neck</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='Body'>
                <label for='body'>Body</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='Belly'>
                <label for='belly'>Belly</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='Legs'>
                <label for='legs'>Legs</label>
              </div>
            </div>
          </div>
        </div>
        <button class='button-attack disabled' disabled>Attack!</button>
      </div>
      
      <div class='character enemy'>
        <span class='char-name'>${defaultState.enemy.name}</span>
        <div class='char-image-wrapper'>
          <img src='${defaultState.enemy.avatar}' alt='character image'>
        </div>
        <div data-char='hero' class='progress-bar'></div>
        <span class='progress-num'></span>
      </div>

    </div>
    <div id='log-field' class='log-field'></div>
  `;

  const savedState = localStorage.getItem('game_state');
  const state = savedState ? JSON.parse(savedState) : defaultState;
  const gameplay = main.querySelector('.gameplay');
  const attackButton = gameplay.querySelector('.button-attack');
  let heroAttacks = [];
  let heroDefences = [];
  gameplay.addEventListener('click', (e) => {
    const radioButton = e.target.closest('input[type="radio"]');
    if(!radioButton) return;
    if(!radioButton.dataset.isChosen){
      radioButton.dataset.isChosen = 'true';
      radioButton.checked = true;
    } else if(radioButton.dataset.isChosen === 'true'){
      radioButton.dataset.isChosen = 'false';
      radioButton.checked = false;
    } else{
      radioButton.dataset.isChosen = 'true';
      radioButton.checked = true;
    }
    if(radioButton.checked){
      if(radioButton.dataset.zone === 'attack'){
      heroAttacks.push(radioButton.value);
      } else {
        heroDefences.push(radioButton.value);
      }
    } else{
      if(radioButton.dataset.zone === 'attack'){
      heroAttacks.pop(radioButton.value);
      } else {
        heroDefences.pop(radioButton.value);
      }
    }
    

    if(heroAttacks.length === 1 && heroDefences.length === 2){
      attackButton.disabled = false;
      attackButton.classList.remove('disabled');
    } else{
      attackButton.disabled = true;
      attackButton.classList.add('disabled');
    }
  });
  
  const store = createStore(defaultState);
  store.subscribe(renderBattle);
  
  attackButton.addEventListener('click', () => {
    console.log(heroAttacks, heroDefences);
    store.dispatch((currentState) => {
      const hero = currentState.player;
      let heroHp = hero.currentHp;
      const enemy = currentState.enemy;
      let enemyHp = enemy.currentHp;
      const enemyAttacks = [];
      const enemyDefences = [];
      while (enemyAttacks.length !== enemy.attacks){
          const zone = zones[Math.floor(Math.random() * zones.length)];
          if(!enemyAttacks.includes(zone)){
            enemyAttacks.push(zone);
          }
        }
      while (enemyDefences.length !== enemy.defences){
          const zone = zones[Math.floor(Math.random() * zones.length)];
          if(!enemyDefences.includes(zone)){
            enemyDefences.push(zone);
          }
        }
      function attack(attacker, attackerAttacks, attackerDefences, opponent, opponentHp, opponentDefeces){

        const attackLogs = attackerAttacks.map((attack) => {
          let damage = attacker.damage;
          console.log(`${attacker} attacks to ${attack}  but opponents's defences are ${opponentDefeces}`);
          if(Math.floor(Math.random() * 15) === 14){
            damage = damage + 10;
            opponentHp = opponentHp - damage;
            return `${attacker.name} attacked 
            ${opponent.name} to ${attack} and 
            crit ${damage} damage`.replace(/\s+/g, ' ');
          }
          else if(!opponentDefeces.includes(attack)){
            opponentHp = opponentHp - damage;
            return `${attacker.name} attacked 
            ${opponent.name} to ${attack} and 
            deal ${damage} damage`.replace(/\s+/g, ' ');
          } else{
            return `${attacker.name} attacked 
            ${opponent.name} to ${attack} but 
            ${opponent.name} was able to protect his ${attack}`.replace(/\s+/g, ' ');
          }
        });
        return [attackLogs, opponentHp];
      }
      let heroAttackLogs = null;
      [heroAttackLogs, enemyHp] = attack(hero, heroAttacks, heroDefences, enemy, enemyHp, enemyDefences);
      let enemyAttackLogs = null;
      [enemyAttackLogs, heroHp] = attack(enemy, enemyAttacks, enemyDefences, hero, heroHp, heroDefences);
      const generalLog = currentState.log;
      const newLog = [...heroAttackLogs, ...enemyAttackLogs];
      generalLog.push(...heroAttackLogs, ...enemyAttackLogs);
      return {
        ...currentState,
        player: {
          ...currentState.player,
          currentHp: heroHp,
        },
        enemy: {
          ...currentState.enemy,
          currentHp: enemyHp,
        },
        log: generalLog,
        newLog: newLog,
        //isGameOver: 
      }
    });
  });
}

function renderBattle(state){
  console.log(state);
  const logField = document.getElementById('log-field');
  state.newLog.values().forEach((log) => {
    const spanLog = document.createElement('span');
    spanLog.classList.add('span-log');
    const arr = log.split(' ');
    console.log(arr);
    arr.forEach((word, index) => {
      const spanWord = document.createElement('span');
      spanWord.textContent = word + ' ';
      spanWord.classList.add('span-word');
      if([0,2,4].includes(index)){
        spanWord.classList.add('blue-text');
      } else if(arr.includes('crit') && (index === arr.length - 1
        || index === arr.length - 2)){
        spanWord.classList.add('pink-text');
      } else if(arr.includes('damage') && (index === arr.length - 1
        || index === arr.length - 2)){
        spanWord.classList.add('bold-text');
      }
      spanLog.appendChild(spanWord);
    });
    logField.appendChild(spanLog);
  });
}