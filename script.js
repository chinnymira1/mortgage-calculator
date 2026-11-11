"use strict";

const mortgageAmountField = document.querySelector("#amount");
const mortgageTermField = document.querySelector("#term");
const mortgageRateField = document.querySelector("#interest-rate");
const resetBtn = document.querySelector("#clear-all");
const mortgageForm = document.querySelector("#mortgage-form");

const NO_OF_MONTHS_IN_YEAR = 12;

mortgageForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mortgageAmount = Number(mortgageAmountField.value);
  const mortgageTermYears = Number(mortgageTermField.value);
  const mortgageRateAnnual = Number(mortgageRateField.value);

  const radioBtn = document.querySelector('input[name="mortgage"]:checked');

  // Validate fields first
  if (
    !mortgageAmount ||
    !mortgageRateAnnual ||
    !mortgageTermYears ||
    !radioBtn
  ) {
    alert("Please fill in all fields and select a mortgage type.");
    return;
  }

  let monthlyPayment;

  if (radioBtn.value === "repayment") {
    monthlyPayment = calculateRepaymentOnly(
      mortgageAmount,
      mortgageRateAnnual,
      mortgageTermYears,
    );
  }

  if (radioBtn.value === "interest-only") {
    monthlyPayment = calculateInterestOnly(mortgageAmount, mortgageRateAnnual);
  }
  displayResult(
    monthlyPayment,
    mortgageTermYears,
    radioBtn.value,
    mortgageAmount,
  );

  // console.log(
  //   "Monthly Payment:",
  //   monthlyPayment,
  //   radioBtn.value,
  //   mortgageAmount,
  // );
});

resetBtn.addEventListener("click", reset);

function reset() {
  mortgageAmountField.value =
    mortgageTermField.value =
    mortgageRateField.value =
      "";
}

function calculateInterestOnly(mortgageAmount, mortgageRateAnnual) {
  const monthlyRate = mortgageRateAnnual / 100 / NO_OF_MONTHS_IN_YEAR;
  const valueToPay = mortgageAmount * monthlyRate;

  return Number(valueToPay.toFixed(2));
}

// Calculates Full Repayment Monthly Payment (Principal + Interest)
function calculateRepaymentOnly(
  mortgageAmount,
  mortgageRateAnnual,
  mortgageTermYears,
) {
  // Convert inputs to monthly values
  const monthlyRate = mortgageRateAnnual / 100 / NO_OF_MONTHS_IN_YEAR;
  const totalMonths = mortgageTermYears * NO_OF_MONTHS_IN_YEAR;

  const rateFactor = (1 + monthlyRate) ** totalMonths;
  const numerator = mortgageAmount * monthlyRate * rateFactor;
  const denominator = rateFactor - 1;

  const valueToPay = numerator / denominator;

  return valueToPay;
}

function displayResult(
  monthlyPayment,
  mortgageTermYears,
  mortgageType,
  mortgageAmount,
) {
  const rightHandSide = document.querySelector(".empty-state");
  const results = document.querySelector(".results");
  const repayment = document.querySelector("#monthly-repayment");
  const totalRepayment = document.querySelector("#total-repayment-value");
  const mortgageAmountResult = document.querySelector("#mortgage-amount-value");
  const monthlyPaymentLabel = document.querySelector("#monthly-payment-label");
  const totalPaymentLabel = document.querySelector("#total-payment-label");

  // results.classList.remove("hidden");
  rightHandSide.innerHTML = "";
  results.style.display = "block";
  const formattedValue = formatCurrency(monthlyPayment);

  if (mortgageType === "repayment") {
    const totalMonths = mortgageTermYears * NO_OF_MONTHS_IN_YEAR;

    const totalRepaymentValue = monthlyPayment * totalMonths;

    repayment.textContent = `$${formatCurrency(monthlyPayment)}`;

    totalRepayment.textContent = `$${formatCurrency(totalRepaymentValue)}`;
    mortgageAmountResult.textContent = "";

    monthlyPaymentLabel.textContent = "Your monthly repayments";
    totalPaymentLabel.textContent = "Total you'll repay over the term";
  }

  if (mortgageType === "interest-only") {
    const totalInterest =
      monthlyPayment * NO_OF_MONTHS_IN_YEAR * mortgageTermYears;
    repayment.textContent = `$${formatCurrency(monthlyPayment)}`;

    totalRepayment.textContent = `$${formatCurrency(totalInterest)}`;
    mortgageAmountResult.textContent = `$${formatCurrency(mortgageAmount)}`;

    monthlyPaymentLabel.textContent = "Your monthly interest payment";
    totalPaymentLabel.textContent = "Total interest you'll pay over the term";
  }
}

function formatCurrency(numberString) {
  // Convert the string to a floating-point number
  const number = parseFloat(numberString);

  // Return a fallback or 0 if the input isn't a valid number
  if (isNaN(number)) return "0.00";

  // Format using standard US-style numbering (commas for thousands)
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
} //
