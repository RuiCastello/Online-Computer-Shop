import { Injectable } from '@angular/core';
import { Utilizador } from './utilizador';
import { Subject } from 'rxjs';
import { IProdutoCarrinho } from './interfaces';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

//
// Serviço com diferentes métodos relacionados com gestão de utilizadores e autenticação
//

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  //Inicialização de uma lista de Utilizadores que irá conter todos os utilizadores registados
  
  private _listaUtilizadores: Utilizador[] = [];

  //Criação de um observable a partir de um Subject para propagar a informação sobre o estado da autenticação do utilizador atual aos componentes que o necessitarem
  private _userLoggedIn = new Subject<object>();
  userLoggedIn$ = this._userLoggedIn.asObservable();

  //Inicialização de um utilizador anónimo para fornecer serviços básicos a um utilizar não autenticado.
  utilizadorAnonimo:Utilizador = new Utilizador();
  previous_token: string;
  previous_userLogado: boolean;
  // utilizadoresDB: Observable<any[]>;
  
  // Ligação à base de dados Firebase
  db: AngularFireDatabase;

  
  constructor(db: AngularFireDatabase) {   
    
    let idUltimoUtilizador:number = this.getIdUltimoUtilizador();
    
    //
    // Para poder testar rapidamente:
    // Aqui define-se os primeiros user na base de dados
    // Isto foi a implementação inicial e que ainda funciona, mas que agora é overriden pela leitura de Utilizadores registados diretamente da base de dados Firebase
    //
    let novoUtilizador = new Utilizador(1, true, 'admin', 'Rui Castello', 'admin@genericstore.pt', '214425876', '123123123aA1!', [], [], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',  {cidade: '', codigoPostal: '', pais: '', rua: ''},'sad030d93j20djd221', true);
    this._listaUtilizadores.push(novoUtilizador);

    novoUtilizador = new Utilizador((idUltimoUtilizador + 1 ), true, 'maneli', 'José Manuel dos Santos Silva e Cunha', 'maneli@gmail.com', '21746292832', '123123123aA1!', [], [], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80', {cidade: '', codigoPostal: '', pais: '', rua: ''},'c2938nu2398c32cne23');
    this._listaUtilizadores.push(novoUtilizador);

    console.log(this._listaUtilizadores)
    //console.log(novoUtilizador)
    

    //funções criadas enquando estava a testar diferentes métodos de ligar à firebase e extrair dados
    let gotData = (data) => {
      console.log(data.val());
      let novaLista = data.val();
      this._listaUtilizadores = novaLista;
      // this.utilizadorEstaAutenticado();
      // novaLista = novaLista[Object.keys(novaLista)[0]];
      // console.log(novaLista);
    };

    let errData = (error) => {
      console.log(error);
      console.log('ERRO a buscar dados na firebase');
    };

    // para escrever na base de dados firebase (tb se podia usar push() ao invés de set, mas aí era gerado um novo key id pela db)
    // db.database.ref('utilizadores').set(this._listaUtilizadores);

    //ler a db (Utilizadores)
    //Aqui obtêm-se uma referencia ao elemento Utilizadores na Firebase
    let ref = db.database.ref('utilizadores');
    // ref.push(this._listaUtilizadores);
    // ref.on('value', gotData, errData);
   
    this.db = db;

    //A partir desta referência à lista de Utilizadores na Firebase, podemos extraí-la e guardá-la numa variável, neste caso guardá-la e mantê-la atualizada sempre que a base de dados mude.
    db.list('/utilizadores').valueChanges()
    .subscribe(utilizadores =>{
      // console.log('WHATT')
      // console.log(utilizadores)
      let novaLista = <Utilizador[]>utilizadores;

      //Aqui resolve-se um problema relacionado com o facto da Firebase não guardar arrays vazios, e como a ligação à firebase foi a última coisa a ser feita na app, tive de implementar uma forma rápida de corrigir e trazer compatibilidade entre a estrutura de dados na Firebase e a forma como a app funciona. De qualquer das formas, algum código teve mesmo de ser alterado, mas não extensivamente, graças a esta pequena patch/workaround.
      novaLista.forEach(element =>{
        if (!element.carrinho) element.carrinho = [];
        if (!element.wishList) element.wishList = [];
        if (!element.tokenId) element.tokenId = "";
      })

      this._listaUtilizadores = novaLista;

    })
    


   



    // this.utilizadoresDB = db.list('utilizadores').valueChanges();
    // console.log(this.utilizadoresDB);
   
  }//end constructor
  
  //Método para alterar o valor do observable que reflete o estado de autenticação a cada momento
  globalLoggedInState(userLogado:boolean, token?:string){
    let state = {loggedIn:userLogado, token:token};
    // console.log(state);
    

    if (!this.previous_token || !this.previous_userLogado || this.previous_token != token || this.previous_userLogado != userLogado)
    {
      this.previous_userLogado = userLogado;
      this.previous_token = token;
      console.log(this._userLoggedIn)
      this._userLoggedIn.next(state);
    }
  }
  
  // Devolve o id do último Utilizador na lista
  getIdUltimoUtilizador()
  {
    let elementoIdMaior:number = -999;
    
    if(this._listaUtilizadores){
      this._listaUtilizadores.forEach( (element) => {
        if (elementoIdMaior < element.id) elementoIdMaior = element.id; 
      });
    }
    
    if (elementoIdMaior < 1) elementoIdMaior = 0;
    
    return elementoIdMaior;
  }//end getIdUltimoUtilizador


  // Faz update aos dados de um utilizador
  // Visto que já há validação nos formulários, aqui valida apenas se os campos estão preenchidos, e faz update apenas aos que estão
  updateUtilizador(updateUtilizador: Utilizador):string{
    let userAposAtualizacao: Utilizador;
    let novoUtilizadorClone = {...updateUtilizador};
    if (novoUtilizadorClone) {
      let esteUtilizadorToken = this.utilizadorEstaAutenticado();
      if(esteUtilizadorToken){

        let updatedUser = this._listaUtilizadores.some(element =>{
          if (element.tokenId == esteUtilizadorToken){
            if (novoUtilizadorClone.email && !this.checkIfUsernameEmailAlreadyExists(novoUtilizadorClone.email)) element.email = novoUtilizadorClone.email;
            if (novoUtilizadorClone.username && !this.checkIfUsernameEmailAlreadyExists(novoUtilizadorClone.username)) element.username = novoUtilizadorClone.username;
            if (novoUtilizadorClone.nome) element.nome = novoUtilizadorClone.nome;
            if (novoUtilizadorClone.morada) element.morada = novoUtilizadorClone.morada;
            if (novoUtilizadorClone.password && novoUtilizadorClone.password.length > 5) element.password = novoUtilizadorClone.password;
            if (novoUtilizadorClone.fotoPerfil) element.fotoPerfil = novoUtilizadorClone.fotoPerfil;
            if (novoUtilizadorClone.telefone) element.telefone = novoUtilizadorClone.telefone; 
            // console.log(element)
            // console.log(novoUtilizadorClone)
            userAposAtualizacao = element;
            return true;
          }
        });
    
        if( updatedUser) { 
          // this.db.database.ref('utilizadores').set(this._listaUtilizadores);
          // this.db.database.ref('utilizadores/')
          
          //
          // Faz Update à entry individual na db do firebase 
          //
          let query = this.db.database.ref('utilizadores').orderByChild("tokenId").equalTo(esteUtilizadorToken);
          query.once("child_added", snapshot => {
            snapshot.ref.update(userAposAtualizacao)
          });

          return 'sucesso'; 
        }
        else return 'Erro, por favor tente novamente';
      }
      else return 'Erro, por favor tente novamente';
    }
    return 'Erro, por favor tente novamente';
  }//end updateUtilizador

  
  //
  //Adiciona novo utilizador à lista
  //
  adicionarUtilizador(novoUtilizador: Utilizador):string{
    let novoUtilizadorClone = {...novoUtilizador};
    if (novoUtilizadorClone) {
      novoUtilizadorClone.id = this.getIdUltimoUtilizador() + 1;
      
      if(!this.checkIfUserAlreadyExists(novoUtilizador)){
        let oldLength:number = this._listaUtilizadores.length;
        let newLength:number = this._listaUtilizadores.push(novoUtilizadorClone);

        this.db.database.ref('utilizadores').set(this._listaUtilizadores);

        if( newLength > oldLength ) return 'sucesso';
        else return 'Erro, por favor tente novamente';
      }
      else return 'Nome de utilizador já existente';
    }
    return 'Erro, por favor tente novamente';
  }//end adicionarUtilizador
  
  // Verifica se o Utilizador já existe de uma forma não case-sensitive
  checkIfUserAlreadyExists(novoUtilizador: Utilizador)
  {
    let result:boolean = this._listaUtilizadores.some( (element) => {
      if (novoUtilizador.email.toLowerCase() == element.email.toLowerCase() || novoUtilizador.username.toLowerCase() == element.username.toLowerCase()) {
        return true;
      }
    });

    return result;
  }//end checkIfUserAlreadyExists

  // Verifica se um endereço de email ou username já existem de uma forma não case-sensitive
  checkIfUsernameEmailAlreadyExists(usernameEmail: string)
  {
    let result:boolean = this._listaUtilizadores.some( (element) => {
      if (usernameEmail.toLowerCase() == element.email.toLowerCase() || usernameEmail.toLowerCase() == element.username.toLowerCase()) {
        return true;
      }
    });

    return result;
  }//end checkIfUserAlreadyExists
  

  //devolve a lista de utilizadores
  get listaUtilizadores(){
    return this._listaUtilizadores;
  }
  
  // remove um utilizador dado o seu id, da lista de utilizadores
  removeFromListaUtilizadores(id: number){
    
    let result:boolean = this._listaUtilizadores.some( (element, index) =>{
      if(element.id == id) {
        this._listaUtilizadores.splice(index, 1);
        index--;
        return true;
      }   
    })//end some
    
    return result;
  }//end removeFromListaUtilizadores
  
  //faz query à firebase especificamente ao Utilizador autenticado, e faz update a essa entry na DB
  UpdateDBWithUser():boolean{

    if( this.utilizadorEstaAutenticado() ){
      let user:Utilizador = this.getproprioUtilizador();
      let email = user.email;
      if(email){
        let query = this.db.database.ref('utilizadores').orderByChild("email").equalTo(email);
        query.once("child_added", snapshot => {
          snapshot.ref.update(user);
        });
        return true;
      }
      return false; 
    }
    return false;
  }
  

  //Quando um utilizador faz login, este método verifica se o utilizador pode ser autenticado.
  //Caso afirmativo, autentica-o e passa essa informação para o observable e mete um token no localstorage
  utilizadorEnviaLogin(username:string,pass:string){
    let userSelfId: number;
    
    let rand = function() {
      return Math.random().toString(36).substr(2);
    };
    
    let token = function() {
      return rand() + rand();
    };
    
    let tokenId:string = token();
    
    let result:boolean = this._listaUtilizadores.some( (element, index) =>{
      if((element.username == username || element.email == username) && element.password == pass ) {
        userSelfId = element.id;
        element.tokenId = tokenId;

        let query = this.db.database.ref('utilizadores').orderByChild("email").equalTo(element.email);
        query.once("child_added", snapshot => {
          snapshot.ref.update(element)
        });

        // this.db.database.ref('utilizadores').set(this._listaUtilizadores);
        return true;
      }   
    })//end some
    
    if (result) {
      localStorage.setItem('currentUser', tokenId);
      this.globalLoggedInState(true, tokenId);
      return userSelfId;
    }
    else {
      return false;
    }
    
  }//end utilizadorEnviaLogin
  
  //Verifica se o Utilizador se encontra autenticado e caso não esteja e deva estar (através de auto-login com reconhecimento da token no localstorage, faz o auto-login ao utilizador e passa novamente essa info para o Observable)
  utilizadorEstaAutenticado()
  {
    let tokenId:string = localStorage.getItem('currentUser');
    // console.log('TOKEN no localstorage É: '+tokenId)
    if (tokenId && tokenId != "")
    {
      let userSelfId:number;
      // console.log('DENTRO'+tokenId)
      let result:boolean = this._listaUtilizadores.some( (element, index) =>{
        if(element.tokenId == tokenId) {
          userSelfId = element.id;
          // console.log('checked' + element.tokenId)
          return true;
        }   
      })//end some
      
      if (result && userSelfId > 0)
      { 
        this.globalLoggedInState(true, tokenId);
        return tokenId;
      }
      else return null;
    }
    else return null;
  }//end utilizadorEstaAutenticado
  
  
  // Devolve o nome do utilizador
  nomeUtilizador(tokenId:string){
    let meuNomeUtilizador:string;
    
    let result:boolean = this._listaUtilizadores.some( (element, index) =>{
      if(element.tokenId === tokenId) {
        meuNomeUtilizador = element.nome;
        return true;
      }   
    })//end some
    
    if (result && meuNomeUtilizador != "") return meuNomeUtilizador;
    else return false;
  }//end nomeUtilizador
  
  
  //Faz logout limpando a token do localstorage e alterando o estado de autenticação interno
  logout(){
    localStorage.clear();
    this.globalLoggedInState(false, null);

    return true;
  }//end logout
  
  // Devolve um Utilizador sem dados sensíveis para elemento onde isso não seja necessário
  // Isto é um pouco simulação de backend visto que a app não tem backend.
  // É óbvio que aqui neste projecto a app sabe das passwords, mas a ideia é que nem todos os componentes precisam de saber isso, imaginando que parte destes serviços vinham de backend iríamos querer separar as coisas, certos dados só podem entrar e nunca sair, sair só mesmo respostas a validação.
  getUtilizadorClean(){
    let user:Utilizador = this.getproprioUtilizador();

    if (user.id && user.username && user.id > 0 && user.username != ""){
      let userClean = {...user};
      userClean.password = null;
      userClean.admin = null;
      userClean.id = null;
      userClean.tokenId = null;
      return userClean;
    }

  }


  // devolve um Utilizador, se autenticado devolve o Utilizador autenticado, se anónimo devolve um Utilizador neutro para que possa usufruir de serviços básicos do site.
  private getproprioUtilizador(){
    
    let tokenId = this.utilizadorEstaAutenticado();
    let proprioUtilizador:Utilizador = null;
      
      if(tokenId){
        proprioUtilizador = this._listaUtilizadores.filter((element) =>{
          if(element.tokenId === tokenId) {
            return true;
          }
        })[0];
      }
      else{
        proprioUtilizador = this.utilizadorAnonimo;
      }

      return proprioUtilizador;
  }//end getproprioUtilizador


  //devolve a lista de favoritos do utilizador
  getWishListUtilizador(){
    let proprioUtilizador:Utilizador = this.getproprioUtilizador();
    
    if (proprioUtilizador) {
      // console.log(JSON.stringify(proprioUtilizador.wishList))
      return proprioUtilizador.wishList;
    }
    else return null;
  }//endgetWishListUtilizador
  

  //devolve o carrinho do utilizador
  getCarrinhoUtilizador(){
    let proprioUtilizador:Utilizador = this.getproprioUtilizador();

    if (proprioUtilizador) {
      // console.log(JSON.stringify(proprioUtilizador.carrinho))
      return proprioUtilizador.carrinho;
    }
    else return null;
  }//end getCarrinhoUtilizador
  

  // Verifica se existe algum produto na lista do utilizador anónimo
  existemAnonymousLists(){
    if( this.utilizadorAnonimo.carrinho.length > 0 || this.utilizadorAnonimo.wishList.length > 0 ){ 
      return true; 
    }
    else return false;
  }
  

  //copia produtos nas listas de um Utilizador anónimo, caso ele faça login posteriormente e escolha guardar as suas seleções prévias
  copiarAnonymousLists(){

    if (this.utilizadorEstaAutenticado()){

    
      let wishListUserAutenticado:IProdutoCarrinho[] = this.getWishListUtilizador();
      let carrinhoUserAutenticado:IProdutoCarrinho[] = this.getCarrinhoUtilizador();


      //Se a wishlist anónima tem produtos, então copiá-los para a wishlist do user registado
      if (this.utilizadorAnonimo.wishList.length > 0){

        this.utilizadorAnonimo.wishList.forEach( produtoAnonimo => {
          
          let produtoJaExiste:boolean = wishListUserAutenticado.some( produtoAutenticado => {
              if (produtoAutenticado.produtoId == produtoAnonimo.produtoId) return true;
          });

          if (!produtoJaExiste){
            wishListUserAutenticado.push(produtoAnonimo);
          }

        })
        console.log (this.utilizadorAnonimo.wishList)
        console.log (wishListUserAutenticado)
      }

      //Se o carrinho anónimo tem produtos, então copiá-los para o carrinho do user registado
      if (this.utilizadorAnonimo.carrinho.length > 0){

        this.utilizadorAnonimo.carrinho.forEach( produtoAnonimo => {
          
          let produtoJaExiste:boolean = carrinhoUserAutenticado.some( produtoAutenticado => {
              if (produtoAutenticado.produtoId == produtoAnonimo.produtoId) return true;
          });

          if (!produtoJaExiste){
            carrinhoUserAutenticado.push(produtoAnonimo);
          }

        })
        console.log (this.utilizadorAnonimo.carrinho)
        console.log (carrinhoUserAutenticado)
      }

    }

  }

  //Verifica se o utilizador autenticado é administrador ou não
  isUserAdmin(){
    // console.log('loginservice call: o user é admin? ' + this.getproprioUtilizador().admin)
    return ( this.getproprioUtilizador().admin == true );
  }





  
}//end class
