import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(state, delay) {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      state ? resolve(delay) : reject(delay);
    }, delay);
  });

  p.then(d => {
    iziToast.show({
      color: 'green',
      message: `✅ Fulfilled promise in ${delay}ms`,
    });
  }).catch(d => {
    iziToast.show({
      color: 'red',
      message: `❌ Rejected promise in ${delay}ms`,
    });
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const delay = form.elements.delay.value;
  const state = form.elements.state.value;

  switch (state) {
    case 'fulfilled':
      createPromise(true, delay);
      break;
    case 'rejected':
      createPromise(false, delay);
      break;
  }

  form.reset();
});
