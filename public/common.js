// ====== DATOS QUE TIENES QUE RELLENAR (se aplican a toda la web) ======
var CONTACT_EMAIL = "tu-correo@ejemplo.com"; // tu email de contacto
var OWNER_NAME = "[Tu nombre o razón social]"; // titular de la web
var OWNER_ID = "[Tu NIF/DNI]";                 // identificación fiscal
var DONATE_URL = "";                           // enlace de Ko-fi (opcional)
// =====================================================================
var $ = function (i) { return document.getElementById(i); };
function words(t) { var m = t.trim().match(/\S+/g); return m ? m.length : 0; }
function fmt(n) { return n.toLocaleString("es-ES"); }
function say(t, c) { var s = $("st"); if (s) { s.textContent = t; s.className = "status " + (c || ""); } }
async function api(path, payload) {
  var r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  var d = await r.json().catch(function () { return {}; });
  if (!r.ok) throw new Error(d.error || "No se pudo completar la acción. Inténtalo de nuevo.");
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
  e.textContent = CONTACT_EMAIL; if (e.tagName === "A") e.href = "mailto:" + CONTACT_EMAIL;
});
document.querySelectorAll("[data-owner]").forEach(function (e) { e.textContent = OWNER_NAME; });
document.querySelectorAll("[data-ownerid]").forEach(function (e) { e.textContent = OWNER_ID; });
if (DONATE_URL) document.querySelectorAll("[data-donate]").forEach(function (e) { e.href = DONATE_URL; e.hidden = false; });
