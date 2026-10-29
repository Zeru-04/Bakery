const TAX_RATE = 0.12;

function addToCart(name, price) {
    if (localStorage.getItem("loggedIn") != "true") {
        alert("Please log in or sign up first before ordering.");
        return;
    }

    let quantity = localStorage.getItem("cart_" + name);

    if (quantity == null) {
        quantity = 0;
    }

    quantity = Number(quantity) + 1;

    localStorage.setItem("cart_" + name, quantity);
    localStorage.setItem("price_" + name, price);

    alert(name + " is added to cart!");
}

function showCart() {
    let cartItems = document.getElementById("cartItems");
    let cartHeaderTemplate = document.getElementById("cartHeaderTemplate");
    let cartRowTemplate = document.getElementById("cartRowTemplate");
    let total = 0;
    let hasItems = false;

    cartItems.replaceChildren();
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("cart_")) {
            hasItems = true;
            let name = key.replace("cart_", "");
            let quantity = Number(localStorage.getItem(key));
            let price = Number(localStorage.getItem("price_" + name));
            let subtotal = price * quantity;

            total = total + subtotal;

            let row = cartRowTemplate.content.firstElementChild.cloneNode(true);
            let decreaseButton = row.querySelector(".decrease-quantity");
            let increaseButton = row.querySelector(".increase-quantity");

            row.querySelector(".cart-product").textContent = name;
            row.querySelector(".cart-price").textContent = "₱" + price;
            row.querySelector(".cart-quantity").textContent = quantity;
            row.querySelector(".cart-subtotal").textContent = "₱" + subtotal;
            decreaseButton.setAttribute("aria-label", "Decrease " + name + " quantity");
            decreaseButton.disabled = quantity <= 1;
            decreaseButton.addEventListener("click", function() {
                changeQuantity(name, -1);
            });
            increaseButton.setAttribute("aria-label", "Increase " + name + " quantity");
            increaseButton.addEventListener("click", function() {
                changeQuantity(name, 1);
            });
            row.querySelector(".remove-btn").addEventListener("click", function() {
                removeItem(name);
            });

            cartItems.appendChild(row);
        }
    }

    if (hasItems) {
        cartItems.prepend(cartHeaderTemplate.content.firstElementChild.cloneNode(true));
        document.getElementById("cartTotal").textContent = "Total: ₱" + total;
    } else {
        cartItems.textContent = "Your cart is empty.";
        document.getElementById("cartTotal").textContent = "";
    }
}

function changeQuantity(name, change) {
    let quantityKey = "cart_" + name;
    let quantity = Number(localStorage.getItem(quantityKey));
    let updatedQuantity = quantity + change;

    if (!Number.isInteger(quantity) || updatedQuantity < 1) {
        return;
    }

    localStorage.setItem(quantityKey, updatedQuantity);
    showCart();
}

function removeItem(name) {
    localStorage.removeItem("cart_" + name);
    localStorage.removeItem("price_" + name);
    showCart();
}

function getSubtotal() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("cart_")) {
            let name = key.replace("cart_", "");
            let quantity = Number(localStorage.getItem(key));
            let price = Number(localStorage.getItem("price_" + name));
            total = total + (price * quantity);
        }
    }
    return total;
}

function calculateTotals() {
    let subtotal = getSubtotal();
    let discountRate = Number(document.getElementById("discountType").value);
    let discount = subtotal * discountRate;
    let tax = (subtotal - discount) * TAX_RATE;
    let finalTotal = subtotal - discount + tax;

    discount = Math.round(discount * 100) / 100;
    tax = Math.round(tax * 100) / 100;
    finalTotal = Math.round(finalTotal * 100) / 100;

    return { subtotal: subtotal, discount: discount, tax: tax, finalTotal: finalTotal };
}

function openCheckout() {
    // The user must be logged in
    if (localStorage.getItem("loggedIn") != "true") {
        alert("Please log in or sign up first before checking out.");
        return;
    }

    // The cart must not be empty
    if (getSubtotal() === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Clear the form
    document.getElementById("amountPaid").value = "";
    document.getElementById("paymentNumber").value = "";
    document.getElementById("checkoutError").textContent = "";

    // Show the checkout popup (this was the missing part)
    document.getElementById("checkoutModal").classList.add("show");
    updateCheckout();
}

function closeCheckout() {
    document.getElementById("checkoutModal").classList.remove("show");
}

function updateCheckout() {
    let totals = calculateTotals();
    let method = document.getElementById("paymentMethod").value;
    let amountInput = document.getElementById("amountPaid");

    let numberGroup = document.getElementById("numberGroup");
    let numberLabel = document.getElementById("numberLabel");
    let numberInput = document.getElementById("paymentNumber");

    if (method === "Cash") {
        amountInput.disabled = false;
        numberGroup.style.display = "none";
    } else {
        amountInput.disabled = true;
        amountInput.value = totals.finalTotal.toFixed(2);
        numberGroup.style.display = "block";

        if (method === "GCash") {
            numberLabel.textContent = "GCash Mobile Number";
            numberInput.placeholder = "09XXXXXXXXX";
            numberInput.maxLength = 11;
        } else {
            numberLabel.textContent = "Card Number";
            numberInput.placeholder = "16-digit card number";
            numberInput.maxLength = 16;
        }
    }

    let paid = Number(amountInput.value);
    let change = paid - totals.finalTotal;
    if (change < 0) {
        change = 0;
    }

    document.getElementById("sumSubtotal").textContent = "₱" + totals.subtotal.toFixed(2);
    document.getElementById("sumDiscount").textContent = "-₱" + totals.discount.toFixed(2);
    document.getElementById("sumTax").textContent = "₱" + totals.tax.toFixed(2);
    document.getElementById("sumTotal").textContent = "₱" + totals.finalTotal.toFixed(2);
    document.getElementById("sumChange").textContent = "₱" + change.toFixed(2);
}

function changePayment() {
    updateCheckout();

    let method = document.getElementById("paymentMethod").value;

    if (method === "Cash") {
        document.getElementById("amountPaid").focus();
    } else {
        document.getElementById("paymentNumber").focus();
    }
}

function getOrderList() {
    let list = "";
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("cart_")) {
            let name = key.replace("cart_", "");
            let quantity = Number(localStorage.getItem(key));
            let price = Number(localStorage.getItem("price_" + name));
            list = list + "- " + name + " x" + quantity + " = ₱" + (price * quantity).toFixed(2) + "\n";
        }
    }
    return list;
}

function confirmPayment() {
    let totals = calculateTotals();
    let method = document.getElementById("paymentMethod").value;
    let paid = Number(document.getElementById("amountPaid").value);
    let error = document.getElementById("checkoutError");

    if (method === "Cash" && paid < totals.finalTotal) {
        error.textContent = "Amount paid is not enough.";
        return;
    }

    if (method === "GCash" || method === "Credit Card") {
        let number = document.getElementById("paymentNumber").value.trim();
        let onlyDigits = /^[0-9]+$/.test(number);

        if (method === "GCash" && (!onlyDigits || number.length !== 11 || !number.startsWith("09"))) {
            error.textContent = "Enter a valid 11-digit GCash number (09XXXXXXXXX).";
            return;
        }

        if (method === "Credit Card" && (!onlyDigits || number.length !== 16)) {
            error.textContent = "Enter a valid 16-digit card number.";
            return;
        }
    }

    let change = paid - totals.finalTotal;
    let orderList = getOrderList();

    for (let i = localStorage.length - 1; i >= 0; i--) {
        let key = localStorage.key(i);
        if (key.startsWith("cart_") || key.startsWith("price_")) {
            localStorage.removeItem(key);
        }
    }

    closeCheckout();
    showCart();
    let message = "Transaction is done. Thank you for your order!\n\n" +
        "Ordered Items:\n" + orderList + "\n" +
        "Payment Method: " + method + "\n" +
        "Total: ₱" + totals.finalTotal.toFixed(2);

    if (method === "Cash") {
        message = message + "\nPaid: ₱" + paid.toFixed(2) + "\nChange: ₱" + change.toFixed(2);
    }

    alert(message);
}

if (document.getElementById("cartItems") != null) {
    showCart();
}
