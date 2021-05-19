import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate, registerLocaleData } from '@angular/common';
import ptPT from '@angular/common/locales/pt-PT';
import { NgForm } from '@angular/forms';


import { Utilizador } from '../utilizador';
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
import { IProduto } from '../interfaces';


@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss']
})

export class AdicionarComponent implements OnInit {
  titulo:string;
  descricao:string;
  deadline:string;
  categoria: string;
  utilizador: Utilizador;
  erroEditado: boolean = false;
  msg: string = "";
  userEstaLogado: boolean;
  isUserAdmin: boolean = false;
  produto: IProduto;
  catArray: number[];

    // @ViewChild('variavelTemplateReference') - Permite-nos usar uma "template reference variable" dentro do componente sem ter de recorrer a "exportação" via uma function call usando um evento, por exemplo: (click)="funcaoBonita(variavelTemplateReference)".
    @ViewChild('fotoNgModel') something: ElementRef;
    @ViewChild('msgElement') msgElement: ElementRef; // Podia-se usar tb aqui HTMLElement e aí não se teria de fazer msgElement.nativeElement para chegar ao elemento no DOM
    @ViewChild('accountForm') ngFormElement: ElementRef;

  constructor(private data: DataService, private router: Router, private _login: LoginService) {

    //regista o locale ptPT para que algumas coisas que usam o i18n funcionem, como alguns pipes usados pelos templates por exemplo
    registerLocaleData(ptPT);

    //Inicializa o objecto this.produto do tipo IProduto para que possa receber valores sem erros do tipo undefined, etc.
    this.produto = { id: -100, nome: "", descricao: "", preco: 1, promo: false, promoDesconto: 0, stock: 1, categoria: undefined, imagem: ""}

    // Recebe um array com todas as categorias de produtos da loja
    this.catArray = data.getCatArray();
    // this.data = data
    // this.router = router;
  }

  ngOnInit(): void {

    //Verifica se utilizador está logado e que tipo de utilizador é, depois espalha essa informação pelo componente através de variáveis
    let tokenId:string = this._login.utilizadorEstaAutenticado();
    if (tokenId && tokenId != ""){
      this.userEstaLogado = true;
      this.isUserAdmin = this._login.isUserAdmin();

    }
  }

  //Métodos de teste para aprendizagem e experimentação

  teste(){
    console.log(this.something)
    console.log(this.ngFormElement)
  }
  
  teste2(variavel){
    console.log(variavel)
  }
  
  //Método principal que recebe e trata os dados provenientes da form do template
  onSubmit(accountForm: NgForm){
    // console.log(this.utilizador);
    // console.log(loginForm);

      let foiAdicionado:boolean = this.data.addToLista(this.produto);
      // console.log(this._login.listaUtilizadores);
      // console.log(this.utilizador)
      if (foiAdicionado) this.msg = "O produto foi adicionado com sucesso.";

      this.msgElement.nativeElement.scrollIntoView({behavior: 'smooth'});


  }


    //Método que já não deverá estar a ser usado neste componente, mas mantido por uma questão de demonstração/documentação
  changeRoute(rota:string, subpath:string, subSubpath?:string) {
    this.router.navigate([rota, subpath, subSubpath]).then(
      nav => {
        // console.log(nav); // true se a navegação funcionou
      },
      err => {
        // console.log(err) // output do erro se algo correu mal
      }
      );
    }

    //Recebe a categoria de um produto em nome descritivo (string) dado o seu valor númerico
    getCategoriaProduto(cat:number):string{
      return this.data.getCategoriaProduto(cat);
    }





}//end class
