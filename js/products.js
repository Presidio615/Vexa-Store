const API_URL = "https://fakestoreapi.com/products";

let products = [];

const productsContainer =
    document.getElementById("products-container");

const categoryFilter =
    document.getElementById("category-filter");

const loading =
    document.getElementById("loading");


// GET PRODUCTS
async function getProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        loading.style.display = "none";

        displayProducts(products);

        createCategories(products);

        updateCartCount();

    } catch (error) {

        loading.textContent =
            "Unable to load products. Please try again.";

        console.error(error);

    }

}


// DISPLAY PRODUCTS
function displayProducts(productsToDisplay) {

    productsContainer.innerHTML = "";

    if (productsToDisplay.length === 0) {

        productsContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    productsToDisplay.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.title}"
                class="product-image"
            >

            <div class="product-content">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <div class="product-price">
                    ₦${(product.price * 1500).toLocaleString()}
                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})">

                    Add to Cart

                </button>

            </div>
        `;


        productsContainer.appendChild(card);

    });

}


// CREATE CATEGORIES
function createCategories(products) {

    const categories = [
        ...new Set(
            products.map(product => product.category)
        )
    ];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// FILTER PRODUCTS
categoryFilter.addEventListener(
    "change",
    function () {

        const selectedCategory = this.value;


        if (selectedCategory === "all") {

            displayProducts(products);

        } else {

            const filteredProducts =
                products.filter(
                    product =>
                        product.category === selectedCategory
                );

            displayProducts(filteredProducts);

        }

    }
);


// ADD TO CART
function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );


    if (!product) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,

            title: product.title,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert("Product added to cart!");

}


// CART COUNT
function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}


// RUN
getProducts();