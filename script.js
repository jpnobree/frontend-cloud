const API_URL = '98.93.14.4';  // Substitua pelo IP da VM do Back End

// Carregar produtos
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    const list = document.getElementById('productList');
    list.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
      <strong>${product.name}</strong> - ${product.description} - R$ ${product.price}
      <button class="update-btn" onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price})">Editar</button>
      <button class="delete-btn" onclick="deleteProduct(${product.id})">Deletar</button>
    `;
        list.appendChild(li);
    });
}

// Consultar por ID
async function getProductById() {
    const id = document.getElementById('searchId').value;
    const response = await fetch(`${API_URL}/products/${id}`);
    const product = await response.json();
    const details = document.getElementById('productDetails');
    details.innerHTML = product ? `<p><strong>${product.name}</strong> - ${product.description} - R$ ${product.price}</p>` : '<p>Produto não encontrado.</p>';
}

// Editar produto (botão update)
async function editProduct(id, name, description, price) {
    const newName = prompt('Novo nome:', name);
    const newDescription = prompt('Nova descrição:', description);
    const newPrice = prompt('Novo preço:', price);
    if (newName && newDescription && newPrice) {
        await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, description: newDescription, price: parseFloat(newPrice) })
        });
        loadProducts();
    }
}

// Deletar produto
async function deleteProduct(id) {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    loadProducts();
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;  // Incluindo descrição
            const price = document.getElementById('price').value;
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price })
            });
            loadProducts();
            e.target.reset();
        });
    } else {
        console.warn('createForm not found in DOM');
    }

    // Carregar produtos após o DOM estar pronto
    loadProducts();
});
