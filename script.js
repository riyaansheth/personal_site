const list = document.getElementById("accomplishmentList")
const STORAGE_KEY = "riyaan_accomplishments"
const ADMIN_PASSWORD = "riyaan_only"

function loadAchievements() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  list.innerHTML = ""
  data.forEach(item => {
    const li = document.createElement("li")
    li.textContent = item
    list.appendChild(li)
  })
}

function addAchievement() {
  const pass = document.getElementById("adminPass").value
  const text = document.getElementById("achievementText").value

  if (pass !== ADMIN_PASSWORD || text.trim() === "") return

  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  data.push(text)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

  document.getElementById("achievementText").value = ""
  loadAchievements()
}

loadAchievements()

window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    const top = el.getBoundingClientRect().top
    if (top < window.innerHeight - 100) {
      el.classList.add("active")
    }
  })
})

const text = "Riyaan Sheth | AI Developer"
let i = 0
function type() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i)
    i++
    setTimeout(type, 70)
  }
}
type()

particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    size: { value: 3 },
    move: { speed: 1.5 },
    line_linked: { enable: true },
    color: { value: "#ffffff" }
  }
})

document.querySelectorAll(".resume-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.95)"
    setTimeout(() => {
      btn.style.transform = ""
    }, 150)
  })
})
