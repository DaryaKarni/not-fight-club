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
      avatar: avatars[JSON.parse(localStorage.getItem('avatar'))],
    },
    enemy: {
      name: selectedEnemy.name,
      maxHp: selectedEnemy.hp,
      currentHp: selectedEnemy.hp,
      avatar: enemyAvatar,
      defenceCount: selectedEnemy.defences,
    },
    currentTurnChoice:{
      attackZone: null,
      defenceZones: [],
    },
    log: [],
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
                <input data-zone='attack' type='radio' value='head'>
              </div>
              <div class='radio-button-left'>
                <label for='neck'>Neck</label>
                <input data-zone='attack' type='radio' value='neck'>
              </div>
              <div class='radio-button-left'>
                <label for='body'>Body</label>
                <input data-zone='attack' type='radio' value='body'>
              </div>
              <div class='radio-button-left'>
                <label for='belly'>Belly</label>
                <input data-zone='attack' type='radio' value='belly'>
              </div>
              <div class='radio-button-left'>
                <label for='legs'>Legs</label>
                <input data-zone='attack' type='radio' value='legs'>
              </div>
            </div>
          </div>
          <span class='separator'></span>
          <div class='defence-zones-block zones-block'>
            <span class='defence-zones zones-title'>Defence Zones</span>
            <div class='radio-buttons-block'>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='head'>
                <label for='head'>Head</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='neck'>
                <label for='neck'>Neck</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='body'>
                <label for='body'>Body</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='belly'>
                <label for='belly'>Belly</label>
              </div>
              <div class='radio-button-right'>
                <input data-zone='defence' type='radio' value='legs'>
                <label for='legs'>Legs</label>
              </div>
            </div>
          </div>
        </div>
        <button class='button-attack disabled' disabled>Attack!</button>
      </div>
      
      <div class='character enemy'>
        <span class='char-name'>${defaultState.ememy.name}</span>
        <div class='char-image-wrapper'>
          <img src='${defaultState.ememy.avatar}' alt='character image'>
        </div>
        <div data-char='hero' class='progress-bar'></div>
        <span class='progress-num'></span>
      </div>

    </div>
    <div class='log-field'></div>
  `;

  const savedState = localStorage.getItem('game_state');
  const state = savedState ? JSON.parse(savedState) : defaultState;
  const gameplay = main.querySelector('.gameplay');
  const attackButton = gameplay.querySelector('.button-attack');
  let attackZones = [];
  let defenceZones = [];
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
      attackZones.push(radioButton.value);
      } else {
        defenceZones.push(radioButton.value);
      }
    } else{
      if(radioButton.dataset.zone === 'attack'){
      attackZones.pop(radioButton.value);
      } else {
        defenceZones.pop(radioButton.value);
      }
    }
    

    if(attackZones.length === 1 && defenceZones.length === 2){
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
    store.dispatch((currentState) => {
      const enemy = currentState.enemy;
      const enemyAttacks = [zones[Math.floor(Math.random * zones.length)]];
      const enemyDefences = [];
      while (enemyDefences.length !== enemy.defenceCount){
        const zone = zones[Math.floor(Math.random * zones.length)];
        if(!enemyDefences.includes(zone)){
          enemyDefences.push(zone);
        }
      }
      
      return {
        ...currentState,
        //hp: 
      }
    });
  })
}

function renderBattle(state){

}