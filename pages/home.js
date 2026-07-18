
export function buildHome(){
  const main = document.querySelector('#main');
  main.className = 'home';
  main.innerHTML = `
  <div class='home-wrapper'>
    <button class='button-fight'>Fight!</button>
  </div>
  `;
  const navTitle = document.querySelector('.nav-page-title');
  navTitle.textContent = 'Main';
}