function deleteItem(key, quantity) {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
        // Ambil referensi ke pesanan yang akan dihapus
        const orderRef = firebase.database().ref('todos/' + key);
        
        // Ambil data pesanan terlebih dahulu
        orderRef.once('value')
            .then((snapshot) => {
                const orderData = snapshot.val();
                const quantityToRestore = parseInt(orderData.notes);

                // Hapus pesanan
                return orderRef.remove().then(() => {
                    // Update stok (menambah kembali)
                    const stockRef = firebase.database().ref('stock/dadarGulung');
                    return stockRef.transaction(currentStock => {
                        const newStock = (currentStock || 0) + quantityToRestore;
                        console.log('Mengembalikan stok:', quantityToRestore, 'Stok baru:', newStock);
                        return newStock;
                    });
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menghapus pesanan');
            });
    }
}
