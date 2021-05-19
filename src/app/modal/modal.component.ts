import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges {
  myToken: string | false = false;
  myName: string | false = false;
  loggedIn: boolean;
  @ViewChild('content') content;
  modalRef: NgbModalRef;
  @Input('popUpModal') popUpModal: any;


  constructor(private _login:LoginService, private router: Router, private modalService: NgbModal ) {

  }

  ngOnInit(): void {}


  //Verifica se o valor da variável proveniente do elemento-pai através do decorador Input chamada "popUpModal" mudou, e caso seja verdadeira, então faça-se pop-up do modal propriamente dito
  ngOnChanges() {
    if (this.popUpModal) this.openVerticallyCentered(this.content);
  }

//função para chamada ao serviço de modal do bootstrap para fazer o render do modal
  openVerticallyCentered(content) {
    // setTimeout(() => this.modalService.open(content, { centered: true }),1);
    this.modalRef = this.modalService.open(content, { centered: true });

  }

// após abertura do modal, o utilizador pode escolher entre guardar os produtos nas listas anónimas para a sua conta, ou não o fazer.
//Caso escolha guardar, então copia-se as listas anónimas de favoritos e carrinho para as do utilizador autenticado
// e após isso, seja qual for a seleção do utilizador, fecha-se o modal
  copiarProdutos(desejoCopiar:boolean){

    if (desejoCopiar){
      this._login.copiarAnonymousLists();
      // console.log('produtos guardados');
    }



    // console.log(this.modalRef);
    this.modalRef.close();
    // this.modalRef.dismiss();

  }


}
