let breadFilterBtn = document.querySelectorAll('.breadFilter');
let cakeFilterBtn = document.querySelectorAll('.cakeFilter');
let pastryFilterBtn = document.querySelectorAll('.pastryFilter');
let drinksFilterBtn = document.querySelectorAll('.drinksFilter');
let allFilterBtn = document.querySelectorAll('.allFilter');

allFilterBtn.forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".breadType").forEach(element => {
          element.style.display = "";
      });

      document.querySelectorAll(".cakeType").forEach(element => {
          element.style.display = "";
      });

      document.querySelectorAll(".pastryType").forEach(element => {
          element.style.display = "";
      });

      document.querySelectorAll(".drinksType").forEach(element => {
        element.style.display = "";
      });
    });
});

breadFilterBtn.forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".breadType").forEach(element => {
          element.style.display = "";
      });
 
      document.querySelectorAll(".cakeType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".pastryType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".drinksType").forEach(element => {
        element.style.display = "none";
      });
    });
});

cakeFilterBtn.forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".cakeType").forEach(element => {
          element.style.display = "";
      });

      document.querySelectorAll(".breadType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".pastryType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".drinksType").forEach(element => {
        element.style.display = "none";
      });
    });
});

pastryFilterBtn.forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".pastryType").forEach(element => {
          element.style.display = "";
      });

      document.querySelectorAll(".breadType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".cakeType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".drinksType").forEach(element => {
        element.style.display = "none";
      });
    });
});

drinksFilterBtn.forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll(".pastryType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".breadType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".cakeType").forEach(element => {
          element.style.display = "none";
      });

      document.querySelectorAll(".drinksType").forEach(element => {
        element.style.display = "";
      });
    });
});


let categoryButtons = document.querySelectorAll(".category-buttons button");

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener("click", function () {
        for (let j = 0; j < categoryButtons.length; j++) {
            categoryButtons[j].classList.remove("active");
        }
        categoryButtons[i].classList.add("active");
    });
}

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
    let html = "";
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("cart_")) {
            let name = key.replace("cart_", "");
            let quantity = Number(localStorage.getItem(key));
            let price = Number(localStorage.getItem("price_" + name));
            let subtotal = price * quantity;

            total = total + subtotal;

           html = html + "<div class='cart-row'>" +
            "<span>" + name + "</span>" +
            "<span>₱" + price + "</span>" +
            "<span>" + quantity + "</span>" +
            "<span>₱" + subtotal + "</span>" +
            "<button class='remove-btn' onclick=\"removeItem('" + name + "')\">Remove</button>" +
            "</div>";
        }
    }
   if (html == "") {
    document.getElementById("cartItems").innerHTML = "Your cart is empty.";
    document.getElementById("cartTotal").innerHTML = "";
}
    else {
    let header = "<div class='cart-row cart-header'>" +
                 "<span>Product</span>" +
                 "<span>Price</span>" +
                 "<span>Quantity</span>" +
                 "<span>Total</span>" +
                 "<span></span>" +
                 "</div>";

    document.getElementById("cartItems").innerHTML = header + html;
    document.getElementById("cartTotal").innerHTML = "Total: ₱" + total;
}
}

function removeItem(name) {
    localStorage.removeItem("cart_" + name);
    localStorage.removeItem("price_" + name);
    showCart();
}

function checkout() {
    if (document.getElementById("cartTotal").innerHTML == "") {
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