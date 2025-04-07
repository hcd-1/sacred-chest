// script.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Script started");

let currentDate = new Date();
let currentDay = currentDate.getDate().toString();
let versesForDay = [];
let currentVerseIndex = 0;

const options = { year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("current-date").textContent = currentDate.toLocaleDateString('en-US', options);

function loadDailyVerse() {
  const dailyVerseBlock = document.getElementById("daily-verse");
  const dailyVerseContent = document.getElementById("daily-verse-content");
  const dailySpinner = document.getElementById("daily-spinner");

  if (!dailyVerseBlock.classList.contains("verse-hidden")) {
    dailySpinner.style.display = "block";
    dailyVerseContent.style.display = "none";
  }

  supabaseClient
    .from("verses")
    .select("*")
    .eq("special", "daily")
    .single()
    .then(({ data, error }) => {
      dailySpinner.style.display = "none";
      if (!dailyVerseBlock.classList.contains("verse-hidden")) {
        dailyVerseContent.style.display = "block";
      }

      if (error || !data) {
        console.log("No daily verse found:", error);
        dailyVerseContent.innerHTML = "No daily verse available.";
        return;
      }

      console.log("Daily verse found:", data);
      dailyVerseContent.innerHTML = `<strong>${data.verse}</strong>: ${data.text}`;
    })
    .catch(err => {
      dailySpinner.style.display = "none";
      if (!dailyVerseBlock.classList.contains("verse-hidden")) {
        dailyVerseContent.style.display = "block";
      }
      console.error("Query for daily verse failed:", err);
      dailyVerseContent.innerHTML = "Error loading daily verse.";
    });
}

function loadOddEvenVerse(day) {
  const oddEvenVerseBlock = document.getElementById("odd-even-verse");
  const oddEvenVerseContent = document.getElementById("odd-even-verse-content");
  const oddEvenSpinner = document.getElementById("odd-even-spinner");

  if (!oddEvenVerseBlock.classList.contains("verse-hidden")) {
    oddEvenSpinner.style.display = "block";
    oddEvenVerseContent.style.display = "none";
  }

  const dayNumber = parseInt(day);
  const specialValue = dayNumber % 2 === 0 ? "even" : "odd";
  console.log(`Loading ${specialValue} verse for day ${day}`);

  supabaseClient
    .from("verses")
    .select("*")
    .eq("special", specialValue)
    .single()
    .then(({ data, error }) => {
      oddEvenSpinner.style.display = "none";
      if (!oddEvenVerseBlock.classList.contains("verse-hidden")) {
        oddEvenVerseContent.style.display = "block";
      }

      if (error || !data) {
        console.log(`No ${specialValue} verse found:`, error);
        oddEvenVerseContent.innerHTML = `No ${specialValue} verse available.`;
        return;
      }

      console.log(`${specialValue} verse found:`, data);
      oddEvenVerseContent.innerHTML = `<strong>${data.verse}</strong>: ${data.text}`;
    })
    .catch(err => {
      oddEvenSpinner.style.display = "none";
      if (!oddEvenVerseBlock.classList.contains("verse-hidden")) {
        oddEvenVerseContent.style.display = "block";
      }
      console.error(`Query for ${specialValue} verse failed:`, err);
      oddEvenVerseContent.innerHTML = "Error loading odd/even verse.";
    });
}

function loadDayOfWeekVerse(date) {
  const dayOfWeekVerseBlock = document.getElementById("day-of-week-verse");
  const dayOfWeekVerseContent = document.getElementById("day-of-week-verse-content");
  const dayOfWeekSpinner = document.getElementById("day-of-week-spinner");

  if (!dayOfWeekVerseBlock.classList.contains("verse-hidden")) {
    dayOfWeekSpinner.style.display = "block";
    dayOfWeekVerseContent.style.display = "none";
  }

  const dayOfWeekMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayOfWeek = date.getDay();
  const specialValue = dayOfWeekMap[dayOfWeek];
  console.log(`Loading ${specialValue} verse for day of week ${dayOfWeek}`);

  supabaseClient
    .from("verses")
    .select("*")
    .eq("special", specialValue)
    .single()
    .then(({ data, error }) => {
      dayOfWeekSpinner.style.display = "none";
      if (!dayOfWeekVerseBlock.classList.contains("verse-hidden")) {
        dayOfWeekVerseContent.style.display = "block";
      }

      if (error || !data) {
        console.log(`No ${specialValue} verse found:`, error);
        dayOfWeekVerseContent.innerHTML = `No ${specialValue} verse available.`;
        return;
      }

      console.log(`${specialValue} verse found:`, data);
      dayOfWeekVerseContent.innerHTML = `<strong>${data.verse}</strong>: ${data.text}`;
    })
    .catch(err => {
      dayOfWeekSpinner.style.display = "none";
      if (!dayOfWeekVerseBlock.classList.contains("verse-hidden")) {
        dayOfWeekVerseContent.style.display = "block";
      }
      console.error(`Query for ${specialValue} verse failed:`, err);
      dayOfWeekVerseContent.innerHTML = "Error loading day-of-week verse.";
    });
}

function loadVerse(day) {
  const verseBlock = document.getElementById("verse");
  const verseContent = document.getElementById("verse-content");
  const verseSpinner = document.getElementById("verse-spinner");
  const toggleButtonsDiv = document.getElementById("verse-toggle-buttons");

  if (!verseBlock.classList.contains("verse-hidden")) {
    verseSpinner.style.display = "block";
    verseContent.style.display = "none";
  }
  toggleButtonsDiv.innerHTML = "";
  console.log("Loading day of month:", day);

  supabaseClient
    .from("verses")
    .select("*")
    .eq("day_month", day)
    .then(({ data, error }) => {
      verseSpinner.style.display = "none";
      if (!verseBlock.classList.contains("verse-hidden")) {
        verseContent.style.display = "block";
        toggleButtonsDiv.style.display = "block";
      } else {
        toggleButtonsDiv.style.display = "none";
      }

      if (error || !data || data.length === 0) {
        console.log("No verses found for day_month:", day);
        verseContent.innerHTML = "No verse available for this day.";
        toggleButtonsDiv.innerHTML = "";
        return;
      }

      console.log("Verses found for day_month:", data);
      versesForDay = data.sort((a, b) => parseInt(a.special) - parseInt(b.special));
      currentVerseIndex = 0;

      const selectedVerse = versesForDay[currentVerseIndex];
      verseContent.innerHTML = `<strong>${selectedVerse.verse}</strong>: ${selectedVerse.text}`;

      versesForDay.forEach((verse, index) => {
        const button = document.createElement("button");
        button.textContent = `Verse ${verse.special}`;
        button.className = "verse-toggle-button";
        button.dataset.index = index;

        if (index === currentVerseIndex) {
          button.classList.add("active");
        }

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          currentVerseIndex = parseInt(button.dataset.index);
          const newVerse = versesForDay[currentVerseIndex];
          verseContent.innerHTML = `<strong>${newVerse.verse}</strong>: ${newVerse.text}`;

          document.querySelectorAll(".verse-toggle-button").forEach(btn => {
            btn.classList.remove("active");
          });
          button.classList.add("active");
        });

        toggleButtonsDiv.appendChild(button);
      });
    })
    .catch(err => {
      verseSpinner.style.display = "none";
      if (!verseBlock.classList.contains("verse-hidden")) {
        verseContent.style.display = "block";
      }
      toggleButtonsDiv.style.display = "none";
      console.error("Query failed:", err);
      verseContent.innerHTML = "Error loading verse.";
      toggleButtonsDiv.innerHTML = "";
    });
}

function updateLabels(date) {
  const dayNumber = date.getDate();
  const dayOfWeekMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = dayOfWeekMap[date.getDay()];
  
  document.getElementById("daily-label").textContent = "Daily";
  document.getElementById("odd-even-label").textContent = 
    dayNumber % 2 === 0 ? "Even" : "Odd";
  document.getElementById("day-of-week-label").textContent = dayOfWeek;
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  document.getElementById("day-label").textContent = 
    `${monthNames[date.getMonth()]} ${dayNumber}`;
}

function toggleVerseVisibility(verseBlock) {
  verseBlock.classList.toggle("verse-hidden");
  const content = verseBlock.querySelector(".verse-content");
  const spinner = verseBlock.querySelector(".spinner");
  
  if (verseBlock.classList.contains("verse-hidden")) {
    content.style.display = "none";
    spinner.style.display = "none";
  } else {
    content.style.display = "block";
    spinner.style.display = "none";
  }

  if (verseBlock.id === "verse") {
    const toggleButtonsDiv = document.getElementById("verse-toggle-buttons");
    toggleButtonsDiv.style.display = verseBlock.classList.contains("verse-hidden") ? "none" : "block";
  }
}

const waitForSupabase = setInterval(() => {
  if (typeof supabase !== "undefined") {
    console.log("Supabase is defined, loading verses");
    clearInterval(waitForSupabase);

    updateLabels(currentDate);
    loadDailyVerse();
    loadOddEvenVerse(currentDay);
    loadDayOfWeekVerse(currentDate);
    loadVerse(currentDay);

    const verseBlocks = [
      document.getElementById("daily-verse"),
      document.getElementById("odd-even-verse"),
      document.getElementById("day-of-week-verse"),
      document.getElementById("verse")
    ];
    verseBlocks.forEach(block => {
      block.addEventListener("click", () => toggleVerseVisibility(block));
    });

    document.getElementById("next-day").addEventListener("click", () => {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDay = currentDate.getDate().toString();
      document.getElementById("current-date").textContent = currentDate.toLocaleDateString('en-US', options);
      updateLabels(currentDate);
      loadOddEvenVerse(currentDay);
      loadDayOfWeekVerse(currentDate);
      loadVerse(currentDay);
    });

    document.getElementById("prev-day").addEventListener("click", () => {
      currentDate.setDate(currentDate.getDate() - 1);
      currentDay = currentDate.getDate().toString();
      document.getElementById("current-date").textContent = currentDate.toLocaleDateString('en-US', options);
      updateLabels(currentDate);
      loadOddEvenVerse(currentDay);
      loadDayOfWeekVerse(currentDate);
      loadVerse(currentDay);
    });

    document.getElementById("today-verse").addEventListener("click", () => {
      currentDate = new Date();
      currentDay = currentDate.getDate().toString();
      document.getElementById("current-date").textContent = currentDate.toLocaleDateString('en-US', options);
      updateLabels(currentDate);
      loadOddEvenVerse(currentDay);
      loadDayOfWeekVerse(currentDate);
      loadVerse(currentDay);
    });
  } else {
    console.log("Waiting for Supabase...");
  }
}, 500);
