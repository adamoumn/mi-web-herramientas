// Los datos personales están en config.js
var _E = typeof CONTACT_EMAIL === "string" ? CONTACT_EMAIL : "";
var _N = typeof OWNER_NAME === "string" ? OWNER_NAME : "";
var _I = typeof OWNER_ID === "string" ? OWNER_ID.trim() : "";
var _D = typeof DONATE_URL === "string" ? DONATE_URL : "";
var LANG = (document.documentElement.lang || "es").slice(0, 2);
var LOC = LANG === "en" ? "en-US" : "es-ES";
var $ = function (i) { return document.getElementById(i); };
function words(t) { var m = t.trim().match(/\S+/g); return m ? m.length : 0; }
function fmt(n) { return n.toLocaleString(LOC); }
function say(t, c) { var s = $("st"); if (s) { s.textContent = t; s.className = "status " + (c || (/…$/.test(t) ? "work" : "")); } }
async function api(path, payload) {
  var r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ lang: LANG }, payload)) });
  var d = await r.json().catch(function () { return {}; });
  if (!r.ok) throw new Error(d.error || (LANG === "en" ? "Could not complete the action. Please try again." : "No se pudo completar la acción. Inténtalo de nuevo."));
  if (d.remaining != null) {
    var el = $("left");
    if (!el) { el = document.createElement("p"); el.id = "left"; el.className = "meta"; var st = $("st"); if (st) st.parentNode.insertBefore(el, st.nextSibling); }
    el.textContent = "Usos gratuitos que te quedan hoy: " + d.remaining + ".";
  }
  return d;
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); say(LANG === "en" ? "Text copied." : "Texto copiado.", "ok"); }
  catch (e) { say(LANG === "en" ? "Could not copy. Select the text and press Ctrl+C." : "No se pudo copiar. Selecciona el texto y usa Ctrl+C."); }
}
function counter(inp, el, max) {
  inp.addEventListener("input", function () {
    var n = words(inp.value);
    el.textContent = fmt(n) + " / " + fmt(max) + (LANG === "en" ? " words" : " palabras");
    el.className = "meta" + (n > max ? " bad" : "");
  });
}
document.querySelectorAll("[data-email]").forEach(function (e) {
  e.textContent = _E; if (e.tagName === "A") e.href = "mailto:" + _E;
});
document.querySelectorAll("[data-owner]").forEach(function (e) { e.textContent = _N; });
document.querySelectorAll("[data-ownerid]").forEach(function (e) { e.textContent = _I; });
document.querySelectorAll(".idline").forEach(function (e) { e.hidden = !_I; });
if (_D) document.querySelectorAll("[data-donate]").forEach(function (e) { e.href = _D; e.hidden = false; });

(function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var els = document.querySelectorAll(".tool,.points p,details,.two>.panel,.prose h2,.pill,.cta");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.classList.add("reveal"); el.style.setProperty("--d", (i % 3) * 90 + "ms"); io.observe(el); });
})();

// ---- Menú desplegable de herramientas ----
(function () {
  var b = document.querySelector(".dd-btn"), m = document.querySelector(".dd-menu");
  if (!b || !m) return;
  function close() { m.hidden = true; b.setAttribute("aria-expanded", "false"); }
  b.addEventListener("click", function (e) { e.stopPropagation(); var open = m.hidden; m.hidden = !open; b.setAttribute("aria-expanded", String(open)); });
  document.addEventListener("click", function (e) { if (!m.contains(e.target)) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
// ---- Selector y aviso de idioma (no redirige: ofrece el cambio) ----
(function () {
  function get() { try { return localStorage.getItem("langpref"); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem("langpref", v); } catch (e) {} }
  document.querySelectorAll("[data-lang]").forEach(function (a) { a.addEventListener("click", function () { set(a.getAttribute("data-lang")); }); });
  var other = LANG === "es" ? "en" : "es", alt = document.querySelector('link[rel="alternate"][hreflang="' + other + '"]');
  if (!alt) return;
  var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "es"]).map(function (l) { return String(l).toLowerCase(); });
  var wants = get() || (langs.some(function (l) { return l.indexOf("es") === 0; }) ? "es" : "en");
  if (wants === LANG) return;
  var T = wants === "en"
    ? { t: "This site is also available in English.", go: "Switch to English", stay: "Stay here" }
    : { t: "Esta web también está disponible en español.", go: "Ir a la versión en español", stay: "Seguir aquí" };
  var bar = document.createElement("div");
  bar.className = "langbar"; bar.setAttribute("role", "dialog");
  bar.innerHTML = "<span></span><button class=\"main\"></button><button></button>";
  bar.children[0].textContent = T.t; bar.children[1].textContent = T.go; bar.children[2].textContent = T.stay;
  bar.children[1].addEventListener("click", function () { set(wants); location.href = alt.href; });
  bar.children[2].addEventListener("click", function () { set(LANG); bar.remove(); });
  document.body.appendChild(bar);
})();
