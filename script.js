// Exercise 3: ปุ่มเปลี่ยนข้อความ + ปุ่มสลับธีม (ทั้งสองปุ่มใช้งานได้จริง)
"use strict";

const statusEl = document.querySelector("#status");
const helloBtn = document.querySelector("#helloBtn");
const themeBtn = document.querySelector("#themeBtn");

// ปุ่มทักทาย — บอกเวลาด้วย จะได้เห็นว่าเป็นค่าที่คำนวณสด ไม่ใช่ข้อความแปะไว้
helloBtn.addEventListener("click", () => {
  const now = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  statusEl.textContent = `Hello from GitHub Pages! (${now})`;
});

// จำธีมที่เลือกไว้ใน localStorage — รีเฟรชหน้าแล้วยังเป็นธีมเดิม
const THEME_KEY = "lab-theme";

function applyTheme(mode) {
  const dark = mode === "dark";
  document.body.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "โหมดกลางวัน" : "โหมดกลางคืน";
  themeBtn.setAttribute("aria-pressed", String(dark));
}

themeBtn.addEventListener("click", () => {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* เบราว์เซอร์โหมดส่วนตัวอาจปิด localStorage — ธีมยังสลับได้ แค่ไม่ถูกจำ */
  }
});

// ครั้งแรกที่เปิด: ใช้ค่าที่เคยเลือก ถ้าไม่มีให้ตามการตั้งค่าของเครื่อง
let saved = null;
try {
  saved = localStorage.getItem(THEME_KEY);
} catch {
  saved = null;
}
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(saved || (prefersDark ? "dark" : "light"));
