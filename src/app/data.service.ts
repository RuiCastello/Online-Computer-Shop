import { Injectable } from '@angular/core';
import { IProduto } from './interfaces';
import { StockProdutos } from './stock-produtos'
import { LoginService } from './login.service'
import { IProdutoCarrinho } from './interfaces';


//
// Aqui criei vários métodos para lidar com dados genéricos ou relativos a produtos, para lidar com dados de utilizadores existe outro serviço chamado Login
//


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _Listaitens:IProduto[];
  private _categoriaProduto:object;
  
  constructor(private _loginService:LoginService) { 
    //Aqui recebe-se a lista de produtos que se encontra numa class separada onde se declaram e inicializam os produtos, uma espécie de simulação de base de dados de produtos em stock pois isto foi feito antes de saber mexer com firebase
    this._Listaitens = StockProdutos.listaProdutos;

    // esta classe também tem uma lista de categorias possíveis dos produtos da loja e recebemos essa lista aqui
    this._categoriaProduto = StockProdutos.categoriaProduto;
    // console.log(this._categoriaProduto)
    
  }//end constructor
  

  //Recebe o nome da categoria de produto dado um id de categoria
  getCategoriaProduto(catId:number):string{
    if(this._categoriaProduto[catId]) return this._categoriaProduto[catId];
  }
  
  //devolve a lista de produtos através de um get pois declarei a lista como variável private
  get lista(){
    return this._Listaitens;
  }
  

  //
  // Calcula o valor total dos items no carrinho e tem em conta quaisquer descontos que tenham de ser aplicados
  //
  calculateTotal()
  {
    let proprioUtilizadorCarrinho:IProdutoCarrinho[];

    //
    // Recebe o carrinho do Utilizador
    //
    proprioUtilizadorCarrinho = this._loginService.getCarrinhoUtilizador();
    

    //
    // Compara os produtos no carrinho com os produtos da loja, e recebe o seu preço real naquele preciso momento para prevenir a compra de produtos com desconto após a promoção ter já terminado. Caso o produto seja colocado no carrinho em promoção e apenas comprado posteriormente após promoção ter acabado ou preço ter sido alterado.
    //
    let total = proprioUtilizadorCarrinho.reduce<number>( (acc, nextElement) =>{
      let esteProduto = this.getProduct(nextElement.produtoId);
      let precoImediato:number;

      if ( esteProduto && esteProduto.promo && esteProduto.promoDesconto > 0 ){
        precoImediato = esteProduto.preco * (100- esteProduto.promoDesconto) * 0.01;
      }
      else if (esteProduto) precoImediato = esteProduto.preco;
      
      if (esteProduto) acc = acc + precoImediato * nextElement.quantidade;
      return acc;
    }, 0);

    return total;
  
  }

  //
  // Devolve a lista de produtos no carrinho após validação, com o cuidado de verificar se algum produto no carrinho já não existe por algum motivo na base de dados, caso tenha sido removido ou o stock acabado por exemplo
  //
  listaCarrinho(){
    let proprioUtilizadorCarrinho:IProdutoCarrinho[];
    proprioUtilizadorCarrinho = this._loginService.getCarrinhoUtilizador();

    let listaCompletaUtilizadorCarrinho:IProduto[] = [];

    proprioUtilizadorCarrinho.forEach(element =>{
      let esteProduto = this.getProduct(element.produtoId);
      if ( esteProduto ) listaCompletaUtilizadorCarrinho.push(esteProduto);
    });

    return listaCompletaUtilizadorCarrinho;
  }
  
  //Devolve uma lista de produtos nos favoritos após validação, com o cuidado de verificar se algum produto nos favoritos já não existe na base de dados
  listaWishlist(){
    let proprioUtilizadorWishlist:IProdutoCarrinho[];
    proprioUtilizadorWishlist = this._loginService.getWishListUtilizador();

    let listaCompletaUtilizadorWishlist:IProduto[] = [];

    proprioUtilizadorWishlist.forEach(element =>{
      let esteProduto = this.getProduct(element.produtoId);
      if ( esteProduto ) listaCompletaUtilizadorWishlist.push(esteProduto);
    });

    return listaCompletaUtilizadorWishlist;
  }

  //Adiciona produto à lista da loja
  addToLista(Newitem: IProduto){
    let item = {...Newitem};
    if (item) {
      item.id = (this.getLastId() + 1);
      this._Listaitens.push(item);
      return true;
    }
    return false;
  }
  

  // remove produto da lista da loja
  removeFromLista(id: number){
    
    let result:boolean = this._Listaitens.some( (element, index) =>{
      if(element.id == id) {
        this._Listaitens.splice(index, 1);
        index--;
        return true;
      }   
    })//end some
    
    return result;
  }


  //Remove produto através de um id de produto de uma lista arbitrária passada por parâmetro
  removeFromNovaLista(id: number, novaLista ){
    
    let result:boolean = novaLista.some( (element, index) =>{
      if(element.id == id) {
        novaLista.splice(index, 1);
        return true;
      }   
    })//end some
    
    return result;
  }
  
  // Adiciona ou remove um produto da lista de favoritos (comportamento de toggle)
  addProductWishlist(id: number){
    
    let result = this.updateUtilizadorWishList('toggleAddRemove', id);
    return result;
  }
  
  //Verifica se o produto já se encontra na lista de favoritos
  isProductAddedToWishlist(id: number){
    
    let result = this.updateUtilizadorWishList('check', id);
    return result;
  }
  
  // Adiciona ou remove produto do carrinho (comportamente toggle)
  addProductCarrinho(id: number){
    
    let result = this.updateUtilizadorCarrinho('toggleAddRemove', id);
    return result;
  }

  // Aumenta a quantidade de um produto já existente no carrinho
  addProductCarrinhoMais(id: number){
    
    let result = this.updateUtilizadorCarrinho('adicionar', id);
    return result;
  }

  // diminui a quantidade de um produto já existente no carrinho
  addProductCarrinhoMenos(id: number){
    
    let result = this.updateUtilizadorCarrinho('remover', id);
    return result;
  }
  

  // Devolve a quantidade de um produto no carrinho
  getQuantidadeProdutoCarrinho(id: number):number{
    let proprioUtilizadorCarrinho:IProdutoCarrinho[];
    proprioUtilizadorCarrinho = this._loginService.getCarrinhoUtilizador();
    let result = this.quantidadeProdutoCarrinho(proprioUtilizadorCarrinho, id);
    if (result && result >= 1) return result;
    else return 0;
  }

  // O produto já existe no carrinho?
  isProductAddedToCarrinho(id: number){
    
    let result = this.updateUtilizadorCarrinho('check', id);
    return result;
  }
  
  // Procura produtos na lista que tenham match de alguma propriedade com qualquer uma das possiveis múltiplas palavras de uma string 
  procurarLista(input:string | number):IProduto[] {
    
    let result:IProduto[] = this._Listaitens.filter( (element, index) =>{
      
      input = String(input);
      let inputArray = input.split(' ');
      
      for (let property in element){

        let conteudo:string = element[property] as string;
        conteudo = conteudo.toString();
        // console.log(conteudo)
        
        let index = 0;
        let index2 = 0;
        
        for ( let entry of inputArray ){
          if(conteudo.toLowerCase().includes((String(entry).toLowerCase())) ) {
            // console.log(element[property])
            index2++;
            //console.log(conteudo + "- entry -" + entry)
          }   
          index++;
        }
        if (index == index2) return element;
        
      }
      
    })//end forEach
    
    return result;
  }//end procurarLista
  

  // devolve uma lista de produtos filtrada pela(s) categoria(s) selecionada(s) pelo utilizador, recebendo um parametro de array de filtros de categorias (que é um array de booleans, onde cada índice corresponde a uma categoria específica)
  procurarListaCat(catFiltered:boolean[], lista?:IProduto[]):IProduto[] {
    let searchCatString:string;
    let result:IProduto[];
    if(lista){
      result = lista.filter( (element, index) =>{
      
        if (catFiltered.some( (element2, index) => {
          if (element2){
            if(element.categoria == index ) {
               return true; 
              }   
          }
        })
        ){
          return true;
        }
        
      })//end filter
    }
    else{
      result = this._Listaitens.filter( (element, index) =>{
        
        if (catFiltered.some( (element2, index) => {
          if (element2){
            if(element.categoria == index ) {
              return true; 
              }   
          }
        })
        ){
          return true;
        }
        
      })//end filter
  }
    return result;
  }//end procurarListaCat
  

  // filtra uma lista de produtos por uma única categoria recebendo um parametro de id de categoria
  procurarListaCatSingle(categoria:number | string):IProduto[] {
    
    let result:IProduto[] = this._Listaitens.filter( (element, index) =>{
      
      if(element.categoria == <number>categoria ) {   
        return true;
      }
      
    })//end filter
    
    return result;
  }//end procurarListaCat
  
 
  //devolve o Id do último produto adicionado à lista da loja
  getLastId()
  {
    let elementoIdMaior:number = -999;
    
    this._Listaitens.forEach( (element) => {
      if (elementoIdMaior < element.id) elementoIdMaior = element.id; 
    });
    //  console.log(elementoIdMaior)
    return elementoIdMaior;
  }
  
  
  //devolve um array de categorias de produto
  getCatArray(){
    let catArray:number[] = [];
    for (let i = 0; this.getCategoriaProduto(i) && this.getCategoriaProduto(i) != ""; i++ ) {
      catArray[i] = i;
    }
    return catArray;
  }
  






  // Verifica se um produto já foi adicionado à lista de favoritos e tem como parametro opcional, remover esse produto caso ele seja encontrado.
  isProductAlreadyAddedToWishList(wishList:IProdutoCarrinho[], productId:number, removeProduct?:boolean)
  {
    let result:boolean = wishList.some( (element, index) => {
      // console.log('wishlist: ' + JSON.stringify(wishList) + ' --- productId: ' + productId);
      if(element.produtoId == productId){
        if(removeProduct) wishList.splice(index, 1);
        return true;
      }
    })

    return result;
  }

  
  // faz update à lista de favoritos de um utilizador e tem um parametro importante que define várias funcionalidades dentro deste método.
  // funcionalidade de toggle, ou seja, adiciona se o item não existir, ou remove se o item existir.
  // funcionalidade de verificação, apenas verifica se o item já se encontra na lista de favoritos
  updateUtilizadorWishList(addRemoveCheck:string, productId:number){
    let result:boolean = false;
    let proprioUtilizadorWishList:IProdutoCarrinho[];
    proprioUtilizadorWishList = this._loginService.getWishListUtilizador();

    if(addRemoveCheck == 'toggleAddRemove')
    {
      
      if(proprioUtilizadorWishList && this.isProductAlreadyAddedToWishList(proprioUtilizadorWishList, productId, true))
      {
        // Se produto já se encontra na wishlist, então remove com toggle flag "true".

        //update DB
        this._loginService.UpdateDBWithUser();

        result =  true;
      }
      else if (proprioUtilizadorWishList) {
        
        // Senão, então adiciona o produto à wishlist:
        let oldLength:number;
        oldLength = proprioUtilizadorWishList.length;
        let newLength = proprioUtilizadorWishList.push({produtoId: productId});
        
        //update DB
        this._loginService.UpdateDBWithUser();

        // console.log('wishlist pós push: ' + JSON.stringify(element.wishList) + ' --- productId: ' + productId);
        if (newLength > oldLength) result =  true;
        else result =  false;
      }
      else return false;
    }   
    else if (addRemoveCheck == 'check'){
      if(proprioUtilizadorWishList && this.isProductAlreadyAddedToWishList(proprioUtilizadorWishList, productId))
      {
        // Se produto já se encontra na wishlist, então responde com true.
        result = true;
      }
      else result = false; // Se o produto não está na wishlist, responde false
    }

  
    return result;
  }
  

  // Verifica se um produto já foi adicionado ao carrinho e tem como parametro opcional, remover esse produto caso ele seja encontrado.
  isProductAlreadyAddedToCarrinho(carrinhoList:IProdutoCarrinho[], productId:number, removeProduct?:boolean)
  {
    let result:boolean = carrinhoList.some( (element, index) => {
      // console.log('carrinho: ' + JSON.stringify(carrinhoList) + ' --- productId: ' + productId);
      if(element.produtoId == productId){
        if(removeProduct) carrinhoList.splice(index, 1);
        return true;
      }
    })

    return result;
  }

  // devolve a quantidade de um determinado produto no carrinho do utilizador
  quantidadeProdutoCarrinho(carrinhoList:IProdutoCarrinho[], productId:number):number{
    let result:number;
    if (carrinhoList){
      result = carrinhoList.filter( (element) => {
        if(element.produtoId == productId){
          // console.log(element);
          return true;
        }
      })[0]?.quantidade;
   }
    else result = 0;

    return result;
  }
  
  //retira uma unidade de um determinado produto ao carrinho e se a quantidade desse produto chegar a zero após remoção, então remove o próprio produto
  removeFromCarrinho(carrinhoList:IProdutoCarrinho[], productId:number):number{
    
    let quantidade:number = this.quantidadeProdutoCarrinho(carrinhoList,productId);
    let result:number = 0; 
    // console.log(carrinhoList);
    // console.log('quantidade' + quantidade)
    if (quantidade >1)
    {
      carrinhoList.some( (element, index) =>{
        if(element.produtoId == productId) {
          element.quantidade = element.quantidade -1;
          return true;
        }   
      })//end some
    }
    else{
      carrinhoList.some( (element, index) =>{
        if(element.produtoId == productId) {
          carrinhoList.splice(index, 1);
          return true;
        }   
      })//end some
    }
    
    return this.quantidadeProdutoCarrinho(carrinhoList,productId); // devolverá quantidade do item restante após remoção de uma unidade
  }

  // faz update ao carrinho de um utilizador e tem um parametro importante que define várias funcionalidades dentro deste método.
  // funcionalidade de toggle, ou seja, adiciona se o item não existir, ou remove se o item existir, independentemente da quantidade.
  // funcionalidade de verificação, apenas verifica se o item já se encontra no carrinho
  // funcionalidade de adição, apenas aumenta a quantidade de um produto já existente no carrinho por uma unidade
  // funcionalidade de remoção, diminui a quantidade de um produto no carrinho e remove-o se chegar a zero
  updateUtilizadorCarrinho(addRemoveCheck:string, productId:number){
    let result:boolean = false;
    let proprioUtilizadorCarrinho:IProdutoCarrinho[];
    proprioUtilizadorCarrinho = this._loginService.getCarrinhoUtilizador();

    if(addRemoveCheck == 'toggleAddRemove')
    {
      
      if(proprioUtilizadorCarrinho && this.isProductAlreadyAddedToCarrinho(proprioUtilizadorCarrinho, productId, true))
      {
        // Se produto já se encontra no carrinho, então remove com toggle flag "true".

        //update DB
        this._loginService.UpdateDBWithUser();

        result =  true;
      }
      else if (proprioUtilizadorCarrinho) {

        let produtoEscolhido: IProduto = this.getProduct(productId);
        let preco: number = produtoEscolhido.preco;
        let quantidade: number = 0;
        if (this.isProductAlreadyAddedToCarrinho(proprioUtilizadorCarrinho, productId)){
          quantidade = this.quantidadeProdutoCarrinho(proprioUtilizadorCarrinho, productId);
        }

        // Senão, então adiciona o produto ao carrinho:
        let oldLength:number;
        oldLength = proprioUtilizadorCarrinho.length;
        let newLength = proprioUtilizadorCarrinho.push({produtoId: productId, preco: preco, quantidade: quantidade+1});

        //update DB
        this._loginService.UpdateDBWithUser();

        if (newLength > oldLength) result = true;
        else result =  false;
      }
      else return false;
    }   
    else if (addRemoveCheck == 'check'){
      if(proprioUtilizadorCarrinho && this.isProductAlreadyAddedToCarrinho(proprioUtilizadorCarrinho, productId))
      {
        // Se produto já se encontra no carrinho, então responde com true.
        result = true;
      }
      else result = false; // Se o produto não está no carrinho, responde false
    }
    else if(addRemoveCheck == 'adicionar')
    {
      
     if (proprioUtilizadorCarrinho) {
        
        let produtoEscolhido: IProduto = this.getProduct(productId);
        let preco: number = produtoEscolhido.preco;
        let quantidade: number;
      
        proprioUtilizadorCarrinho.some(element =>{
          if (element.produtoId == productId) {
            element.preco = preco;
            quantidade = element.quantidade;
            element.quantidade = ++element.quantidade;
          }
        });

        if (this.quantidadeProdutoCarrinho(proprioUtilizadorCarrinho, productId) > quantidade){ 
          //update DB
          this._loginService.UpdateDBWithUser();
          result = true;
        }
        else result = false;
      }
      else return false;
    }   
    else if(addRemoveCheck == 'remover')
    {
      
     if (proprioUtilizadorCarrinho) {
        let quantidade:number = this.quantidadeProdutoCarrinho(proprioUtilizadorCarrinho, productId);
        let result2:number = this.removeFromCarrinho(proprioUtilizadorCarrinho, productId);

        //update DB
        this._loginService.UpdateDBWithUser();

        if (!result2 || (result2 < quantidade)) result = true; 
        else result = false;
      }
      else result = false;
    }
    else result = false;

    return result;
  }

  // devolve um objecto Produto com todas as suas propriedades a partir da lista de produtos da loja (fonte da verdade)
  getProduct(productId:number):IProduto{
    
    let result:IProduto = null;
    
    result = this._Listaitens.filter(element =>{
      if (element.id == productId) return true;
    })[0];

    return result;
  }


}//end class
