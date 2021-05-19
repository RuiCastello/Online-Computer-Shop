import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate, registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt-PT';
import { NgForm } from '@angular/forms';

//
// Class Utilizador criada para que a criação de um objecto Utilizador fosse mais imediata com respectiva inicialização.
//
import { Utilizador } from '../utilizador';

//
//Importação de serviços para funcionalidades relacionadas com a gestão de dados de Utilizadores e um serviço mais genérico para fornecer outras funcionalidades do site mais relacionadas com dados e métodos sobre produtos.
//
import { LoginService } from '../login.service';
import { DataService } from '../data.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnChanges {
  titulo:string;
  descricao:string;
  deadline:string;
  categoria: string;
  utilizador: Utilizador;
  erroEditado: boolean = false;
  msg: string = "";
  userEstaLogado: boolean;

  //
  // O uso de ViewChild nos elementos abaixo serve apenas para aprendizagem e teste, para ler os objectos gerados pelo Angular e perceber bem a sua estrutura interna para que possa apanhar os erros de validação e perceber como tudo funciona.
  //

  //
  // @ViewChild('variavelTemplateReference') - Permite-nos usar uma "template reference variable" dentro do componente sem ter de recorrer a "exportação" via uma function call usando um evento, por exemplo: (click)="funcaoBonita(variavelTemplateReference)".
  //
  @ViewChild('fotoNgModel') something: ElementRef;
  @ViewChild('msgElement') msgElement: ElementRef; // Podia-se usar tb aqui HTMLElement e aí não se teria de fazer msgElement.nativeElement para chegar ao elemento no DOM




  //
  // Uso de vários injectables: o router para que possa redirecionar o utilizador.
  // e dois serviços criados para lidar com todo o tipo de tratamento de dados necessários para o site.
  // Divididos entre um serviço de Login, que gere utilizadores e serve dados provenientes de Utilizadores.
  // E DataService, que serve métodos e dados relativos a funções de interação com produtos e outros elementos do próprio site.
  //

  constructor(private data: DataService, private _login: LoginService, private router: Router) {
    // Dependency injection
    // Ao declarar nos parametros do construtor palavras-chave public ou private, estas variáveis passam a fazer automaticamente parte de "this", desta forma não temos de as redeclarar ou criar/instanciar.
    //

    registerLocaleData(pt);

    // this.utilizador = new Utilizador();
  }

  ngOnInit(): void {

    // Verificação se o Utilizador já se encontra autenticado
    let tokenId:string = this._login.utilizadorEstaAutenticado();

    if (tokenId && tokenId != ""){
      this.userEstaLogado = true;
      //
      //recebe um objecto Utilizador sem dados sensíveis ou desnecessários (password por exemplo) para este formulário.
      //A password pode ser alterada, mas como não queremos nem precisamos que ela seja mostrada, é removida do objecto antes de chegar a este componente por uma questão de segurança.
      //
      this.utilizador = this._login.getUtilizadorClean();

      // console.log(this.utilizador)

    }

  }

  //
  // Métodos de teste e aprendizagem de lifecycle hooks e de váriaveis provenientes do template.
  //
  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.teste)
  }

  teste(){
    // console.log(this.something)
  }

  teste2(variavel){
    // console.log(variavel)
  }

  //
  //Método principal que recebe os dados do formulário e os envia para os respectivos serviços para atualização dos respectivos dados do Utilizador.
  //
  onSubmit(accountForm: NgForm){
    // console.log(this.utilizador);
    // console.log(loginForm);

    let foiEditado:string = this._login.updateUtilizador(this.utilizador);
    // console.log(this._login.listaUtilizadores);
    // console.log(this.utilizador)

    //
    // Caso a atualização de dados tenha sido bem sucedida então mostra mensagem de sucesso e faz scroll suave para essa mensagem caso o utilizador esteja fora da view da mensagem.
    //
    if (foiEditado == "sucesso") foiEditado = "A conta foi editada com sucesso.";
    this.msg = foiEditado;
    // this.erroEditado = true;

    this.msgElement.nativeElement.scrollIntoView({behavior: 'smooth'});


  }


  //
  // Método para mudar de url (reutilizável com alguns argumentos)
  //
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

  }//end class
