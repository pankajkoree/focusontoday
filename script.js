const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".goal-input");
const errorLabel = document.querySelector("#error-label");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const progressLabel = document.querySelector(".progress-label");
const footerQuote = document.querySelector(".quote");

const allQuotes = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Just a step away, keep going!",
  "Whoa! You just completed all the goals, time for chill :D",
];

const footerQuotes = [
  "“Move one step ahead, today!”",
  "“Keep Going, You’re making great progress!”",
  "“Too close, yet too far!”",
  "“Works paid off!”",
];

// Load goals from localStorage
const allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};

// Calculate completed goals
let completedGoalsCount = Object.values(allGoals).filter(
  (goal) => goal.completed
).length;

// Initialize progress bar
progressValue.style.width = `${
  (completedGoalsCount / inputFields.length) * 100
}%`;
progressValue.firstElementChild.innerText = `${completedGoalsCount} / ${inputFields.length} completed`;
progressLabel.innerText = allQuotes[completedGoalsCount];
footerQuote.innerText = footerQuotes[completedGoalsCount];

// Restore previous state for inputs and checkboxes
inputFields.forEach((input) => {
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].name;

    if (allGoals[input.id].completed) {
      const goalContainer = input.closest(".goal-container");
      goalContainer.classList.add("completed");

      // Show tick mark
      const tickIcon = goalContainer.querySelector(".check-icon");
      tickIcon.classList.remove("hidden");
    }
  }

  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", () => {
    if (allGoals[input.id] && allGoals[input.id].completed) {
      input.value = allGoals[input.id].name;
      return;
    }

    if (allGoals[input.id]) {
      allGoals[input.id].name = input.value;
    } else {
      allGoals[input.id] = {
        name: input.value,
        completed: false,
      };
    }

    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });
});

// Handle checkbox click
checkBoxList.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    const allGoalsAdded = [...inputFields].every((input) => input.value);

    if (allGoalsAdded) {
      const goalContainer = checkbox.closest(".goal-container");
      const inputId = goalContainer.querySelector("input").id;

      // Toggle completion status
      allGoals[inputId].completed = !allGoals[inputId].completed;

      // Update UI classes
      goalContainer.classList.toggle("completed", allGoals[inputId].completed);

      // Show/hide tick mark
      const tickIcon = checkbox.querySelector(".check-icon");
      if (allGoals[inputId].completed) {
        tickIcon.classList.remove("hidden");
      } else {
        tickIcon.classList.add("hidden");
      }

      // Recalculate completed goals
      completedGoalsCount = Object.values(allGoals).filter(
        (goal) => goal.completed
      ).length;

      // Update progress bar and quotes
      progressValue.style.width = `${
        (completedGoalsCount / inputFields.length) * 100
      }%`;
      progressValue.firstElementChild.innerText = `${completedGoalsCount}/${inputFields.length} completed`;

      progressLabel.innerText = allQuotes[completedGoalsCount];
      footerQuote.innerText = footerQuotes[completedGoalsCount];

      // Save to localStorage
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    } else {
      progressBar.classList.add("show-error");
    }
  });
});
