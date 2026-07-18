import { buildRegistration } from "./pages/registration.js";
import { buildHome } from "./pages/home.js";
import { buildProfile } from "./pages/profile.js";
const navButtons = document.querySelector('.nav-buttons');

function handleHashChange(){//router creating preferable to practice
  const path = window.location.hash || '#/home';
  console.log(path);
  switch (path) {
    case '#/home':
      buildHome();
      console.log('is built');
      break;
    case '#/profile':
      buildProfile();
      break;
    case '#/registration':
      buildRegistration();
      break;
    case '#/settings':
      switchToSettings();
      break;
    case '#/battle':
      switchToBattle();
      break;
  }
}
function toInitialPage(){
  if(!localStorage.getItem('name')){
    window.location.hash = '#/registration';
  } else{
    const nav = document.getElementById('nav-panel');
    nav.classList.remove('hidden');
    window.location.hash = '#/home';
  }
  handleHashChange();
}


window.addEventListener('DOMContentLoaded', toInitialPage);
window.addEventListener('hashchange', handleHashChange);
navButtons.addEventListener('click', function(e){
  const button = e.target.closest('[data-page]');
  if(!button) return;
  const page = button.dataset.page;
  window.location.hash = `#/${page}`;
});

