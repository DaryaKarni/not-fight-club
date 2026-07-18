
const avatars = {
  'JINX': './assets/jinx.jpg',
  'VI': './assets/violet.jpg',
  'JAMES': './assets/james.jpg',
  'EKKO': './assets/ekko.jpg'
};
export function buildProfile(){
  const main = document.querySelector('#main');
  main.className = 'profile';
  const defaultAvatar = avatars.JINX;
  localStorage.setItem('avatar', JSON.stringify('JINX'));
  main.innerHTML = `
  <div class='profile-wrapper'>
    <div class='image-wrapper'>
      <img class='profile-image' src='${avatars[JSON.parse(localStorage.getItem('avatar'))] || defaultAvatar}'>
      <button class='button-edit-image'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
        </svg>
      </button>
    </div>
    <div class='info-block'>
      <span class='char-name'>${JSON.parse(localStorage.getItem('name'))}</span>
      <div class='statistics'>
        <span class='wins'>Wins: ${JSON.parse(localStorage.getItem('wins')) || 0}</span>
        <span class='loses'>Loses: ${JSON.parse(localStorage.getItem('loses')) || 0}</span>
      </div>
    </div>
    <div class='char-modal hidden'>
      <span class='modal-title'>Choose your character</span>
      <button class='cross'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
      </button>
      <div class='avatars'></div>
    </div>
  </div>
  `;
  const navTitle = document.querySelector('.nav-page-title');
  navTitle.textContent = 'Character';
  const editButton = main.querySelector('.button-edit-image');
  editButton.addEventListener('click', function(e){
    showModal(Object.entries(avatars));
  })
}

function showModal(arr){
  const modal = document.querySelector('.char-modal');
  modal.classList.remove('hidden');
  const avatars = modal.querySelector('.avatars');
  if(avatars.children.length === 0){
    arr.forEach((pair) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML=`
      <image id=${pair[0]} class='avatars-image' src=${pair[1]}>
      <button class='button-choose-avatar'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
          </svg>
      </button>
      `;
      avatars.appendChild(card);
    });
  const cross = modal.querySelector('.cross');
  cross.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  avatars.addEventListener('click', function(e) {
    const button = e.target.closest('.button-choose-avatar');
    if(!button) return;
    const card = button.closest('.card');
    const image = card.querySelector('img');
    console.log(image);
    const profileImage = document.querySelector('.profile-image');
    profileImage.src = image.src;
    modal.classList.add('hidden');
    localStorage.setItem('avatar', JSON.stringify(image.id));
  })

  }
}