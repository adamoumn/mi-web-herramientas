// Los datos personales están en config.js
var _E = typeof CONTACT_EMAIL === "string" ? CONTACT_EMAIL : "";
var _N = typeof OWNER_NAME === "string" ? OWNER_NAME : "";
var _I = typeof OWNER_ID === "string" ? OWNER_ID.trim() : "";
var _D = typeof DONATE_URL === "string" ? DONATE_URL : "";
var $ = function (i) { return document.getElementById(i); };
function words(t) { var m = t.trim().match(/\S+/g); return m ? m.length : 0; }
function fmt(n) { return n.toLocaleString("es-ES"); }
function say(t, c) { var s = $("st"); if (s) { s.textContent = t; s.className = "status " + (c || (/…$/.test(t) ? "work" : "")); } }
async function api(path, payload) {
  var r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  var d = await r.json().catch(function () { return {}; });
  if (!r.ok) throw new Error(d.error || "No se pudo completar la acción. Inténtalo de nuevo.");
  if (d.remaining != null) {
    var el = $("left");
    if (!el) { el = document.createElement("p"); el.id = "left"; el.className = "meta"; var st = $("st"); if (st) st.parentNode.insertBefore(el, st.nextSibling); }
    el.textContent = "Usos gratuitos que te quedan hoy: " + d.remaining + ".";
  }
  return d;
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); say("Texto copiado.", "ok"); }
  catch (e) { say("No se pudo copiar. Selecciona el texto y usa Ctrl+C."); }
}
function counter(inp, el, max) {
  inp.addEventListener("input", function () {
    var n = words(inp.value);
    el.textContent = fmt(n) + " / " + fmt(max) + " palabras";
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
