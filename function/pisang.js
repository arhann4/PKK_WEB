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

    // Buy button functionality with popup and WhatsApp integration
    const buyButton = document.querySelector('.buy-btn');
    if (buyButton) {
        buyButton.addEventListener('click', function() {
            // Buat elemen popup
            const popup = document.createElement('div');
            popup.className = 'order-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3>Detail Pesanan</h3>
                    <form id="orderForm">
                        <div class="form-group">
                            <label for="nama">Nama:</label>
                            <input type="text" id="nama" required>
                        </div>
                        <div class="form-group">
                            <label for="kelas">Kelas:</label>
                            <input type="text" id="kelas" required>
                        </div>
                        <div class="form-group">
                            <label for="pengambilan">Metode Pengambilan:</label>
                            <select id="pengambilan" required>
                                <option value="">Pilih metode pengambilan</option>
                                <option value="Ambil di Stand">Ambil di Stand 14</option>
                                <option value="Antar ke Kelas">Antar ke Kelas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pembayaran">Metode Pembayaran:</label>
                            <select id="pembayaran" required>
                                <option value="">Pilih metode pembayaran</option>
                                <option value="Cash">Cash</option>
                                <option value="QRIS">QRIS</option>
                            </select>
                        </div>
                        <div class="popup-buttons">
                            <button type="submit" class="confirm-btn">Konfirmasi</button>
                            <button type="button" class="cancel-btn">Batal</button>
                        </div>
                    </form>
                </div>
            `;

            // Tambahkan style untuk popup
            const style = document.createElement('style');
            style.textContent = `
                .order-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .popup-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 400px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .popup-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                .confirm-btn, .cancel-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .confirm-btn {
                    background: #4CAF50;
                    color: white;
                }
                .cancel-btn {
                    background: #f44336;
                    color: white;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(popup);

            // Handle form submission with WhatsApp
            const orderForm = document.getElementById('orderForm');
            if (orderForm) {
                orderForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const nama = document.getElementById('nama').value;
                    const kelas = document.getElementById('kelas').value;
                    const quantity = document.getElementById('quantity').value || 1;
                    const pengambilan = document.getElementById('pengambilan').value;
                    const pembayaran = document.getElementById('pembayaran').value;
                    const total = 3000 * quantity;
                    
                    // Periksa semua field terisi
                    if (nama && kelas && pengambilan && pembayaran) {
                        // Format pesan WhatsApp
                        const message = `Halo, saya ingin memesan: Pisang Palm Crunchy %0A%0A` +
                            `Nama: ${nama}%0A` +
                            `Kelas: ${kelas}%0A` +
                            `Jumlah: ${quantity}%0A` +
                            `Pengambilan: ${pengambilan}%0A` +
                            `Pembayaran: ${pembayaran}%0A` +
                            `Total: Rp ${total.toLocaleString('id-ID')}`;

                        // Nomor WhatsApp tujuan
                        const phoneNumber = '6285792178429';

                        // Buat URL WhatsApp
                        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

                        // Buka WhatsApp di tab baru
                        window.open(whatsappURL, '_blank');

                        // Tutup popup
                        document.body.removeChild(popup);
                    }
                });
            }

            // Handle cancel button
            const cancelBtn = popup.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    document.body.removeChild(popup);
                });
            }
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
            const total = 3000 * quantity; // Harga dasar
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
