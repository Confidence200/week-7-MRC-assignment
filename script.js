const form = document.getElementById("form");
const emptyBox = document.getElementById("empty");
const filledBox = document.getElementById("filled");
const monthlyEl = document.getElementById("monthly");
const totalEl = document.getElementById("total");

// Turn "250,000" or "250000" into the number 250000
function toNumber(text) {
  return parseFloat(text.replace(/,/g, ""));
}

// Format a number as pounds, like £1,234.56
function money(n) {
  return (
    "£" +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function setError(field, hasError) {
  field.classList.toggle("invalid", hasError);
  field.querySelector(".error").hidden = !hasError;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const amountField = document.getElementById("amount");
  const termField = document.getElementById("term");
  const rateField = document.getElementById("rate");
  const typeField = document.getElementById("type-field");
  const type = form.querySelector('input[name="type"]:checked');

  const amount = toNumber(amountField.value);
  const years = toNumber(termField.value);
  const rate = toNumber(rateField.value);

  // Check every field and show or hide its error message
  const checks = [
    [amountField.closest(".field"), !(amount > 0)],
    [termField.closest(".field"), !(years > 0)],
    [rateField.closest(".field"), isNaN(rate) || rate < 0],
    [typeField, !type],
  ];
  let allGood = true;
  checks.forEach(function (c) {
    setError(c[0], c[1]);
    if (c[1]) allGood = false;
  });

  if (!allGood) {
    emptyBox.hidden = false;
    filledBox.hidden = true;
    return;
  }

  const months = years * 12;
  const r = rate / 100 / 12; // monthly interest rate
  let monthly;

  if (type.value === "repayment") {
    // Standard mortgage formula: M = P * r(1+r)^n / ((1+r)^n - 1)
    monthly =
      r === 0
        ? amount / months
        : (amount * r * Math.pow(1 + r, months)) /
          (Math.pow(1 + r, months) - 1);
  } else {
    // Interest only: you just pay the interest each month
    monthly = amount * r;
  }
  const total = monthly * months;

  monthlyEl.textContent = money(monthly);
  totalEl.textContent = money(total);
  emptyBox.hidden = true;
  filledBox.hidden = false;
});

document.getElementById("clear").addEventListener("click", function () {
  form.reset();
  form.querySelectorAll(".field").forEach(function (f) {
    setError(f, false);
  });
  emptyBox.hidden = false;
  filledBox.hidden = true;
});
