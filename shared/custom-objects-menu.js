(function () {
  var MARGIN = 8;
  var CLOSE_DELAY = 300;

  function place(menu) {
    var anchor = menu.closest(".sidebar-objects");
    if (!anchor) return;

    var anchorTop = anchor.getBoundingClientRect().top;
    var height = menu.offsetHeight;
    var offset = 0;

    if (anchorTop + height > window.innerHeight - MARGIN) {
      offset = anchorTop + height - (window.innerHeight - MARGIN);
    }

    if (anchorTop - offset < MARGIN) {
      offset = anchorTop - MARGIN;
    }

    menu.style.top = -offset + "px";
  }

  function placeAll() {
    document.querySelectorAll(".objects-flyout").forEach(place);
  }

  document.addEventListener("pointerenter", function (event) {
    var anchor = event.target.closest && event.target.closest(".sidebar-objects");
    if (!anchor) return;
    clearTimeout(anchor.closeTimer);
    anchor.classList.add("is-open");
    var menu = anchor.querySelector(".objects-flyout");
    if (menu) place(menu);
  }, true);

  document.addEventListener("pointerleave", function (event) {
    var anchor = event.target;
    if (!anchor.classList || !anchor.classList.contains("sidebar-objects")) return;
    clearTimeout(anchor.closeTimer);
    anchor.closeTimer = setTimeout(function () {
      anchor.classList.remove("is-open");
    }, CLOSE_DELAY);
  }, true);

  window.addEventListener("resize", placeAll);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", placeAll);
  } else {
    placeAll();
  }

  function fillFlyout(objects) {
    var baseEl = document.querySelector("[data-base]");
    var base = baseEl ? baseEl.getAttribute("data-base") || "" : "";
    document.querySelectorAll(".objects-flyout").forEach(function (menu) {
      menu.querySelectorAll(".objects-flyout-item:not(.objects-flyout-create)").forEach(function (item) {
        item.remove();
      });
      var divider = menu.querySelector(".objects-flyout-divider");
      objects.forEach(function (item) {
        var link = document.createElement("a");
        link.className = "objects-flyout-item";
        link.href = base + "custom-objects/objeto/?objeto=" + encodeURIComponent(item.name);
        link.textContent = item.name;
        if (divider) menu.insertBefore(link, divider);
        else menu.appendChild(link);
      });
    });
    placeAll();
  }

  async function loadFlyout() {
    var client = window.__sbClient;
    if (!client || !window.__auth || !window.__auth.getSession) return;
    try {
      var session = await window.__auth.getSession();
      if (!session) return;
      var result = await client
        .from("custom_objects")
        .select("name, status, created_at")
        .eq("kind", "personalizado")
        .eq("status", "ativo")
        .eq("show_in_catalog", true)
        .order("created_at", { ascending: true });
      if (result.error || !result.data) return;
      var order = ["Alunos", "Contratos"];
      var objects = result.data.slice().sort(function (a, b) {
        var ai = order.indexOf(a.name);
        var bi = order.indexOf(b.name);
        if (ai === -1 && bi === -1) return a.created_at < b.created_at ? -1 : 1;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      fillFlyout(objects);
    } catch (error) {
      return;
    }
  }

  window.__reloadCustomObjectsMenu = loadFlyout;
  loadFlyout();
})();
