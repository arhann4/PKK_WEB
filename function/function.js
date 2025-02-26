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
            if (targetId === '#') return; // Skip jika href hanya "#"
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Buy button functionality with popup and WhatsApp integration
    const buyButtons = document.querySelectorAll('.buy-btn');
    const quantityInput = document.getElementById('quantity');
    const totalSpan = document.getElementById('total');
    const basePrice = 3500; // Harga dasar per porsi
    const stockRef = firebase.database().ref('stock/dadarGulung');
    const stockInfo = document.querySelector('.stock-info');
    
    // Fungsi untuk update total hanya jika elemen ada
    function updateTotal() {
        if (quantityInput && totalSpan) {
            const qty = parseInt(quantityInput.value);
            const price = 3500;
            const total = qty * price;
            totalSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }

    // Pastikan element stock-info ada sebelum diupdate
    if (stockInfo) {
        // Hanya membaca nilai stok dari database
        stockRef.on('value', (snapshot) => {
            const currentStock = snapshot.val();
            maxStock = currentStock;
            stockInfo.textContent = `Stok tersisa: ${currentStock}`;
            if (quantityInput) {
                quantityInput.max = currentStock;
                quantityInput.value = Math.min(parseInt(quantityInput.value), currentStock);
            }
            updateTotal();
        });
    }

    let maxStock = 20;
    
    // Tombol plus minus
    const plusBtn = document.querySelector('.plus');
    const minusBtn = document.querySelector('.minus');
    const orderBtn = document.querySelector('.order-button');

    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function() {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty < maxStock) {
                quantityInput.value = currentQty + 1;
                updateTotal();
            } else {
                alert('Maaf, stok tidak mencukupi!');
            }
        });
    }

    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
                updateTotal();
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            let currentQty = parseInt(this.value);
            if (currentQty > maxStock) {
                alert('Maaf, stok tidak mencukupi!');
                this.value = maxStock;
            } else if (currentQty < 1 || isNaN(currentQty)) {
                this.value = 1;
            }
            updateTotal();
        });
    }

    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            
            stockRef.once('value').then((snapshot) => {
                const currentStock = snapshot.val();
                
                if (quantity > currentStock) {
                    alert('Maaf, stok tidak mencukupi!');
                    return;
                }

                const orderData = {
                    name: "Customer",
                    menu: "Dadar Gulung",
                    status: false,
                    pengambilan: "Dine In",
                    notes: quantity,
                    timestamp: Date.now()
                };

                // Simpan pesanan dan update stok secara bersamaan
                const updates = {};
                updates['/todos/' + firebase.database().ref().push().key] = orderData;
                updates['/stock/dadarGulung'] = currentStock - quantity;

                return firebase.database().ref().update(updates)
                    .then(() => {
                        alert('Pesanan berhasil!');
                        window.location.href = '../view/view.html';
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan: ' + error.message);
                    });
            });
        });
    }

    // Initial total update hanya jika elemen ada
    if (quantityInput && totalSpan) {
        updateTotal();
    }

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuName = "Dadar Gulung";
            const quantity = document.getElementById('quantity').value;
            const totalHarga = basePrice * quantity;
            
            const popup = document.createElement('div');
            popup.className = 'order-popup';
            
            // Tambahkan style untuk input porsi
            const style = document.createElement('style');
            style.textContent = `
                .form-group input[type="number"] {
                    width: 100%;
                    padding: 12px;
                    font-size: 16px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-top: 5px;
                }
                .form-group input[type="number"]:focus {
                    outline: none;
                    border-color: #3498db;
                }
                /* Menghilangkan tombol spinner di Chrome, Safari, Edge, Opera */
                .form-group input[type="number"]::-webkit-outer-spin-button,
                .form-group input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                /* Menghilangkan tombol spinner di Firefox */
                .form-group input[type="number"] {
                    -moz-appearance: textfield;
                }
            `;
            document.head.appendChild(style);

            popup.innerHTML = `
                <div class="popup-content">
                    <h3>Detail Pesanan</h3>
                    <form id="orderForm">
                        <div class="form-group">
                            <label for="todoName">Nama Pembeli:</label>
                            <input type="text" id="todoName" placeholder="Masukkan Nama dan Kelas" required>
                        </div>
                           <div class="form-group">
                            <label for="todoOpsi">Metode Pengambilan:</label>
                            <select id="todoOpsi" required>
                                <option value="">Pilih Metode Pengambilan</option>
                                <option value="Stand 14">Ambil di Stand 14</option>
                                <option value="Diantar">Antar ke Kelas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="todoMenu">Menu:</label>
                            <input type="text" id="todoMenu" value="${menuName}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="todoTotal">Total Harga:</label>
                            <input type="text" id="todoTotal" value="Rp ${totalHarga.toLocaleString('id-ID')}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="todoNotes">Jumlah Porsi:</label>
                            <input type="text" id="todoNotes" value="${quantity}" readonly>
                        </div>
                        <div class="popup-buttons">
                            <button type="submit" class="confirm-btn">Konfirmasi</button>
                            <button type="button" class="cancel-btn">Batal</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(popup);

            // Handle form submission
            const orderForm = document.getElementById('orderForm');
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const quantity = parseInt(document.getElementById('todoNotes').value);
                const orderData = {
                    name: document.getElementById('todoName').value,
                    menu: document.getElementById('todoMenu').value,
                    status: false,
                    pengambilan: document.getElementById('todoOpsi').value,
                    notes: quantity,
                    timestamp: Date.now()
                };

                // Cek stok sekali lagi sebelum submit
                if (quantity > maxStock) {
                    alert('Maaf, stok tidak mencukupi!');
                    return;
                }

                const ordersRef = firebase.database().ref('todos');
                ordersRef.push(orderData)
                    .then(() => {
                        // Update stok setelah pesanan berhasil
                        updateStock(quantity);
                        
                        // Hapus popup form
                        popup.remove();
                        
                        // Buat popup sukses
                        const successPopup = document.createElement('div');
                        successPopup.className = 'success-popup';
                        successPopup.innerHTML = `
                            <div class="success-icon"></div>
                            <h3>Pesanan Berhasil!</h3>
                            <p>Pesanan Anda telah berhasil dikirim</p>
                        `;
                        document.body.appendChild(successPopup);

                        // Buat pesan WhatsApp
                        const waMessage = `Halo, saya ${orderData.name} ingin memesan:\n
- Menu: ${orderData.menu}\n
- Jumlah: ${orderData.notes} porsi\n
- Pengambilan: ${orderData.pengambilan}`;
                        
                        const waURL = `https://wa.me/6281522775937?text=${encodeURIComponent(waMessage)}`;

                        // Hapus popup sukses dan redirect ke WhatsApp setelah 2 detik
                        setTimeout(() => {
                            successPopup.remove();
                            window.open(waURL, '_blank');
                        }, 2000);
                    })
                    .catch((error) => {
                        alert('Terjadi kesalahan: ' + error.message);
                    });
            });

            // Handle cancel button
            const cancelBtn = popup.querySelector('.cancel-btn');
            cancelBtn.addEventListener('click', function() {
                popup.remove();
            });
        });
    });

    // Scroll to menu button
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

    // Scroll to menu link
    const scrollToMenu = document.getElementById('scrollToMenu');
    if (scrollToMenu) {
        scrollToMenu.addEventListener('click', function(e) {
            e.preventDefault();
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Scroll to top
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Tambahkan style untuk popup sukses yang lebih profesional
    const style = document.createElement('style');
    style.textContent = `
        .success-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 30px 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            animation: slideInDown 0.5s ease-out, fadeOut 0.5s ease-out 1.5s;
            backdrop-filter: blur(10px);
            z-index: 1000;
        }

        .success-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 25px;
            border-radius: 50%;
            background: #4CAF50;
            position: relative;
            animation: scaleIn 0.3s ease-out 0.2s both;
        }

        .success-icon:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 4px solid white;
            animation: borderScale 0.3s ease-out 0.4s both;
        }

        .success-icon:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%) rotate(45deg);
            width: 30px;
            height: 60px;
            border-right: 8px solid white;
            border-bottom: 8px solid white;
            animation: checkmark 0.3s ease-out 0.6s both;
        }

        .success-popup h3 {
            color: #2c3e50;
            font-size: 24px;
            margin: 0 0 10px;
            animation: fadeInUp 0.3s ease-out 0.7s both;
        }

        .success-popup p {
            color: #7f8c8d;
            font-size: 16px;
            margin: 0;
            animation: fadeInUp 0.3s ease-out 0.8s both;
        }

        @keyframes slideInDown {
            from {
                transform: translate(-50%, -70%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -40%);
            }
        }

        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }

        @keyframes borderScale {
            from {
                width: 0;
                height: 0;
                opacity: 0;
            }
            to {
                width: 90px;
                height: 90px;
                opacity: 1;
            }
        }

        @keyframes checkmark {
            0% {
                width: 0;
                height: 0;
                opacity: 0;
            }
            50% {
                width: 30px;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 30px;
                height: 60px;
                opacity: 1;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Fungsi untuk mengupdate stok di Firebase
    function updateStock(quantity) {
        stockRef.transaction(currentStock => {
            return (currentStock || 20) - quantity;
        });
    }
});

// Fungsi untuk submit pesanan
function submitOrder() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const stockRef = firebase.database().ref('stock/dadarGulung');
    
    stockRef.once('value').then((snapshot) => {
        const currentStock = snapshot.val() || 20;
        
        if (quantity > currentStock) {
            alert('Maaf, stok tidak mencukupi!');
            return;
        }

        const orderData = {
            name: "Customer", // Sesuaikan dengan kebutuhan
            menu: "Dadar Gulung",
            status: false,
            pengambilan: "Dine In", // Sesuaikan dengan kebutuhan
            notes: quantity,
            timestamp: Date.now()
        };

        // Simpan pesanan
        firebase.database().ref('todos').push(orderData)
            .then(() => {
                // Update stok
                return stockRef.transaction(currentStock => {
                    return (currentStock || 20) - quantity;
                });
            })
            .then(() => {
                alert('Pesanan berhasil!');
                window.location.href = '../view/view.html';
            })
            .catch((error) => {
                alert('Terjadi kesalahan: ' + error.message);
            });
    });
}