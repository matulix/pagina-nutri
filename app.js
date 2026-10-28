// NutriAsistente — adaptado al plan alimentario compartido.
// Los ingredientes se generan a partir de la opción elegida para cada comida.
// El material no calcula requerimientos ni reemplaza las indicaciones profesionales.

const plan = {
  desayuno: {
    title: "Desayuno", emoji: "☕",
    options: [
      { title: "Opción 1", description: "2 rodajas de pan lactal integral + 2 huevos + 1 cucharada de semillas de chía + fruta a elección + 1 vaso de leche.", ingredients: ["pan lactal integral", "huevos", "semillas de chía", "fruta a elección", "leche"] },
      { title: "Opción 2", description: "1 taza de yogur + fruta cortada en cubos + un puñado de frutos secos + ¼ de taza de cereales.", ingredients: ["yogur", "fruta a elección", "frutos secos", "cereales"] }
    ]
  },
  almuerzo: {
    title: "Almuerzo", emoji: "🥗",
    options: [
      { title: "Opción 1", description: "1 trozo de cuadril + ¼ de taza de arroz integral cocido + mix de verduras al horno (zapallito, zanahoria y cebolla) + 1 cucharada de aceite de oliva + agua.", ingredients: ["cuadril", "arroz integral", "zapallito", "zanahoria", "cebolla", "aceite de oliva"] },
      { title: "Opción 2", description: "2 rapiditas integrales + cebolla y morrón salteados + nalga en tiras + 1 cucharada de dip de palta + agua.", ingredients: ["rapiditas integrales", "cebolla", "morrón", "nalga", "palta"] }
    ]
  },
  merienda: {
    title: "Merienda", emoji: "🍌",
    options: [
      { title: "Opción 1", description: "2 panqueques de banana (avena, 2 huevos y ½ banana) + 1 cucharadita de miel + puñado de frutos secos + agua.", ingredients: ["avena", "huevos", "banana", "miel", "frutos secos"] },
      { title: "Opción 2", description: "2 rodajas de budín de pera (harina de avena, 2 huevos y 1 pera) + 1 cucharadita de pasta de maní + agua.", ingredients: ["harina de avena", "huevos", "pera", "pasta de maní"] }
    ]
  },
  cena: {
    title: "Cena", emoji: "🍽️",
    options: [
      { title: "Opción 1", description: "1 milanesa chica de peceto rebozada en avena + ensalada (lentejas o garbanzos, tomate, zanahoria, lechuga y palta) + agua.", ingredients: ["peceto", "avena", "lentejas o garbanzos", "tomate", "zanahoria", "lechuga", "palta"] },
      { title: "Opción 2", description: "1 trozo de pechuga de pollo en cubos + tomate + remolacha + crutones + 1 cucharada de aceite de oliva + agua.", ingredients: ["pechuga de pollo", "tomate", "remolacha", "crutones", "aceite de oliva"] }
    ]
  }
};

const snacks = [
  { title: "Frutas", description: "1 banana, 1 manzana, un puñado de uvas o 1 durazno." },
  { title: "Barritas", description: "Barritas Integra, según la propuesta del plan." },
  { title: "Chocolate", description: "Chocolate con 70 % de cacao (4 cuadraditos)." }
];

const categoryRules = [
  { name: "Verdulería y frutería", match: /fruta|banana|pera|zanahoria|batata|cebolla|morrón|palta|tomate|remolacha|manzana|uvas|durazno/ },
  { name: "Carnicería y pescadería", match: /cuadril|nalga|peceto|pollo/ },
  { name: "Lácteos y huevos", match: /yogur|huevos/ },
  { name: "Almacén", match: /pan lactal integral|semillas de chía|infusión|frutos secos|cereales|arroz integral|aceite de oliva|rapiditas integrales|avena|miel|harina de avena|pasta de maní|lentejas o garbanzos|garbanzos|lentejas|crutones|barritas integra|chocolate/ }
];

const tips = [
  { emoji: "🫘", title: "Consumo de legumbres", text: "El plan recomienda remojar lentejas, garbanzos o porotos durante 8 a 12 horas antes de cocinarlos." },
  { emoji: "🌿", title: "No a las restricciones", text: "El plan propone evitar la idea de hacerlo todo perfecto: los gustos y las salidas pueden formar parte del proceso sin perder de vista los objetivos." },
  { emoji: "📵", title: "Dejá de lado las pantallas", text: "Durante las comidas, intentá dejar las pantallas y disfrutar el momento con todos los sentidos, en familia o a solas." },
  { emoji: "🚶", title: "El movimiento es importante", text: "El material propone moverse o realizar ejercicio durante 30 a 45 minutos, de acuerdo con las posibilidades personales y las indicaciones profesionales." },
  { emoji: "🌱", title: "Es un proceso", text: "Los cambios no son instantáneos. Puede haber dificultades en el camino; lo importante es continuar con objetivos realistas." },
  { emoji: "💧", title: "Tené agua a mano", text: "El plan recomienda tener una botella de agua disponible durante el día para favorecer la hidratación." }
];

let tipIndex = 0;
let manualItems = JSON.parse(localStorage.getItem("nutri-manual-items") || "[]");
let checkedItems = JSON.parse(localStorage.getItem("nutri-checked-items") || "{}");
let chosenOptions = JSON.parse(localStorage.getItem("nutri-chosen-options") || '{"desayuno":0,"almuerzo":0,"merienda":0,"cena":0}');
let currentShoppingItems = [];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function categoryFor(item) {
  const rule = categoryRules.find(entry => entry.match.test(item.toLowerCase()));
  return rule ? rule.name : "Otros";
}
function showView(view) {
  $$(".view").forEach(section => section.classList.toggle("active", section.id === `view-${view}`));
  $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  const titles = { inicio: "¡Hola, Luis! Organicemos tus comidas", plan: "Tu plan, organizado a tu manera", compras: "Comprá con una lista clara", consejos: "Ideas para acompañar tu rutina", hidratacion: "Registrá el agua que tomás" };
  $("#page-title").textContent = titles[view] || titles.inicio;
  if (view === "plan") renderPlan();
  if (view === "compras") renderShoppingList();
  if (view === "consejos") renderTips();
  if (view === "hidratacion") renderWater();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderPlan() {
  $("#personal-meal-plan").innerHTML = Object.entries(plan).map(([key, meal]) => {
    const selected = Number(chosenOptions[key] || 0);
    const option = meal.options[selected];
    return `<article class="personal-meal-card">
      <div class="personal-meal-head"><div class="meal-emoji">${meal.emoji}</div><div><h3>${meal.title}</h3><p>Elegí una alternativa</p></div></div>
      <label class="eyebrow" for="select-${key}">OPCIONES DEL PLAN</label>
      <select class="option-select" id="select-${key}" data-meal="${key}">
        ${meal.options.map((item, index) => `<option value="${index}" ${index === selected ? "selected" : ""}>${item.title}</option>`).join("")}
      </select>
      <p class="option-description">${escapeHtml(option.description)}</p>
    </article>`;
  }).join("");
  $$("#personal-meal-plan select").forEach(select => select.addEventListener("change", () => {
    chosenOptions[select.dataset.meal] = Number(select.value);
    localStorage.setItem("nutri-chosen-options", JSON.stringify(chosenOptions));
    renderPlan();
    renderShoppingList();
  }));
  $("#snack-options").innerHTML = snacks.map(item => `<article class="snack-chip"><strong>${item.title}</strong>${item.description}</article>`).join("");
}
function ingredientsForChosenMeals() {
  const all = [];
  Object.entries(plan).forEach(([key, meal]) => {
    const option = meal.options[Number(chosenOptions[key] || 0)];
    option.ingredients.forEach(name => all.push({ name, category: categoryFor(name), id: `plan-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }));
  });
  // Eliminar duplicados por nombre y mantener las alternativas tal como aparecen en el plan.
  const unique = new Map();
  all.forEach(item => { if (!unique.has(item.name.toLowerCase())) unique.set(item.name.toLowerCase(), item); });
  return [...unique.values()];
}
function buildShoppingItems() {
  const generated = ingredientsForChosenMeals();
  const hidden = JSON.parse(localStorage.getItem("nutri-hidden-shopping-items") || "{}");
  const hiddenToday = new Set(hidden[localDayKey()] || []);
  const visibleGenerated = generated.filter(item => !hiddenToday.has(item.id));
  const manual = manualItems.map(item => ({ ...item }));
  currentShoppingItems = [...visibleGenerated, ...manual];
}
function renderShoppingList() {
  if (!$("#shopping-list")) return;
  buildShoppingItems();
  if (!currentShoppingItems.length) {
    $("#shopping-list").innerHTML = `<div class="empty-state">No hay productos en la lista todavía.</div>`;
    updateProgress();
    return;
  }
  const groups = [...new Set(currentShoppingItems.map(item => item.category))];
  $("#shopping-list").innerHTML = groups.map(category => {
    const items = currentShoppingItems.filter(item => item.category === category);
    return `<section class="shopping-group"><h3>${escapeHtml(category)}</h3>${items.map(item => {
      const checked = !!checkedItems[item.id];
      const isManual = String(item.id).startsWith("manual-");
      return `<div class="shopping-item-row">
        <label class="shopping-item ${checked ? "checked" : ""}"><input type="checkbox" data-item-id="${escapeHtml(item.id)}" ${checked ? "checked" : ""}><span>${escapeHtml(item.name)}</span></label>
        <button type="button" class="delete-shopping-item" data-delete-item="${escapeHtml(item.id)}" aria-label="Eliminar ${escapeHtml(item.name)}" title="${isManual ? "Quitar producto agregado" : "Quitar de la lista de hoy"}">×</button>
      </div>`;
    }).join("")}</section>`;
  }).join("");
  $$("#shopping-list input[type=checkbox]").forEach(input => input.addEventListener("change", () => {
    checkedItems[input.dataset.itemId] = input.checked;
    localStorage.setItem("nutri-checked-items", JSON.stringify(checkedItems));
    renderShoppingList();
  }));
  $$("#shopping-list [data-delete-item]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.deleteItem;
    if (String(id).startsWith("manual-")) {
      manualItems = manualItems.filter(item => item.id !== id);
      localStorage.setItem("nutri-manual-items", JSON.stringify(manualItems));
    } else {
      // Los ingredientes generados se ocultan para la fecha actual sin alterar las recetas.
      const hidden = JSON.parse(localStorage.getItem("nutri-hidden-shopping-items") || "{}");
      hidden[localDayKey()] = [...new Set([...(hidden[localDayKey()] || []), id])];
      localStorage.setItem("nutri-hidden-shopping-items", JSON.stringify(hidden));
    }
    delete checkedItems[id];
    localStorage.setItem("nutri-checked-items", JSON.stringify(checkedItems));
    renderShoppingList();
  }));
  updateProgress();
}
function updateProgress() {
  const total = currentShoppingItems.length;
  const done = currentShoppingItems.filter(item => checkedItems[item.id]).length;
  const percent = total ? Math.round(done / total * 100) : 0;
  $("#progress-text").textContent = `${done} de ${total} productos listos`;
  $("#progress-percent").textContent = `${percent}%`;
  $("#progress-bar").style.width = `${percent}%`;
  $("#shopping-count").textContent = total - done;
}
function localDayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function loadWaterLogs() {
  const all = JSON.parse(localStorage.getItem("nutri-water-logs") || "{}");
  return Array.isArray(all[localDayKey()]) ? all[localDayKey()] : [];
}
function saveWaterLogs(logs) {
  const all = JSON.parse(localStorage.getItem("nutri-water-logs") || "{}");
  all[localDayKey()] = logs;
  localStorage.setItem("nutri-water-logs", JSON.stringify(all));
}
function addWater(amount) {
  const logs = loadWaterLogs();
  logs.push({ id: `water-${Date.now()}-${Math.random().toString(16).slice(2)}`, amount: Number(amount), time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) });
  saveWaterLogs(logs);
  renderWater();
}
function renderWater() {
  const logs = loadWaterLogs();
  const total = logs.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  $("#water-total").textContent = total.toLocaleString("es-AR");
  $("#home-water-total").textContent = total.toLocaleString("es-AR");
  $("#home-water-count").textContent = `${logs.length} ${logs.length === 1 ? "registro" : "registros"} hoy`;
  $("#water-summary").textContent = logs.length ? `Registraste ${logs.length} ${logs.length === 1 ? "toma" : "tomas"} de agua hoy.` : "Todavía no registraste agua hoy.";
  if (!logs.length) {
    $("#water-log").innerHTML = `<div class="empty-state">Todavía no hay registros. Elegí una cantidad para empezar.</div>`;
    return;
  }
  $("#water-log").innerHTML = [...logs].reverse().map(entry => `<div class="water-log-item"><div class="water-log-icon">💧</div><div class="water-log-detail"><strong>Agua</strong><p>${escapeHtml(entry.time)}</p></div><span class="water-amount">${Number(entry.amount).toLocaleString("es-AR")} ml</span><button class="remove-water" data-remove-water="${escapeHtml(entry.id)}" aria-label="Eliminar registro">Quitar</button></div>`).join("");
  $$("[data-remove-water]").forEach(button => button.addEventListener("click", () => {
    saveWaterLogs(loadWaterLogs().filter(entry => entry.id !== button.dataset.removeWater));
    renderWater();
  }));
}
function renderTips() {
  const tip = tips[tipIndex % tips.length];
  $("#featured-tip-title").textContent = tip.title;
  $("#featured-tip-text").textContent = tip.text;
  $("#home-tip-title").textContent = tips[4].title;
  $("#home-tip").textContent = tips[4].text;
  $("#tips-grid").innerHTML = tips.map(item => `<article class="tip-card"><span class="tip-emoji">${item.emoji}</span><h3>${item.title}</h3><p>${item.text}</p></article>`).join("");
}
function showReminder(value) {
  $("#saved-reminder").textContent = `✓ Tu recordatorio: ${value}`;
  $("#reminder-input").value = value;
}
function init() {
  const today = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  $("#today-label").textContent = today.toLocaleUpperCase("es-AR");
  $("#date-chip").textContent = today;
  renderPlan();
  renderTips();
  renderShoppingList();
  renderWater();
  $$(".nav-item").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));
  $("#generate-list").addEventListener("click", renderShoppingList);
  $("#add-item-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#new-item").value.trim();
    if (!name) return;
    const category = $("#new-category").value;
    const id = `manual-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    manualItems.push({ name, category, id });
    localStorage.setItem("nutri-manual-items", JSON.stringify(manualItems));
    $("#new-item").value = "";
    renderShoppingList();
  });
  $("#another-tip").addEventListener("click", () => { tipIndex = (tipIndex + 1) % tips.length; renderTips(); });
  $$("[data-water-amount]").forEach(button => button.addEventListener("click", () => addWater(button.dataset.waterAmount)));
  $("#custom-water-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#custom-water-amount");
    const amount = Number(input.value);
    if (!Number.isFinite(amount) || amount < 1 || amount > 5000) return;
    addWater(amount);
    input.value = "";
  });
  $("#clear-water").addEventListener("click", () => {
    if (!loadWaterLogs().length) return;
    if (confirm("¿Querés borrar todos los registros de agua de hoy?")) {
      saveWaterLogs([]);
      renderWater();
    }
  });
  $("#reminder-form").addEventListener("submit", event => {
    event.preventDefault();
    const value = $("#reminder-input").value.trim();
    if (!value) return;
    localStorage.setItem("nutri-reminder", value);
    showReminder(value);
  });
  const saved = localStorage.getItem("nutri-reminder");
  if (saved) showReminder(saved);
}
document.addEventListener("DOMContentLoaded", init);
