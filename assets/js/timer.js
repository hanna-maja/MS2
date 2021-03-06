const FULL_DASH_ARRAY = 283;
// Warning occurs at 10s
const WARNING_THRESHOLD = 10;
// Alert occurs at 5s
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

// Initially, no time has passed, but this will count up
// and subtract from the TIME_LIMIT
// Start with an initial value of 300 seconds
let countDown = true;
let time_limit = 300;
let timePassed = 0;
let timeLeft = time_limit;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

function formatTimeLeft(time) {
  if (time < 0) {
    return "0:00";
  }

  // The largest round integer less than or equal to the result of time divided being by 60.
  const minutes = Math.floor(time / 60);

  // Seconds are the remainder of the time divided by 60 (modulus operator)
  let seconds = time % 60;

  // If the value of seconds is less than 10, then display seconds with a leading zero
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  // The output in MM:SS format
  return `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function startTimer() {
  timerInterval = setInterval(() => {
    // The amount of time passed increments by one
    timePassed = timePassed += 1;
    if (countDown === true) {
      timeLeft = time_limit - timePassed;

      // The time left label is updated
      $("#base-timer-label").text(formatTimeLeft(timeLeft));
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        stopTimer();
      }
    } else {
      // The time left label is updated
      $("#base-timer-label").text(formatTimeLeft(timePassed));
    }
  }, 1000);
}

function toggleTimer() {
  if (timerInterval === null) {
    startTimer();
    return "started";
  } else {
    stopTimer();
    return "stopped";
  }
}

function calculateTimeFraction() {
  return timeLeft / time_limit;
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / time_limit;
  return rawTimeFraction - (1 / time_limit) * (1 - rawTimeFraction);
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;

  // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);

    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function resetTimer(limit) {
  countDown = limit > 0;
  time_limit = limit;
  timePassed = 0;
  timeLeft = time_limit;
  if (timerInterval != null) {
    stopTimer();
  }

  $("#base-timer-label").text(formatTimeLeft(timeLeft));

  //Reset css-classes
  $("#base-timer-path-remaining").removeClass(COLOR_CODES.info.color);
  $("#base-timer-path-remaining").removeClass(COLOR_CODES.warning.color);
  $("#base-timer-path-remaining").removeClass(COLOR_CODES.alert.color);
  $("#base-timer-path-remaining").addClass(COLOR_CODES.info.color);

  setCircleDasharray();

  $("#start-clock").text("Starta klockan");
}

$("#start-clock").click(function () {
  let action = toggleTimer();
  if (action === "started") {
    $(this).text("Paus");
  } else {
    $(this).text("Starta klockan");
  }
});

$("#reset-clock").click(function () {
  resetTimer(time_limit);
});

resetTimer(time_limit);
