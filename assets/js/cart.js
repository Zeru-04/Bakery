function addToCart(name, price) {
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

function checkout() {
    if (document.getElementById("cartTotal").textContent === "") {
        alert("Your cart is empty.");
        return;
    }

    for (let i = localStorage.length - 1; i >= 0; i--) {
        let key = localStorage.key(i);

        if (key.startsWith("cart_") || key.startsWith("price_")) {
            localStorage.removeItem(key);
        }
    }
    alert("Thank you! Your order has been placed.");
    showCart();
}
if (document.getElementById("cartItems") != null) {
    showCart();
}