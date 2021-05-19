import { IMorada, IProdutoCarrinho } from './interfaces';

//
// Classe de Utilizador que ajuda a criar objectos utilizador
// Foi criada para sentir melhor as implicações de escolher uma class ou um interface para este tipo de situações enquando desenvolvia a aplicação
//

export class Utilizador {
    id: number;
    activo: boolean;
    username: string;
    nome: string;
    email: string;
    telefone: string;
    password: string;
    carrinho: IProdutoCarrinho[];
    wishList: IProdutoCarrinho[];
    fotoPerfil: string;
    morada: IMorada;
    tokenId: string;
    admin: boolean;
    
    constructor(id:number = -100, activo: boolean = false, username:string = "", nome:string = "Anónimo", email:string = "", telefone:string = '911111111', password:string = '12345', carrinho: IProdutoCarrinho[] = [], wishList: IProdutoCarrinho[] = [], fotoPerfil:string = '', morada:IMorada = {cidade: '', codigoPostal: '', pais: '', rua: ''}, tokenId:string = null, admin:boolean = false ){

            this.id = id;
            this.activo = activo;
            this.username = username;
            this.nome = nome;
            this.email = email;
            this.telefone = telefone;
            this.password = password;
            this.carrinho = carrinho;
            this.wishList = wishList;
            this.fotoPerfil = fotoPerfil;
            this.morada = morada;
            this.tokenId = tokenId;
            this.admin = admin;
    }

}
    
    
    