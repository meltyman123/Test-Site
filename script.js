// ─── On Page Load ───────────────────────────────────────
window.onload = function () {
    showDate();
    loadGoals();
    loadFoods();
};

// ─── Show Today's Date ───────────────────────────────────
function showDate() {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.getElementById("current-date").textContent = today.toLocaleDateString("en-US", options);
}

// ─── Save Goals ──────────────────────────────────────────
function saveGoals() {
    const goals = {
        calories: document.getElementById("goal-calories").value || 2000,
        protein:  document.getElementById("goal-protein").value  || 150,
        carbs:    document.getElementById("goal-carbs").value    || 200,
        fat:      document.getElementById("goal-fat").value      || 65,
    };

    localStorage.setItem("goals", JSON.stringify(goals));
    document.getElementById("goals-saved-msg").textContent = "✅ Goals saved!";

    setTimeout(() => {
        document.getElementById("goals-saved-msg").textContent = "";
    }, 2000);

    updateProgress();
}

// ─── Load Goals ──────────────────────────────────────────
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem("goals"));
    if (goals) {
        document.getElementById("goal-calories").value = goals.calories;
        document.getElementById("goal-protein").value  = goals.protein;
        document.getElementById("goal-carbs").value    = goals.carbs;
        document.getElementById("goal-fat").value      = goals.fat;
    }
    updateProgress();
}

// ─── Add Food ────────────────────────────────────────────
function addFood() {
    const name     = document.getElementById("food-name").value.trim();
    const calories = parseFloat(document.getElementById("food-calories").value) || 0;
    const protein  = parseFloat(document.getElementById("food-protein").value)  || 0;
    const carbs    = parseFloat(document.getElementById("food-carbs").value)    || 0;
    const fat      = parseFloat(document.getElementById("food-fat").value)      || 0;

    // Validation
    if (!name) {
        document.getElementById("food-error").textContent = "❌ Please enter a food name.";
        return;
    }
    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) {
        document.getElementById("food-error").textContent = "❌ Please enter at least one value.";
        return;
    }

    document.getElementById("food-error").textContent = "";

    // Create food object
    const food = { name, calories, protein, carbs, fat, id: Date.now() };

    // Get existing foods
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    foods.push(food);
    localStorage.setItem("foods", JSON.stringify(foods));

    // Clear inputs
    document.getElementById("food-name").value     = "";
    document.getElementById("food-calories").value = "";
    document.getElementById("food-protein").value  = "";
    document.getElementById("food-carbs").value    = "";
    document.getElementById("food-fat").value      = "";

    loadFoods();
}

// ─── Load & Display Foods ────────────────────────────────
function loadFoods() {
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const foodList = document.getElementById("food-list");
    foodList.innerHTML = "";

    if (foods.length === 0) {
        foodList.innerHTML = '<p id="empty-msg">No foods added yet. Add your first meal! 🍽️</p>';
        updateProgress();
        return;
    }

    foods.forEach(food => {
        const item = document.createElement("div");
        item.classList.add("food-item");
        item.innerHTML = `
            <span class="food-item-name">${food.name}</span>
            <div class="food-item-macros">
                <span>🔥 ${food.calories} cal</span>
                <span>💪 ${food.protein}g protein</span>
                <span>🍞 ${food.carbs}g carbs</span>
                <span>🥑 ${food.fat}g fat</span>
            </div>
            <button class="delete-btn" onclick="deleteFood(${food.id})">🗑️</button>
        `;
        foodList.appendChild(item);
    });

    updateProgress();
}

// ─── Delete Food ─────────────────────────────────────────
function deleteFood(id) {
    let foods = JSON.parse(localStorage.getItem("foods")) || [];
    foods = foods.filter(food => food.id !== id);
    localStorage.setItem("foods", JSON.stringify(foods));
    loadFoods();
}

// ─── Update Progress Bars ────────────────────────────────
function updateProgress() {
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || {
        calories: 2000, protein: 150, carbs: 200, fat: 65
    };

    // Calculate totals
    const totals = foods.reduce((acc, food) => {
        acc.calories += food.calories;
        acc.protein  += food.protein;
        acc.carbs    += food.carbs;
        acc.fat      += food.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Update numbers
    document.getElementById("total-calories").textContent = totals.calories.toFixed(0);
    document.getElementById("total-protein").textContent  = totals.protein.toFixed(1);
    document.getElementById("total-carbs").textContent    = totals.carbs.toFixed(1);
    document.getElementById("total-fat").textContent      = totals.fat.toFixed(1);

    // Update goal displays
    document.getElementById("display-goal-calories").textContent = goals.calories;
    document.getElementById("display-goal-protein").textContent  = goals.protein;
    document.getElementById("display-goal-carbs").textContent    = goals.carbs;
    document.getElementById("display-goal-fat").textContent      = goals.fat;

    // Update progress bars (cap at 100% visually)
    setBar("bar-calories", totals.calories, goals.calories);
    setBar("bar-protein",  totals.protein,  goals.protein);
    setBar("bar-carbs",    totals.carbs,    goals.carbs);
    setBar("bar-fat",      totals.fat,      goals.fat);

    // Warn if over goal
    checkOverGoal("total-calories", totals.calories, goals.calories);
    checkOverGoal("total-protein",  totals.protein,  goals.protein);
    checkOverGoal("total-carbs",    totals.carbs,    goals.carbs);
    checkOverGoal("total-fat",      totals.fat,      goals.fat);
}

// ─── Set Progress Bar Width ──────────────────────────────
function setBar(id, current, goal) {
    const percent = Math.min((current / goal) * 100, 100);
    document.getElementById(id).style.width = percent + "%";
}

// ─── Check If Over Goal ──────────────────────────────────
function checkOverGoal(id, current, goal) {
    const el = document.getElementById(id);
    if (current > goal) {
        el.classList.add("over-goal");
    } else {
        el.classList.remove("over-goal");
    }
}

// ─── Reset Day ───────────────────────────────────────────
function resetDay() {
    if (confirm("Are you sure you want to reset today's food log? 🗑️")) {
        localStorage.removeItem("foods");
        loadFoods();
    }
}
