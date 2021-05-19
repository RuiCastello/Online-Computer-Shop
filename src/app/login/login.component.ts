import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate, registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { NgForm } from '@angular/forms';


import { Utilizador } from '../utilizador';
import { LoginService } from '../login.service';

import { DataService } from '../data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges  {
  titulo:string;
  descricao:string;
  deadline:string;
  categoria: string;
  utilizador: Utilizador;
  userSelfId: number;
  registado: boolean = false;
  erroLogin: boolean = false;

  // @ViewChild('variavelTemplateReference') - Permite-nos usar uma "template reference variable" dentro do componente sem ter de recorrer a "exportação" via uma function call usando um evento, por exemplo: (click)="funcaoBonita(variavelTemplateReference)".
  @ViewChild('emailNgModel') something: ElementRef;



  //Injectam-se os serviços habituais da app, serviço de dados gerais, login, e routing
  constructor(private data: DataService, private _login: LoginService, private router: Router, private actRoute: ActivatedRoute) {

    registerLocaleData(pt);

    // this.data = data
    // this.router = router;
    // this.utilizador = new Utilizador(1, true, 'doe', 'maneli', 'tipo@isto.pt', '2123233252', '1234', [{}], [{}], 'foto.jpg', {rua: 'rua tal', });
    this.utilizador = new Utilizador();
  }


  //Verifica o url para apresentar mensagens adequadas à situação actual do utilizador através de condicionais *ngIf no template
  ngOnInit(): void {
    if (this.actRoute.snapshot.params.registado == 'registado'){
      this.registado = true;
    }
    else if(this.actRoute.snapshot.params.registado == 'errologin'){
      this.erroLogin = true;
    }
  }


  //Métodos de experimentação e testes
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(this.teste)
  }

  teste(){
    // console.log(this.something)
  }



  //Método principal que recebe dados de login e usa-os em calls a serviços que gerem a autenticação
  onSubmit(loginForm: NgForm){
    // console.log(this.utilizador);
    // console.log(loginForm);

    let foiEncontrado:number | boolean = this._login.utilizadorEnviaLogin(this.utilizador.username, this.utilizador.password);
    // console.log(this._login.listaUtilizadores);

    if (foiEncontrado && foiEncontrado > 0) {
      this.userSelfId = foiEncontrado;
      this.changeRoute('/listagem','bemvindo', this.userSelfId.toString());
    }
    else this.changeRoute('/login', 'errologin','');

  }

  //Método usado para redirecionar o utilizador, com argumentos para que possa ser reutilizado
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
