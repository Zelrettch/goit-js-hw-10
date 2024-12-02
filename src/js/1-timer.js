'use strict';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];

    if (timeValidate(date)) {
      timer.date = date;
      enableBtn();
      return;
    }
    disableBtn();
    iziToast.show({
      color: 'red',
      message: 'Please choose a date in the future',
    });
  },
};

const timer = {
  fp: flatpickr('#datetime-picker', options),
  startBtn: document.querySelector('[data-start]'),
  values: Array.from(document.querySelectorAll('span.value')),
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(number) {
  return String(number).padStart(2, '0');
}

function timeValidate(date) {
  return Date.now() < date.getTime();
}

function startTimer({ values, date }) {
  if (!timeValidate(date)) {
    disableBtn();
    return;
  }
  disableFp();
  disableBtn();
  renderTime(convertMs(date.getTime() - Date.now()), values);
  const intervalId = setInterval(() => {
    const t = date.getTime() - Date.now();

    if (t < 0) {
      clearInterval(intervalId);
      enableFp();
      return;
    }

    renderTime(convertMs(Math.max(1, t)), values);
  }, 1000);
}

function renderTime(time, values) {
  const [days, hours, minutes, seconds] = values;
  values.forEach((e, i) => {
    e.textContent = addLeadingZero(Object.values(time)[i]);
  });
}

function enableBtn() {
  timer.startBtn.disabled = false;
  timer.startBtn.classList.remove('disabled');
}

function disableBtn() {
  timer.startBtn.disabled = true;
  timer.startBtn.classList.add('disabled');
}

function disableFp() {
  timer.fp.input.disabled = true;
  timer.fp.input.classList.add('disabled');
}

function enableFp() {
  timer.fp.input.disabled = false;
  timer.fp.input.classList.remove('disabled');
}

timer.startBtn.addEventListener('click', () => {
  startTimer(timer);
});
