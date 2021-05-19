import { Component, OnInit, Input, OnChanges, AfterContentChecked, EventEmitter, Output } from '@angular/core';
import { IProduto } from '../interfaces';
import { DataService } from '../data.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges, AfterContentChecked {

  //Recebe informação sobre o produto do elemento Pai (que gera este componente através de um ciclo com *ngFor)
  @Input() item:IProduto;
  @Input() index:number;
  listaitens:IProduto[];
  filtrar:boolean = false;
  actRoute: any;
  @Input() clickedExpand = [];
  catFiltered: boolean[] = [];
  catArray: number[];
  filteredList: IProduto[];
  itemIsAddedToWishList: boolean;
  itemIsAddedToCarrinho: boolean;
  isUserAdmin:boolean = false;
  quantidadeProdutoCarrinho: number;
  urlItem: string;

  //Envia variáveis sobre ações que foram feitas ao item a ser renderizado por este componente para o elemento pai
  @Output() ItemRemovidoEventEmitter: EventEmitter<number> = new EventEmitter(true);
  @Output() ItemRemovidoWishlistEventEmitter: EventEmitter<number> = new EventEmitter(true);

  //Quando utilizador remove ou adiciona item do carrinho e se está na página do carrinho, é necessário recalcular custo total do carrinho, aqui está o evento que despoleta esse cálculo no elemento pai qd este é o componente do Carrinho
  @Output() recalculateTotalEventEmitter: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private data: DataService, private _loginService: LoginService) { 
    this.listaitens = data.lista;
    for (let index in this.listaitens) this.clickedExpand[index] = false;
    this.catArray = data.getCatArray();
    for(let index in this.catArray) this.catFiltered[index] = false;
    this.isUserAdmin = _loginService.isUserAdmin(); 

  }


//Alguns testes com lifecycle hooks mais abaixo para efeitos de aprendizagem e resolução de problemas
  ngAfterContentChecked() {
    this.getQuantidadeProdutoCarrinho(this.item.id);
  }

  ngOnInit(): void {
    this.getQuantidadeProdutoCarrinho(this.item.id);

    //set de uma imagem padrão (default placeholder) para quando um produto é adicionado à lista e uma imagem de produto não foi fornecida
    // Caso a imagem seja local, então providência o path adequado para a renderização da imagem no dom, e caso seja um url, então renderize-se esse url como hotlink
    if (!this.item.imagem || this.item.imagem == undefined || this.item.imagem == null || this.item.imagem == "")
    { this.urlItem = "assets/images/default.png"; }
    else if (this.item.imagem.trim().indexOf("http") >= 0){
      this.urlItem = this.item.imagem;
    }
    else{
      this.urlItem = "assets/images/"+ this.item.imagem;
    }
  }

  ngOnChanges(): void {
    this.getQuantidadeProdutoCarrinho(this.item.id);
  }

  //Remoção de Produto da lista de produtos com respectivo refresh da lista de categorias activas para que reflita esta nova ação
  removeTask(id:number){
    this.data.removeFromLista(id);
    this.filterCat();
  }

  // adicionar produto à lista de favoritas fornecendo apenas o id do produto
  adicionarItemWishList(id:number){
   this.data.addProductWishlist(id); 
  }

  //verificação se o item já se encontra na lista de favoritos e emite um evento para que o componente da lista de favoritos se atualize sempre que haja uma mudança na adição/remoção de um item
  itemAddedToWishList()
  {
    this.itemIsAddedToWishList = this.data.isProductAddedToWishlist(this.item.id);
    // console.log(isAdded)
    if (!this.itemIsAddedToWishList) this.ItemRemovidoWishlistEventEmitter.emit(this.item.id);

    return this.itemIsAddedToWishList;
  }

  // Aumenta a quantidade de um produto já existente no carrinho por +1, faz um call para o componente receber a nova quantidade do produto, e emite um evento para recalcular o valor total de produtos quando se está no componente de carrinho para que se possa saber o preço a pagar sempre atualizado antes de efetuar a compra.
  adicionarItemCarrinhoMais(id:number){
    this.data.addProductCarrinhoMais(id); 
    this.getQuantidadeProdutoCarrinho(id);
    this.recalculateTotalEventEmitter.emit(true);
   }

   //subtrai um à quantidade de um produto já existente no carrinho
   //Caso isso signifique que a quantidade chegou a zero, então avisa o elemento pai do componente carrinho de que o produto já não se encontra no carrinho
  adicionarItemCarrinhoMenos(id:number){
    this.data.addProductCarrinhoMenos(id); 
    this.getQuantidadeProdutoCarrinho(id);
    if (this.quantidadeProdutoCarrinho <= 0) this.ItemRemovidoEventEmitter.emit(id);
    // console.log('quantidade produto carrinho: ' + this.quantidadeProdutoCarrinho)
    this.recalculateTotalEventEmitter.emit(true);
   }

   //Adiciona/remove produto ao carrinho com ação de toggle, ou seja, não há quantidades, é apenas unitário, ao clicar adiciona o produto, ao clicar novamente, remove a quantidade total desse mesmo produto.
  adicionarItemCarrinho(id:number){
    this.data.addProductCarrinho(id); 
    this.getQuantidadeProdutoCarrinho(id);
    if (this.quantidadeProdutoCarrinho <= 0) this.ItemRemovidoEventEmitter.emit(id);
    this.recalculateTotalEventEmitter.emit(true);
   }

   //devolve a quantidade de um determinado produto (pelo id) no carrinho
  getQuantidadeProdutoCarrinho(id:number){
    this.quantidadeProdutoCarrinho = this.data.getQuantidadeProdutoCarrinho(id); 
   }

   //devolve boolean true caso o produto a ser renderizado por este componente já esteja no carrinho
  itemAddedToCarrinho()
  {
    this.itemIsAddedToCarrinho = this.data.isProductAddedToCarrinho(this.item.id);
    // console.log(isAdded)

    return this.itemIsAddedToCarrinho;
  }

//devolve nome de uma categoria (as categorias estão definidas em cada objecto-produto numericamente, por isso tem de se fazer a tradução)
  getCategoriaProduto(cat:number){
    return this.data.getCategoriaProduto(cat);
  }


  // faz toggle da filtragem de uma determinada categoria de produtos através do id dessa categoria
  filterCat(catNumber?:number){
    
    if(catNumber >= 0) this.catFiltered[catNumber] = !this.catFiltered[catNumber];

    this.listaitens = this.data.procurarListaCat(this.catFiltered);
    if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.lista;
    //console.log(this.catFiltered);
  }


}//end class
