"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const totalExercises = document.getElementById("totalExercises");
const totalSets = document.getElementById("totalSets");
const highestWeight = document.getElementById("highestWeight");
const totalVolume = document.getElementById("totalVolume");

const workoutForm = document.getElementById("workoutForm");

const exerciseInput = document.getElementById("exerciseInput");
const muscleInput = document.getElementById("muscleInput");
const weightInput = document.getElementById("weightInput");
const repsInput = document.getElementById("repsInput");
const setsInput = document.getElementById("setsInput");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll("[data-filter]");

const exerciseGrid = document.getElementById("exerciseGrid");

// ======================================================
// WORKOUT STATE
// ======================================================

let exercises = [];

let currentFilter = "all";

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveExercises() {
  localStorage.setItem("workoutTracker", JSON.stringify(exercises));
}

function loadExercises() {
  const storedExercises = localStorage.getItem("workoutTracker");

  if (storedExercises) {
    exercises = JSON.parse(storedExercises);
  }
}

// ======================================================
// EXERCISE ACTIONS
// ======================================================

function addExercise() {
  const exercise = {
    id: Date.now(),
    name: exerciseInput.value.trim(),
    muscle: muscleInput.value,
    weight: Number(weightInput.value),
    reps: Number(repsInput.value),
    sets: Number(setsInput.value),
  };

  exercises.push(exercise);

  saveExercises();
  renderExercises();
  renderStats();

  workoutForm.reset();
}

function deleteExercise(id) {
  exercises = exercises.filter((exercise) => {
    return exercise.id !== id;
  });

  saveExercises();
  renderExercises();
  renderStats();
}

// ======================================================
// FILTERING SYSTEM
// ======================================================

function getFilteredExercises() {
  let filteredExercises = [...exercises];

  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue !== "") {
    filteredExercises = filteredExercises.filter((exercise) => {
      return exercise.name.toLowerCase().includes(searchValue);
    });
  }

  if (currentFilter !== "all") {
    filteredExercises = filteredExercises.filter((exercise) => {
      return exercise.muscle === currentFilter;
    });
  }

  return filteredExercises;
}

// ======================================================
// UI RENDERING
// ======================================================

function renderExercises() {
  exerciseGrid.innerHTML = "";

  const filteredExercises = getFilteredExercises();

  if (filteredExercises.length === 0) {
    exerciseGrid.innerHTML = `
      <div class="empty-workout">
        <h3>No exercises found</h3>
        <p>Add your first exercise or try another search/filter.</p>
      </div>
    `;

    return;
  }

  filteredExercises.forEach((exercise) => {
    exerciseGrid.innerHTML += `
      <article class="exercise-card ${exercise.muscle}">
        <h3 class="exercise-title">${exercise.name}</h3>

        <span class="exercise-muscle">
          ${exercise.muscle}
        </span>

        <div class="exercise-details">
          <div class="detail-box">
            <span>Weight</span>
            <strong>${exercise.weight} kg</strong>
          </div>

          <div class="detail-box">
            <span>Reps</span>
            <strong>${exercise.reps}</strong>
          </div>

          <div class="detail-box">
            <span>Sets</span>
            <strong>${exercise.sets}</strong>
          </div>
        </div>

        <button class="delete-exercise" data-id="${exercise.id}">
          Delete
        </button>
      </article>
    `;
  });
}

function renderStats() {
  const totalSetsCount = exercises.reduce((sum, exercise) => {
    return sum + exercise.sets;
  }, 0);

  const highest =
    exercises.length === 0
      ? 0
      : Math.max(...exercises.map((exercise) => exercise.weight));

  const volume = exercises.reduce((sum, exercise) => {
    return sum + exercise.weight * exercise.reps * exercise.sets;
  }, 0);

  totalExercises.textContent = exercises.length;
  totalSets.textContent = totalSetsCount;
  highestWeight.textContent = `${highest} kg`;
  totalVolume.textContent = `${volume} kg`;
}

// ======================================================
// FORM HANDLING
// ======================================================

workoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    exerciseInput.value.trim() === "" ||
    weightInput.value.trim() === "" ||
    repsInput.value.trim() === "" ||
    setsInput.value.trim() === ""
  ) {
    return;
  }

  addExercise();
});

// ======================================================
// EVENT LISTENERS
// ======================================================

searchInput.addEventListener("input", renderExercises);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderExercises();
  });
});

exerciseGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-exercise")) {
    const id = Number(e.target.dataset.id);

    deleteExercise(id);
  }
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadExercises();
renderExercises();
renderStats();
