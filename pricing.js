// This file handles the pricing information for Kokum drinks, targeting retailers and wholesalers.

const pricingData = [
    {
        product: "Kokum Drink - 250ml",
        price: 2.50,
        wholesalePrice: 2.00,
        minOrderQuantity: 100,
        description: "Refreshing Kokum drink in a convenient 250ml bottle."
    },
    {
        product: "Kokum Drink - 500ml",
        price: 4.50,
        wholesalePrice: 4.00,
        minOrderQuantity: 50,
        description: "Larger 500ml bottle for those who want more."
    },
    {
        product: "Kokum Drink - 1L",
        price: 8.00,
        wholesalePrice: 7.50,
        minOrderQuantity: 25,
        description: "Economical 1L bottle for retailers."
    },
    {
        product: "Kokum Drink - 5L",
        price: 35.00,
        wholesalePrice: 32.00,
        minOrderQuantity: 10,
        description: "Bulk 5L option for restaurants and cafes."
    }
];

function displayPricing() {
    const pricingContainer = document.getElementById('pricing-container');
    pricingData.forEach(item => {
        const productElement = document.createElement('div');
        productElement.classList.add('pricing-item');
        productElement.innerHTML = `
            <h3>${item.product}</h3>
            <p>Retail Price: $${item.price.toFixed(2)}</p>
            <p>Wholesale Price: $${item.wholesalePrice.toFixed(2)}</p>
            <p>Minimum Order Quantity: ${item.minOrderQuantity}</p>
            <p>Description: ${item.description}</p>
        `;
        pricingContainer.appendChild(productElement);
    });
}

document.addEventListener('DOMContentLoaded', displayPricing);