document.getElementById("year").textContent = new Date().getFullYear();

const packageSelect = document.getElementById("packageSelect");
const priceLabel = document.getElementById("priceLabel");

function updatePrice() {
  const val = packageSelect.value || "";
  if (val.includes("$700")) priceLabel.textContent = "$700";
  else if (val.includes("$400")) priceLabel.textContent = "$400";
  else priceLabel.textContent = "$—";
}

packageSelect.addEventListener("change", updatePrice);
updatePrice();

const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch(form.action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    alert("Sent! DJ Smoov will text you back soon.");
    form.reset();
    updatePrice();
  } else {
    alert("Something went wrong. Please try again.");
  }
});