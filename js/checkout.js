emailjs.init({
    publicKey: "O3k3b5Z4J22YCA26v"
});

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


const checkoutItems =
    document.getElementById("checkout-items");

const checkoutSubtotal =
    document.getElementById("checkout-subtotal");

const checkoutTotal =
    document.getElementById("checkout-total");

const checkoutForm =
    document.getElementById("checkout-form");

const cartCount =
    document.getElementById("cart-count");


// =========================
// DISPLAY CHECKOUT ITEMS
// =========================

function displayCheckoutItems() {

    checkoutItems.innerHTML = "";


    // EMPTY CART

    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <p>
                Your cart is empty.
            </p>

            <a href="index.html">
                Continue Shopping
            </a>

        `;

        checkoutForm.style.display = "none";

        calculateTotal();

        return;
    }


    checkoutForm.style.display = "block";


    // DISPLAY PRODUCTS

    cart.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        const price =
            item.price * 1500;


        const subtotal =
            price * item.quantity;


        itemElement.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.title}"
            >

            <div class="checkout-item-info">

                <div class="checkout-item-title">
                    ${item.title}
                </div>

                <div class="checkout-item-quantity">
                    Quantity: ${item.quantity}
                </div>

            </div>

            <strong>
                ₦${subtotal.toLocaleString()}
            </strong>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    calculateTotal();

    updateCartCount();

}


// =========================
// CALCULATE TOTAL
// =========================

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


    checkoutSubtotal.textContent =
        `₦${total.toLocaleString()}`;


    checkoutTotal.textContent =
        `₦${total.toLocaleString()}`;


    return total;

}


// =========================
// CART COUNT
// =========================

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


// =========================
// GENERATE TRANSACTION REF
// =========================

function generateTransactionReference() {

    return (
        "TECHIES-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}


function createOrderItems() {

    return cart.map(item => {

        const price =
            item.price * 1500;

        const subtotal =
            price * item.quantity;

        return `
${item.title}
Quantity: ${item.quantity}
Price: ₦${price.toLocaleString()}
Subtotal: ₦${subtotal.toLocaleString()}
        `;

    }).join("\n--------------------\n");

}

function sendOrderEmail(
    customerName,
    customerEmail,
    customerPhone,
    transactionReference,
    paymentStatus,
    total
) {

    const orderItems =
        createOrderItems();


    const templateParams = {

        customer_name:
            customerName,

        customer_email:
            customerEmail,

        customer_phone:
            customerPhone,

        transaction_ref:
            transactionReference,

        payment_status:
            paymentStatus,

        order_items:
            orderItems,

        total_amount:
            `₦${total.toLocaleString()}`

    };


    return emailjs.send(

        "service_kziou52",

        "template_244wrnk",

        templateParams

    );

}


// =========================
// FLUTTERWAVE PAYMENT
// =========================

function makePayment(
    customerName,
    customerEmail,
    customerPhone
) {

    const total =
        calculateTotal();


    if (total <= 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const transactionReference =
        generateTransactionReference();


    FlutterwaveCheckout({

        // YOUR FLUTTERWAVE TEST PUBLIC KEY
        public_key:
            "FLWPUBK_TEST-e8b067decf7baea9ddd74e2af5a0aa56-X",


        // UNIQUE TRANSACTION REFERENCE
        tx_ref:
            transactionReference,


        // TOTAL AMOUNT
        amount:
            total,


        // NIGERIAN NAIRA
        currency:
            "NGN",


        // PAYMENT METHODS
        payment_options:
            "card, banktransfer, ussd",


        // CUSTOMER INFORMATION
        customer: {

            email:
                customerEmail,

            phone_number:
                customerPhone,

            name:
                customerName

        },


        // STORE INFORMATION
        customizations: {

            title:
                "Vexa Store",

            description:
                "Payment for products",

        },


        // PAYMENT CALLBACK
    callback:
    async function (payment) {

        console.log(
            "Flutterwave response:",
            payment
        );


        if (
            payment.status !==
            "successful"
        ) {

            alert(
                "Payment was not successful."
            );

            return;
        }


        // SEND ORDER EMAIL

        try {

            await sendOrderEmail(

                customerName,

                customerEmail,

                customerPhone,

                payment.tx_ref ||
                    transactionReference,

                payment.status,

                total

            );


            console.log(
                "Order email sent successfully."
            );


        } catch (error) {

            console.error(
                "EmailJS error:",
                error
            );


            alert(
                "Payment succeeded, but the order email could not be sent."
            );

            return;

        }


        // SAVE PAYMENT INFORMATION

        localStorage.setItem(

            "lastPayment",

            JSON.stringify({

                payment:
                    payment,

                customer: {

                    name:
                        customerName,

                    email:
                        customerEmail,

                    phone:
                        customerPhone

                },

                total:
                    total

            })

        );


        // CLEAR CART

        localStorage.removeItem(
            "cart"
        );


        alert(
            "Payment successful! Your order has been received."
        );


        // RETURN TO PRODUCTS

        window.location.href =
            "index.html";

    },

        // WHEN PAYMENT WINDOW CLOSES
        onclose:
            function (incomplete) {

                if (incomplete === true) {

                    console.log(
                        "Payment was cancelled."
                    );

                }

            }

    });

}


// =========================
// CHECKOUT FORM
// =========================

checkoutForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        const fullname =
            document
                .getElementById("fullname")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        if (
            !fullname ||
            !email ||
            !phone
        ) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        makePayment(
            fullname,
            email,
            phone
        );

    }
);


// =========================
// INITIALIZE
// =========================

displayCheckoutItems();