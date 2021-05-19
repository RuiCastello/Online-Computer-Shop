import { IProduto } from './interfaces';



//
// Lista que serve de simulação de base de dados para produtos que se encontrem no stock da loja, e seleção de categorias onde esses produtos se possam incluir
//

export class StockProdutos {

    
    static categoriaProduto = { 
        0: 'Motherboards',
        1: 'CPUs',
        2: 'GPUs',
        3: 'Portáteis',
        4: 'Impressoras',  
        5: 'Tinteiros',  
        6: 'Acessórios',  
        7: 'Caixas',
        8: 'Software',
        9: 'Jogos'
      }

      
    static listaProdutos: IProduto[] = [
  
        {preco: 489, id: 1, nome: 'AMD Ryzen 3900X', descricao: '12 Cores - 24-Thread - 3.8/4.6GHz - 105W TDP', categoria: 1, stock: 300, promo: false, promoDesconto: 15, imagem: '1.jpg'},
        {preco: 377, id: 2, nome: 'AMD Ryzen 3800X', descricao: '8 Cores - 16-Thread - 3.9/4.5GHz - 105W TDP', categoria: 1, stock: 10, promo: true, promoDesconto: 15, imagem: '2.jpg'},
        {preco: 331, id: 3, nome: 'AMD Ryzen 3700X', descricao: '8 Cores - 16-Thread - 3.6/4.4GHz - 65W TDP', categoria: 1, stock: 50, promo: false, promoDesconto: 15, imagem: '3.jpg'},
        {preco: 223, id: 4, nome: 'AMD Ryzen 3600X', descricao: '6 Cores - 12-Thread - 3.8/4.4GHz - 95W TDP', categoria: 1, stock: 800, promo: true, promoDesconto: 15, imagem: '4.jpg'},
        
        { preco: 945, 
          id: 5, 
          nome: 'Asus ROG Strix GeForce RTX 2080 SUPER Gaming 8GB OC White', 
          descricao: 'A NVIDIA® GeForce® RTX 2080 SUPER™ está equipada com a premiada arquitetura NVIDIA Turing™ e tem um GPU super rápido com mais núcleos e clocks mais rápidos para libertar a sua produtividade criativa e domínio nos jogos. É hora de se equipar e obter super poderes.', 
          categoria: 2, stock: 125, promo: true, promoDesconto: 25, imagem: '5.jpg'},
      
        { preco: 469, 
          id: 6, 
          nome: 'Gigabyte Radeon RX 5700 XT Gaming 8GB OC', 
          descricao: 'Grandes experiências de jogos são criadas ao quebrar as regras. A RDNA totalmente nova é alimentada pela Radeon RX 5700 Series para oferecer um desempenho excepcional e jogos de alta fidelidade. Assuma o controlo com a Radeon RX 5700 Series e usufrua de jogos poderosos e acelerados personalizados para si.', 
          categoria: 2, stock: 16, promo: false, promoDesconto: 25, imagem: '6.jpg'},







      ]
}
