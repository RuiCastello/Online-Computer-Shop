import { Component, OnInit } from '@angular/core';
import { IProduto } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { FormControl } from '@angular/forms';


//
// Componente muito semelhante ao componente Carrinho, mas para mostrar apenas produtos na lista de favoritos, além disso é um pouco mais simplificado pois não precisa de lidar com pagamentos.
//

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
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
  listaitensOriginal: IProduto[];
  
  constructor(private data: DataService, actRoute: ActivatedRoute, private _login:LoginService) { 

    this.listaitens = data.listaWishlist();
    this.listaitensOriginal = [...this.listaitens];
    this.actRoute = actRoute;
    
    for (let index in this.listaitens) this.clickedExpand[index] = false;
    this.catArray = data.getCatArray();

    console.log(this.catArray);
    for(let index in this.catArray) this.catFiltered[index] = false;

  }

  ngOnInit(): void {
    if (this.actRoute.snapshot.params.filtrar == 'filtrar'){
      this.filtrar = true;
    }
    else if (this.actRoute.snapshot.params.filtrar == 'bemvindo'){
      this.userLoggedIn = true;
      this.userSelfId = this.actRoute.snapshot.params.filtroInput.toString();
      console.log(this.userSelfId);
    }

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



  expandAll(){
    let letsExpand:boolean;
    if (this.clickedExpand[0] == false) {letsExpand = true;}
    else {letsExpand = false;}

    for (let index in this.clickedExpand){
      this.clickedExpand[index] = letsExpand;
    }
  }

  filterCat(catNumber?:number){
    
    if(catNumber >= 0) this.catFiltered[catNumber] = !this.catFiltered[catNumber];

    this.listaitens = this.data.procurarListaCat(this.catFiltered);
    if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.listaWishlist();
    //console.log(this.catFiltered);
    
  }


  filterCatSingle(categoria:number | string){
    
    console.log(categoria);

    this.listaitens = this.data.procurarListaCatSingle(categoria as number);

    
    // if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.listaWishlist();
    //console.log(this.catFiltered);
    
  }

  getCategoriaProduto(cat:number){
    return this.data.getCategoriaProduto(cat);
  }


  filtrarMultiplasCat(event) {

    let result:[];

   
    if(event) {
      for(let index in this.catArray) this.catFiltered[index] = false;

      result = this.categoriaControl.value;

      if (result.length > 0){
          result.forEach( (element) => {
            if(element >= 0) this.catFiltered[element] = true;
          });
          this.listaitens = this.data.procurarListaCat(this.catFiltered, this.listaitensOriginal);
          if (this.catFiltered.indexOf(true) < 0) this.listaitens = this.data.listaWishlist();
        }
        else{
          this.listaitens = this.data.listaWishlist();
        }
      
    }

    console.log(result)
  }

  itemAddedToWishList(productId:number)
  {
    let itemIsAddedtoWishList = this.data.isProductAddedToWishlist(productId);
    // console.log(isAdded)

    return itemIsAddedtoWishList;
  }


  itemAddedToCarrinho(productId:number)
  {
    let itemIsAddedtoCarrinho = this.data.isProductAddedToCarrinho(productId);
    // console.log(isAdded)

    return itemIsAddedtoCarrinho;
  }


  ordenar(event) {
    let result:string;
   
    if(!event) {
      console.log('dropdown closed');
      result = this.ordenarControl.value;

      if (result){
          switch (result){
            case 'precoA':
              console.log('Preço Ascendente!')
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
              console.log('Preco Descendente!')
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
              console.log('Nome Ascendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return a.nome.localeCompare(b.nome)
              })
              break;
            case 'nomeD':
              console.log('Nome Descendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return a.nome.localeCompare(b.nome)
              }).reverse();
              break;
            case 'catA':
              console.log('Categoria Ascendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return this.getCategoriaProduto(a.categoria).localeCompare(this.getCategoriaProduto(b.categoria))
              })
              break;
            case 'catD':
              console.log('Categoria Descendente!')
              this.listaitens = this.listaitens.sort((a,b) =>{
                return this.getCategoriaProduto(b.categoria).localeCompare(this.getCategoriaProduto(a.categoria))
              })
              break;
            case 'estadoA':
              console.log('Produtos na wishlist')
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
              console.log('Produtos no carrinho')
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
              console.log('Produtos em Promoção')
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
          this.listaitens = this.data.listaWishlist();
        }
      
    }

    console.log(result)
  }

  removerDaLista(productID:number){
    // console.log('evento está a funcionar!')
    if (productID && productID >=0) this.data.removeFromNovaLista(productID, this.listaitens);
  }


}
