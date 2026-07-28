
export function buildRegistration(){
  const main = document.querySelector('#main');
  main.className = 'registration';
  main.innerHTML = `
  <div class='reg-wrapper'>
    <h1 class='reg-title'>Create Your Character</h1>
    <div class='input-block'>
      <span class='input-name'>Character Name</span>
      <input name='reg-input' class='input-field'>
    </div>
    <button class='button-create'>Create Character</button>
  </div>
  `;
  const nav = document.getElementById('nav-panel');
  const button = main.querySelector('.button-create');
  const input = main.querySelector('.input-field');
  button.addEventListener('click', function (e){
    if(input.value){
      localStorage.setItem('name', JSON.stringify(input.value));
      window.location.hash = '#/home';
      nav.classList.remove('hidden');
    }
  })
}