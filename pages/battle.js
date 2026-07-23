import { avatars, enemies } from "../components/data.js";

const defaultState = {
  player: {
    name: JSON.parse(localStorage.getItem('name')),
    maxHp: 150,
    currentHp: 150,
    avatar: avatars[JSON.parse(localStorage.getItem('avatar'))],
  },
  ememy: {
    name: enemies[0].name,
    maxHp: enemies[0].hp,
    currentHp: enemies[0].hp,
    avatar: avatars.SILCO,
  },
  currentTurnChoice:{
    attackZone: null,
    defenceZones: [],
  },
  turn: '',
  log: [],
  isGameOver: false,
}

export function buildBattle(){
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
                <input type='radio' id='head' value='HEAD'>
              </div>
              <div class='radio-button-left'>
                <label for='neck'>Neck</label>
                <input type='radio' id='neck' value='NECK'>
              </div>
              <div class='radio-button-left'>
                <label for='body'>Body</label>
                <input type='radio' id='body' value='BODY'>
              </div>
              <div class='radio-button-left'>
                <label for='belly'>Belly</label>
                <input type='radio' id='belly' value='BELLY'>
              </div>
              <div class='radio-button-left'>
                <label for='legs'>Legs</label>
                <input type='radio' id='legs' value='LEGS'>
              </div>
            </div>
          </div>
          <span class='separator'></span>
          <div class='defence-zones-block zones-block'>
            <span class='defence-zones zones-title'>Defence Zones</span>
            <div class='radio-buttons-block'>
              <div class='radio-button-right'>
                <input type='radio' id='head' value='HEAD'>
                <label for='head'>Head</label>
              </div>
              <div class='radio-button-right'>
                <input type='radio' id='neck' value='NECK'>
                <label for='neck'>Neck</label>
              </div>
              <div class='radio-button-right'>
                <input type='radio' id='body' value='BODY'>
                <label for='body'>Body</label>
              </div>
              <div class='radio-button-right'>
                <input type='radio' id='belly' value='BELLY'>
                <label for='belly'>Belly</label>
              </div>
              <div class='radio-button-right'>
                <input type='radio' id='legs' value='LEGS'>
                <label for='legs'>Legs</label>
              </div>
            </div>
          </div>
        </div>
        <button class='button-attack'>Attack!</button>
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
  const initialState = savedState ? JSON.parse(savedState) : defaultState;


  //renderBattle(initialState); subscribe on store, create store
}

function renderBattle(state){

}