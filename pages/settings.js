
export function buildSettings(){
  const main = document.querySelector('#main');
  main.className = 'settings';
  const navTitle = document.querySelector('.nav-page-title');
  navTitle.textContent = 'Settings';
  main.innerHTML = `
    <div class='settings-wrapper'>
      <span class='player-name'>Player Name:</span>
      <span class='name'>${JSON.parse(localStorage.getItem('name'))}</span>
      <input id='name-input' class='name-input hidden' type='text' value='${JSON.parse(localStorage.getItem('name'))}'>
      <button class='edit-name'>Edit</button>
    <div>
  `;
  const buttonEdit = main.querySelector('.edit-name');
  const input = main.querySelector('#name-input');
  const textName = main.querySelector('.name');
  buttonEdit.addEventListener('click', function (e){
    if(input.classList.contains('hidden')){
      input.classList.remove('hidden');
      textName.classList.add('hidden');
      buttonEdit.textContent = 'Save';
    } else{
      const name = `${input.value}`; 
      textName.textContent = name;
      localStorage.setItem('name', JSON.stringify(name));
      input.classList.add('hidden');
      textName.classList.remove('hidden');
      buttonEdit.textContent = 'Edit';
    }
  })
}