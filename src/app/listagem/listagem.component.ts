import { Component, OnInit } from '@angular/core';
import { IProduto } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})

export class ListagemComponent implements OnInit {
  listaitens:IProduto[];
  filtrar:boolean = false;
  actRoute: any;
  clickedExpand = [];
  catFiltered: boolean[] = [];
  catArray: number[];
  filteredList: IProduto[];
  userSelfId: number;
  userLoggedIn: boolean = false;
  myToken: string | false = false;
  myName: string | false = false;
  categoria: string | number;
  categoriaControl = new FormControl();
  ordenarControl = new FormControl();


  // Aqui faz-se uso dos diferentes serviços injectable, e inicializa-se algumas variáveis com a lista de produtos, as categorias dos produtos e um array com as categorias filtradas.
  constructor(private data: DataService, actRoute: ActivatedRoute, private _login:LoginService) {

    this.listaitens = data.lista;
    this.actRoute = actRoute;

    for (let index in this.listaitens) this.clickedExpand[index] = false;
    this.catArray = data.getCatArray();

    // console.log(this.catArray);
    for(let index in this.catArray) this.catFiltered[index] = false;

  }


  //Caso o URL faça match da palavra "filtrar" no seu endereço, então usar o componente de filtro, para que o utilizador possa fazer uma pesquisa textual sobre todos os produtos da loja (percorrendo as suas várias propriedades, incluindo o nome e descrição)
  //Caso o utilizador tenha acabado de fazer login, detecta isso também pelo url pois o login faz redirect no routing, e apresenta mensagem de boas-vindas.
  ngOnInit(): void {
    if (this.actRoute.snapshot.params.filtrar == 'filtrar'){
      this.filtrar = true;
    }
    else if (this.actRoute.snapshot.params.filtrar == 'bemvindo'){
      this.userLoggedIn = true;
      this.userSelfId = this.actRoute.snapshot.params.filtroInput.toString();
      console.log(this.userSelfId);
    }

    //Verifica se o utilizador está autenticado e caso esteja, então vai buscar o primeiro nome dele para usar em mensagens de interação com o utilizador no template (por exemplo, de boas-vindas)
    //Autenticação
    this.myToken = this._login.utilizadorEstaAutenticado();
    // console.log(this.myToken)
    if (this.myToken){
      this.myName = this._login.nomeUtilizador(this.myToken);
      let meuPrimeiroNome = this.myName.toString().trim().split(' ')[0];
      this.myName = meuPrimeiroNome;
    }
    //end Autenticação

  }


// Clicar no título deste componente quando se está a ver a página despoleta uma ação de abertura dos detalhes de todos os produtos. É uma forma fácil e rápida de ler tudo sobre os produtos, um "shortcut" para poupar tempo para que o utilizador não tenha de clicar item a item quando quer comparar detalhes.
  expandAll(){
    let letsExpand:boolean;
    if (this.clickedExpand[0] == false) {letsExpand = true;}
    else {letsExpand = false;}

    for (let index in this.clickedExpand){
      this.clickedExpand[index] = letsExpand;
    }
  }


  //Faz toggle (boolean) de cada categoria num array que representa todas as categorias que devem ser filtradas, desta forma podemos apresentar uma procura de múltiplas categorias ao mesmo tempo ao passar este array para funções que filtrem listas de produtos.
  filterCat(catNumber?:number){

    if(catNumber >= 0) this.catFiltered[catNumber] = !this.catFiltered[catNumber];

    this.listaitens = this.data.procurarListaCat(this.catFiltered);
    if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.lista;
    //console.log(this.catFiltered);

  }

//Método que filtra apenas uma categoria ao invés de múltiplas, tornou-se redundante e já não deverá estar a ser usado, mas deixei-o aqui por uma questão de documentação.
  filterCatSingle(categoria:number | string){

    // console.log(categoria);

    this.listaitens = this.data.procurarListaCatSingle(categoria as number);


    // if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.lista;
    //console.log(this.catFiltered);

  }

  //Devolve nome de uma categoria recebendo apenas o código/id dela.
  getCategoriaProduto(cat:number){
    return this.data.getCategoriaProduto(cat);
  }


  //Método que filtra e devolve uma lista de produtos que respeite os filtros ativados pelo utilizador
  filtrarMultiplasCat(event) {

    let result:[];


    if(event) {
      for(let index in this.catArray) this.catFiltered[index] = false;

      result = this.categoriaControl.value;

      if (result.length > 0){
          result.forEach( (element) => {
            if(element >= 0) this.catFiltered[element] = true;
          });

          this.listaitens = this.data.procurarListaCat(this.catFiltered);
          if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.lista;
        }
        else{
          this.listaitens = this.data.lista;
        }

    }

    // console.log(result)
  }

  //O item está na lista de favoritos?
  itemAddedToWishList(productId:number)
  {
    let itemIsAddedtoWishList = this.data.isProductAddedToWishlist(productId);
    // console.log(isAdded)

    return itemIsAddedtoWishList;
  }

  //O item está no carrinho?
  itemAddedToCarrinho(productId:number)
  {
    let itemIsAddedtoCarrinho = this.data.isProductAddedToCarrinho(productId);
    // console.log(isAdded)

    return itemIsAddedtoCarrinho;
  }


  //Método de ordenação da lista de produtos pelas mais diversas categorias, incluindo, preço, nome, categoria, prioridade aos favoritos, prioridade aos do carrinho, e prioridade aos produtos com promoção
  //Na maioria destes tipos de ordenação, criei uma ordenação secundária para que os items fiquem ordenados alfabeticamente dentro dos seus próprios macro-grupos, ou seja, se for ordenado por prioridade aos favoritos, ele coloca todos os elementos nos favoritos em primeiro mas também os sub-ordena por nome dentro de cada grupo

  ordenar(event) {
    let result:string;

    if(!event) {
      console.log('dropdown closed');
      result = this.ordenarControl.value;

      if (result){
          switch (result){
            case 'precoA':
              // console.log('Preço Ascendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                let descontoA:number;
                let descontoB:number;

                if (a.promo && !isNaN(a.promoDesconto) && a.promoDesconto >= 0) descontoA = a.promoDesconto;
                else descontoA = 0;

                if (b.promo && !isNaN(b.promoDesconto) && b.promoDesconto >= 0) descontoB = b.promoDesconto;
                else descontoB = 0;

                return ((a.preco * 0.01 * (100 - descontoA)) - (b.preco * 0.01 * (100 - descontoB)));
              })
              break;
            case 'precoD':
              // console.log('Preco Descendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                let descontoA:number;
                let descontoB:number;

                if (a.promo && !isNaN(a.promoDesconto) && a.promoDesconto >= 0) descontoA = a.promoDesconto;
                else descontoA = 0;

                if (b.promo && !isNaN(b.promoDesconto) && b.promoDesconto >= 0) descontoB = b.promoDesconto;
                else descontoB = 0;

                return ((b.preco * 0.01 * (100 - descontoB)) - (a.preco * 0.01 * (100 - descontoA)));
              })
              break;
            case 'nomeA':
              // console.log('Nome Ascendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return a.nome.localeCompare(b.nome)
              })
              break;
            case 'nomeD':
              // console.log('Nome Descendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return a.nome.localeCompare(b.nome)
              }).reverse();
              break;
            case 'catA':
              // console.log('Categoria Ascendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return this.getCategoriaProduto(a.categoria).localeCompare(this.getCategoriaProduto(b.categoria))
              })
              break;
            case 'catD':
              // console.log('Categoria Descendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return this.getCategoriaProduto(b.categoria).localeCompare(this.getCategoriaProduto(a.categoria))
              })
              break;
            case 'estadoA':
              // console.log('Produtos na wishlist')
              this.listaitens = this.listaitens.sort((a,b) =>{
                if(this.itemAddedToWishList(a.id) && this.itemAddedToWishList(b.id)) {
                  return b.nome.localeCompare(a.nome);
                }
                else if (this.itemAddedToWishList(a.id) && !this.itemAddedToWishList(b.id)) return 1;
                else if (!this.itemAddedToWishList(a.id) && this.itemAddedToWishList(b.id)) return -1;
                else return b.nome.localeCompare(a.nome);
              }).reverse()
              break;
            case 'estadoD':
              // console.log('Produtos no carrinho')
              this.listaitens = this.listaitens.sort((a,b) =>{
                if(this.itemAddedToCarrinho(a.id) && this.itemAddedToCarrinho(b.id)) {
                  return b.nome.localeCompare(a.nome);
                }
                else if (this.itemAddedToCarrinho(a.id) && !this.itemAddedToCarrinho(b.id)) return 1;
                else if (!this.itemAddedToCarrinho(a.id) && this.itemAddedToCarrinho(b.id)) return -1;
                else return b.nome.localeCompare(a.nome);
              }).reverse()
              break;
            case 'promo':
              // console.log('Produtos em Promoção')
              this.listaitens = this.listaitens.sort((a,b) =>{
                if(a.promo && b.promo) {
                  return b.nome.localeCompare(a.nome);
                }
                else if (a.promo && !b.promo) return 1;
                else if (!a.promo && b.promo) return -1;
                else return b.nome.localeCompare(a.nome);
              }).reverse()
              break;

            default:
            this.listaitens = this.listaitens.sort((a,b) =>{
              return b.preco-a.preco;
            })

          }

        }
        else{
          this.listaitens = this.data.lista;
        }

    }

    // console.log(result)
  }




}
