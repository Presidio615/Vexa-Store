let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


const cartContainer =
    document.getElementById("cart-container");

const cartSubtotal =
    document.getElementById("cart-subtotal");

const cartTotal =
    document.getElementById("cart-total");

const cartCount =
    document.getElementById("cart-count");

const clearCartButton =
    document.getElementById("clear-cart");

const checkoutButton =
    document.getElementById("checkout-button");


// DISPLAY CART

function displayCart() {

    cartContainer.innerHTML = "";


    // EMPTY CART

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty</h2>

                <p>
                    You haven't added any products yet.
                </p>

                <a
                    href="index.html"
                    class="shop-button">

                    Continue Shopping

                </a>

            </div>

        `;


        cartSubtotal.textContent = "₦0";

        cartTotal.textContent = "₦0";

        checkoutButton.style.display = "none";

        updateCartCount();

        return;
    }


    checkoutButton.style.display = "block";


    // DISPLAY ITEMS

    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        const nairaPrice =
            item.price * 1500;


        const itemSubtotal =
            nairaPrice * item.quantity;


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.title}"
                class="cart-item-image"
            >


            <div>

                <h3 class="cart-item-title">
                    ${item.title}
                </h3>

                <p class="cart-item-price">
                    ₦${nairaPrice.toLocaleString()}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${item.id})">

                    −

                </button>


                <span class="quantity">
                    ${item.quantity}
                </span>


                <button
                    onclick="increaseQuantity(${item.id})">

                    +

                </button>

            </div>


            <strong>
                ₦${itemSubtotal.toLocaleString()}
            </strong>


            <button
                class="remove-item"
                onclick="removeItem(${item.id})">

                Remove

            </button>

        `;


        cartContainer.appendChild(cartItem);

    });


    calculateTotal();

    updateCartCount();

}


// INCREASE QUANTITY

function increaseQuantity(id) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (item) {

        item.quantity++;

    }


    saveCart();

}


// DECREASE QUANTITY

function decreaseQuantity(id) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart =
            cart.filter(
                product => product.id !== id
            );

    }


    saveCart();

}


// REMOVE ITEM

function removeItem(id) {

    cart =
        cart.filter(
            product => product.id !== id
        );


    saveCart();

}


// CLEAR CART

clearCartButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to clear your cart?"
            );


        if (!confirmed) {
            return;
        }


        cart = [];

        saveCart();

    }
);


// SAVE CART

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}


// CALCULATE TOTAL

function calculateTotal() {

    const total =
        cart.reduce(
            (sum, item) => {

                const price =
                    item.price * 1500;

                return sum +
                    (price * item.quantity);

            },
            0
        );


    cartSubtotal.textContent =
        `₦${total.toLocaleString()}`;


    cartTotal.textContent =
        `₦${total.toLocaleString()}`;

}


// UPDATE CART COUNT

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;

}


// INITIALIZE

displayCart();