import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListagemComponent } from './listagem/listagem.component';
import { AdicionarComponent } from './adicionar/adicionar.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WishlistComponent } from './wishlist/wishlist.component'
import { AccountComponent } from './account/account.component';


//
// Array de routing que define alguns extras, como valores que podem ser lidos através do url e nome de cada página para efeitos de deteção de transições no routing para fazer trigger a animações ligadas a essas respectivas transições.
//

const routes: Routes = [

  { path: 'listagem/:filtrar/:filtroInput', component: ListagemComponent, data: { page: 'lista_three' }},
  { path: 'listagem/:filtrar', component: ListagemComponent, data: { page: 'lista_two' } },
  { path: 'listagem', component: ListagemComponent, data: { page: 'lista' }},
  { path: 'favoritos/:filtrar/:filtroInput', component: WishlistComponent, data: { page: 'favoritos_three' }},
  { path: 'favoritos/:filtrar', component: WishlistComponent, data: { page: 'favoritos_two' } },
  { path: 'favoritos', component: WishlistComponent, data: { page: 'favoritos' }},
  { path: 'carrinho/:filtrar/:filtroInput', component: CarrinhoComponent, data: { page: 'carrinho_three' }},
  { path: 'carrinho/:filtrar', component: CarrinhoComponent, data: { page: 'carrinho_two' } },
  { path: 'carrinho', component: CarrinhoComponent, data: { page: 'carrinho' }},
  { path: 'adicionar', component: AdicionarComponent, data: { page: 'adicionar' } },
  { path: 'login/:registado/:erro', component: LoginComponent, data: { page: 'login_registado' } },
  { path: 'login/:registado', component: LoginComponent, data: { page: 'login_registado' } },
  { path: 'login', component: LoginComponent, data: { page: 'login' } },
  { path: 'registar/:registado/:erro', component: RegisterComponent, data: { page: 'registo_erro' } },
  { path: 'registar/:registado', component: RegisterComponent, data: { page: 'registo_erro' } },
  { path: 'registar', component: RegisterComponent, data: { page: 'registo' } },
  { path: 'conta/:editado', component: AccountComponent, data: { page: 'gerirconta_editado' } },
  { path: 'conta', component: AccountComponent, data: { page: 'gerirconta' } },
  { path: '', component: ListagemComponent, data: { page: 'main' }},
  { path: '**', component: ListagemComponent, data: { page: 'main' }},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
