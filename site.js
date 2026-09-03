(function () {
  var analyticsId = window.LEDGER_ANALYTICS_ID || "";
  var consentKey = "ledger-cookie-consent";

  function loadAnalytics() {
    if (!analyticsId || document.querySelector("script[data-ledger-analytics]"))
      return;
    var script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(analyticsId);
    script.dataset.ledgerAnalytics = "true";
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true });
  }

  function setConsent(value) {
    localStorage.setItem(consentKey, value);
    var banner = document.querySelector("[data-cookie-banner]");
    if (banner) banner.hidden = true;
    if (value === "accepted") loadAnalytics();
  }

  function setupCookieBanner() {
    var banner = document.querySelector("[data-cookie-banner]");
    if (!banner || localStorage.getItem(consentKey)) return;
    banner.hidden = false;
    var accept = banner.querySelector("[data-cookie-accept]");
    var decline = banner.querySelector("[data-cookie-decline]");
    if (accept)
      accept.addEventListener("click", function () {
        setConsent("accepted");
      });
    if (decline)
      decline.addEventListener("click", function () {
        setConsent("declined");
      });
  }

  function setupLoadingState() {
    window.addEventListener("load", function () {
      document.documentElement.classList.add("page-ready");
      var loader = document.querySelector("[data-page-loader]");
      if (loader)
        window.setTimeout(function () {
          loader.hidden = true;
        }, 180);
    });
  }

  function setupMobileCta() {
    var cta = document.querySelector("[data-mobile-cta]");
    if (!cta) return;
    var dismissed = false;
    window.addEventListener(
      "scroll",
      function () {
        if (dismissed) return;
        cta.classList.toggle("is-visible", window.scrollY > 280);
      },
      { passive: true },
    );
    var close = cta.querySelector("[data-mobile-cta-close]");
    if (close)
      close.addEventListener("click", function () {
        dismissed = true;
        cta.classList.remove("is-visible");
      });
  }

  function setupFormState() {
    var form = document.querySelector("#contact-form");
    var submit = form && form.querySelector("[data-fs-submit-btn]");
    if (!form || !submit) return;
    form.addEventListener(
      "submit",
      function () {
        submit.disabled = true;
        submit.textContent = "Sending...";
      },
      true,
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupCookieBanner();
    setupLoadingState();
    setupMobileCta();
    setupFormState();
    if (localStorage.getItem(consentKey) === "accepted") loadAnalytics();
  });
})();
