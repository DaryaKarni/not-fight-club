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
  if(!JSON.parse(localStorage.getItem('enemy'))) {
    localStorage.setItem('enemy', JSON.stringify(selectedEnemy));
  }
  const enemy = JSON.parse(localStorage.getItem('enemy'));
  const enemyAvatar = JSON.parse(localStorage.getItem('enemyAvatar')) ?? 
  selectedEnemy.name.toUpperCase();
  if(!JSON.parse(localStorage.getItem('enemyAvatar'))) {
    localStorage.setItem('enemyAvatar', JSON.stringify(enemyAvatar));
  }
  if(!JSON.parse(localStorage.getItem('enemyHp'))){
    localStorage.setItem('enemyHp', JSON.stringify(selectedEnemy.hp));
  }
  if(!JSON.parse(localStorage.getItem('heroHp'))){
    localStorage.setItem('heroHp', 150);
  }
  let playerAvatar;
  if(JSON.parse(localStorage.getItem('avatar'))){
    playerAvatar = avatars[JSON.parse(localStorage.getItem('avatar'))];
  } else{
    localStorage.setItem('avatar', JSON.stringify('JINX'));
    playerAvatar = avatars[JSON.parse(localStorage.getItem('avatar'))];
  }
  const defaultState = {
    player: {
      name: JSON.parse(localStorage.getItem('name')),
      maxHp: 150,
      currentHp: JSON.parse(localStorage.getItem('heroHp')) ?? 150,
      damage: 10,
      attacks: 1,
      avatar: playerAvatar,
    },
    enemy: {
      name: enemy.name,
      maxHp: enemy.hp,
      currentHp: JSON.parse(localStorage.getItem('enemyHp')) ?? enemy.hp,
      avatar: avatars[enemyAvatar],
      attacks: enemy.attacks,
      defences: enemy.defences,
      damage: enemy.damage,
    },
    log: JSON.parse(localStorage.getItem('log')) ?? [],
    newLog: [],
    isGameOver: false,
  }
  const navTitle = document.querySelector('.nav-page-title');
  navTitle.textContent = 'Battle';
  const main = document.querySelector('#main');
  main.className = 'battle';
  main.innerHTML = `
    <div class='game-field'>
      <div class= 'game-wrapper'>
        <div class='character hero'>
          <span class='char-name'>${defaultState.player.name}</span>
          <div class='char-image-wrapper'>
            <img src='${defaultState.player.avatar}' alt='character image'>
          </div>
          <div data-char='hero' class='progress-block'>
            <div class='progress-bar'>
              <div class='current-progress-bar'></div>
            </div>
            <div class='progress-nums-block'>
              <span class='span-currentHp'>${defaultState.player.currentHp}</span>
              <span>/</span>
              <span class='span-maxPp'>${defaultState.player.maxHp}</span>
            </div>
          </div>
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
          <div data-char='enemy' class='progress-block'>
            <div class='progress-bar'>
              <div class='current-progress-bar'></div>
            </div>
            <div class='progress-nums-block'>
              <span class='span-currentHp'>${defaultState.enemy.currentHp}</span>
              <span>/</span>
              <span class='span-maxPp'>${defaultState.enemy.maxHp}</span>
            </div>
          </div>
        </div>
      </div>
        <div id='log-field' class='log-field'></div>
        <div id='modal' class='modal hidden'>
          <p class='modal-message'></p>
          <button class='modal-cross'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
          </button>
        </div>
    </div>
  `;
  const modal = document.getElementById('modal');
  const buttonCross = modal.querySelector('.modal-cross');
  buttonCross.addEventListener('click', () => {
    document.querySelector('.background').remove();
    localStorage.removeItem('enemy');
    localStorage.removeItem('enemyAvatar');
    localStorage.removeItem('enemyHp');
    localStorage.removeItem('heroHp');
    localStorage.removeItem('log');
    window.location.hash = '#/profile';
  })

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

  renderLog(state, state.log);
  renderProgressHp(state);
  
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
      localStorage.setItem('log', JSON.stringify(generalLog));
      localStorage.setItem('heroHp', JSON.stringify(heroHp));
      localStorage.setItem('enemyHp', JSON.stringify(enemyHp));
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
function renderLog(state, someLog){
  const logField = document.getElementById('log-field');
  console.log(someLog);
  someLog.forEach((log) => {
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
function renderProgressHp(state){
  const heroProgressBlock = document.querySelector('.progress-block[data-char="hero"]');
  const enemyProgressBlock = document.querySelector('.progress-block[data-char="enemy"]');
  renderHpChange(state.player, heroProgressBlock);
  renderHpChange(state.enemy, enemyProgressBlock);
  function renderHpChange(character, characterProgressBlock){
    const characterProgressBar = characterProgressBlock.querySelector('.current-progress-bar');
    const currHp = character.currentHp < 0 ? 0 : character.currentHp;
    const maxHp = character.maxHp;
    const percentage = (currHp / maxHp) * 100;
    characterProgressBar.style.width = `${percentage}%`;

    const spanCharacterHp = characterProgressBlock.querySelector('.span-currentHp');
    spanCharacterHp.textContent = currHp;
    if(currHp <= 0){
      renderGameOver(state);
      return;
    }
  }
}
function renderGameOver(state){
  console.log(state, 'its prom gameover');
    let wins = JSON.parse(localStorage.getItem('wins'));
    let loses = JSON.parse(localStorage.getItem('loses'));
    console.log(`herohp: ${state.player.currentHp} and enemy's: ${state.enemy.currentHp}`)
    if(state.player.currentHp > state.enemy.currentHp){
      wins += 1;
      localStorage.setItem('wins', JSON.stringify(wins));
      const winMessage = 'Congratulations on your win!!!';
      console.log('im here');
      renderModal(winMessage);
    } else if(state.player.currentHp < state.enemy.currentHp){
      loses += 1;
      localStorage.setItem('loses', JSON.stringify(loses));
      const loseMessage = 'You lose, unfortunatly(';
      renderModal(loseMessage);
    } else{
      renderModal('DRAW!');
    }
    function renderModal(message){
      console.log('rendering');
      const main = document.getElementById('main');
      const modal = main.querySelector('.modal');
      modal.classList.remove('hidden');
      const text = modal.querySelector('.modal-message');
      text.textContent = message;

      const background = document.createElement('div');
      background.classList.add('background');
      document.body.prepend(background);
    }
  }
function renderBattle(state){
  renderLog(state, state.newLog);
  renderProgressHp(state);
}
 