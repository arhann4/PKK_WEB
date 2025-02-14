document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Topping popup functionality
    const buyButton = document.querySelector('.buy-btn');
    if (buyButton) {
        buyButton.addEventListener('click', showToppingPopup);
    }

    function showToppingPopup() {
        const popup = document.createElement('div');
        popup.className = 'topping-popup';
        popup.innerHTML = `
            <div class="topping-popup-content">
                <h3>Pilihan Topping</h3>
                <div class="topping-option">
                    <label>
                        <input type="radio" name="topping" value="original" checked>
                        <span>Original</span>
                    </label>
                </div>
                <div class="topping-option">
                    <label>
                        <input type="radio" name="topping" value="cheese">
                        <span>Extra Keju (+Rp 1.000)</span>
                    </label>
                </div>
                <div class="topping-buttons">
                    <button class="confirm-btn">
                        <i class="fas fa-check"></i>
                        Konfirmasi
                    </button>
                    <button class="cancel-btn">
                        <i class="fas fa-arrow-left"></i>
                        Kembali
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);

        // Handle konfirmasi
        const confirmBtn = popup.querySelector('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const cheeseInput = popup.querySelector('input[value="cheese"]');
                const quantityElement = document.getElementById('quantity');
                const totalElement = document.getElementById('total');
                
                if (cheeseInput && quantityElement && totalElement) {
                    const cheeseSelected = cheeseInput.checked;
                    const quantity = parseInt(quantityElement.value) || 1; // Default ke 1 jika parsing gagal
                    let total = 3000; // Harga dasar
                    
                    if (cheeseSelected) {
                        total += 1000; // Tambah harga keju
                    }
                    
                    total *= quantity;
                    totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
                    document.body.removeChild(popup);
                    alert('Pesanan berhasil ditambahkan!');
                }
            });
        }

        // Handle batal
        const cancelBtn = popup.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            document.body.removeChild(popup);
        });
    }

    // Quantity controls
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const quantityInput = document.getElementById('quantity');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            if (quantityInput.value > 1) {
                quantityInput.value--;
                updateTotal();
            }
        });

        plusBtn.addEventListener('click', function() {
            quantityInput.value++;
            updateTotal();
        });

        function updateTotal() {
            const quantity = parseInt(quantityInput.value);
            const total = 3000 * quantity;
            document.getElementById('total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }
});

// Smooth scroll untuk tombol "Lihat Menu"
const scrollBtn = document.querySelector('.scroll-btn');
if (scrollBtn) {
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
            const headerOffset = 50;
            const elementPosition = menuSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}
