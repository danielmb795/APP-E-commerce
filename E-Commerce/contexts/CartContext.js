import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho(listaAtual => {
      const itemExistente = listaAtual.find(item => item.id === produto.id);

      if (itemExistente) {
        return listaAtual.map(item => 
          item.id === produto.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Garante que salvamos a imagem e preço corretamente
      return [...listaAtual, { ...produto, quantity: 1 }];
    });
  };

  const removerDoCarrinho = (idProduto) => {
    setCarrinho(listaAtual => listaAtual.filter(item => item.id !== idProduto));
  };

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}