// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page path
    const path = window.location.pathname;

    // Handle the donation form submission
    if (path === '/donate') {
        const form = document.getElementById('donationForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Collect form data
                const formData = {
                    name: document.getElementById('name').value,
                    foodItem: document.getElementById('foodItem').value,
                    quantity: document.getElementById('quantity').value,
                    location: document.getElementById('location').value,
                    description: document.getElementById('description').value
                };

                // Send the data to the server
                fetch('http://127.0.0.1:5000/api/donate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    window.location.href = '/listings';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting your donation. Please try again.');
                });
            });
        }
    }

    // Handle the listings page
    if (path === '/listings') {
        fetch('http://127.0.0.1:5000/api/listings')
            .then(response => response.json())
            .then(donations => {
                const container = document.getElementById('donations-container');
                donations.forEach(donation => {
                    const donationCard = document.createElement('div');
                    donationCard.className = 'bg-white p-6 rounded-lg shadow-md';
                    donationCard.innerHTML = `
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${donation.foodItem}</h3>
                        <p class="text-gray-600 mb-2"><span class="font-medium">Quantity:</span> ${donation.quantity}</p>
                        <p class="text-gray-600 mb-2"><span class="font-medium">Location:</span> ${donation.location}</p>
                        <p class="text-gray-600 mb-2"><span class="font-medium">Donor:</span> ${donation.name}</p>
                        <p class="text-gray-600"><span class="font-medium">Description:</span> ${donation.description}</p>
                    `;
                    container.appendChild(donationCard);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                const container = document.getElementById('donations-container');
                container.innerHTML = '<p class="text-red-500">Error loading donations. Please try again later.</p>';
            });
    }
});
