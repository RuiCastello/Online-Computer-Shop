import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate, registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { NgForm } from '@angular/forms';


import { Utilizador } from '../utilizador';
import { LoginService } from '../login.service';
import { DataService } from '../data.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnChanges {
  titulo:string;
  descricao:string;
  deadline:string;
  categoria: string;
  utilizador: Utilizador;
  erroRegisto: boolean = false;
  msgErro: string = "";

  // @ViewChild('variavelTemplateReference') - Permite-nos usar uma "template reference variable" dentro do componente sem ter de recorrer a "exportação" via uma function call usando um evento, por exemplo: (click)="funcaoBonita(variavelTemplateReference)".
  @ViewChild('emailNgModel') something: ElementRef;




  constructor(private data: DataService, private _login: LoginService, private router: Router) {
    //
    // Declarar nos parametros do construtor palavras-chave public ou private, declara a própria variável em modo "this", desta forma não temos que a redeclarar novamente.
    //

    registerLocaleData(pt);

    this.utilizador = new Utilizador();
  }


  //Métodos de experimentação e teste com lifecycle hooks
  ngOnInit(): void {


  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(this.teste)
  }

teste(){
  // console.log(this.something)
}


//Método que recebe os dados do formulário e os processa para os serviços de registo de novo utilizador, no fim faz redirect ao utilizador para que faça o login com uma mensagem adequada.
onSubmit(registerForm: NgForm){
  // console.log(this.utilizador);
  // console.log(loginForm);

    let foiAdicionado:string = this._login.adicionarUtilizador(this.utilizador);
    console.log(this._login.listaUtilizadores);

    if (foiAdicionado == "sucesso") this.changeRoute('/login','registado', '');
    else {
      this.msgErro = foiAdicionado;
      this.erroRegisto = true;
    }

}



//Método reutilizável que redireciona o utilizador para outro url
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
