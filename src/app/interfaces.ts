
export interface IMorada{
    rua: string, 
    codigoPostal: string, 
    cidade: string, 
    pais: string
}


export interface IProdutoCarrinho {
    produtoId: number,
    quantidade?: number,
    preco?: number
}

export interface IProduto {
    id: number,
    preco: number,
    nome: string,
    descricao: string,
    categoria: number,
    stock: number,
    promo: boolean,
    promoDesconto: number,
    imagem: string
}

