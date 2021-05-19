import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListagemComponent } from './listagem/listagem.component';
import { AdicionarComponent } from './adicionar/adicionar.component';
import { FiltrarComponent } from './filtrar/filtrar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CapFirstLetterStringPipe } from './cap-first-letter-string.pipe';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { HeropageComponent } from './heropage/heropage.component';
import { ItemComponent } from './item/item.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { ModalComponent } from './modal/modal.component';
import { registerLocaleData } from '@angular/common';
import ptPT from '@angular/common/locales/pt-PT';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AccountComponent } from './account/account.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';

registerLocaleData(ptPT, 'pt-PT');
 
@NgModule({
  declarations: [
    AppComponent,
    ListagemComponent,
    AdicionarComponent,
    FiltrarComponent,
    CapFirstLetterStringPipe,
    MainmenuComponent,
    HeropageComponent,
    ItemComponent,
    LoginComponent,
    RegisterComponent,
    CarrinhoComponent,
    ModalComponent,
    WishlistComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
