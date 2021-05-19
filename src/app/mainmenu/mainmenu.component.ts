import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, OnChanges, DoCheck } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})


// Uso de inúmeros lifecycle hooks para aprendizagem/experimentação e resolução de problemas
export class MainmenuComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, OnChanges, DoCheck {
  myToken: string | false = false;
  myName: string | false = false;
  loggedIn: boolean;
  @ViewChild('checkbox_element') checkbox_element: ElementRef;
  @ViewChild('content') content;
  popUpModal: boolean = false;
  isUserAdmin: boolean;
 

  constructor(private _login:LoginService, private router: Router, private modalService: NgbModal ) { 

  }

  ngOnInit(): void {


    //Verificar se Utilizador está autenticado, seja porque fez login ou porque a sua sessão neste browser ainda é válida (caso tokenID guardado em localstorage faça match do tokenID na DB)
    //Usei um observable criado a partir de um Subject com rxjs para poder manter esta informação sempre atualizada assincronamente através de um serviço e evitar erros de alterações de variáveis após o Angular já ter feito verificação de expressões/valores (erros de "ExpressionChangedAfterItHasBeenCheckedError").
       
       this._login.utilizadorEstaAutenticado();
       this._login.userLoggedIn$
       .subscribe( 
         message => {
           this.loggedIn = message['loggedIn'];
           if (this.loggedIn){
              this.myToken = message['token'];
              if (this.myToken){
                this.myName = this._login.nomeUtilizador(this.myToken);
                let myFirstName = this.myName.toString().trim().split(' ')[0];
                this.myName = myFirstName;
                // console.log(this.myToken + ' ----- ' + this._login.existemAnonymousLists())

                //Caso existam itens em listas de utilizador anónimo e este faça login, então faça-se pop up do modal para oferecer ao utilizador a possibilidade de gravar essas seleções na sua própria conta.
                this.popUpModal = this._login.existemAnonymousLists();
                
              }
            }
            this.isUserAdmin = this._login.isUserAdmin(); 
            // console.log('mainmenu call: o user é admin? ' + this.isUserAdmin)
         }
         );
      
       //end Autenticação

      //  console.log(this.myName + " ------ " +  this.myToken)
      this.isUserAdmin = this._login.isUserAdmin();
  }



  //Muitos testes e experimentação com lifecycle hooks, um verdadeiro mistério transcendental com ainda muito por descobrir!
    ngAfterViewInit(): void {
      // this._login.userLoggedIn$
      //  .subscribe( 
      //    message => {
      //      if (message['loggedIn']){
      //         if (message['token']){
      //           this.openVerticallyCentered(this.content);
      //         }
      //       }
      //    }
      //    );
      
    }

    ngOnChanges() {

      // if (this.myToken && this._login.existemAnonymousLists()){
      //   this.openVerticallyCentered(this.content);
      //   }
      //   console.log('ONCHANGES')

    }

    ngDoCheck() {
      // if (this.myToken && this._login.existemAnonymousLists()){
      //   this.openVerticallyCentered(this.content);
      //   }
        
      // console.log("ngDoCheck")

  }

    ngAfterViewChecked() {
     
      // if (this.myToken && this._login.existemAnonymousLists()){
                   
      //   this.openVerticallyCentered(this.content);
      //  //pode-se fazer .close() or .dismiss() ao modal a partir do componente ou do template modal.dismiss('Cross click')
        
      //   // popup a perguntar se quer gravar com botão "Gravar" ou "não"
      //   // se gravar ENTÃO:
      //   // this._login.guardarAnonymousListsNaConta(this.myToken)
      // }
    }


    ngAfterContentInit() {
      
    }
  
  
    ngAfterContentChecked() {
       

    }
  



  // Caso o utilizador clique em logout, então faça-se logout fazendo a alteração das respectivas variáveis relacionadas com a autenticação, assim como alteração da token no localstorage e um redirect para a root da página.

  logout(){
    this._login.logout();
    this.myToken = false;
    this.myName = false;
    this.checkbox_element.nativeElement.checked = false;
    this.popUpModal = false;
    this.router.navigate(['/']);
    this.isUserAdmin=false;
  }




}
