(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Contact form validation
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  var validators = {
    name: function (v) {
      return v.trim().length > 1 ? "" : "Enter your name.";
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? "" : "Enter a valid email address.";
    },
    budget: function (v) {
      return v ? "" : "Select a budget range.";
    },
    message: function (v) {
      return v.trim().length >= 10 ? "" : "Tell us a bit more (10 characters minimum).";
    }
  };

  function showError(field, message) {
    var row = field.closest(".form-row");
    var errorEl = document.getElementById(field.id + "-error");
    if (message) {
      row.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      row.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validateField(field) {
    var validate = validators[field.name];
    if (!validate) return true;
    var message = validate(field.value);
    showError(field, message);
    return !message;
  }

  ["name", "email", "budget", "message"].forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener("blur", function () {
      validateField(field);
    });
    field.addEventListener("input", function () {
      if (field.closest(".form-row").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot — if filled, silently drop it, pretend success
    var hp = form.elements["website"];
    if (hp && hp.value) {
      status.textContent = "Thanks — we'll be in touch within one business day.";
      status.className = "form-status success";
      form.reset();
      return;
    }

    var fieldsToCheck = ["name", "email", "budget", "message"];
    var allValid = true;
    var firstInvalid = null;

    fieldsToCheck.forEach(function (name) {
      var field = form.elements[name];
      var valid = validateField(field);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields before sending.";
      status.className = "form-status error";
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend wired up in this build — simulate a successful submission.
    status.textContent = "Thanks — your brief is in. We'll reply within one business day.";
    status.className = "form-status success";
    form.reset();
  });
})();
