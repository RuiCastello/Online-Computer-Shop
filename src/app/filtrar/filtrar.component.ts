import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { IProduto } from '../interfaces';


@Component({
  selector: 'app-filtrar',
  templateUrl: './filtrar.component.html',
  styleUrls: ['./filtrar.component.scss']
})

export class FiltrarComponent implements OnInit {
  filtrar:boolean;
  data: DataService;
  filteredList: IProduto[];

  //Output via EventEmitter Para passar a variável (dados de input de procura do utilizador) para o elemento Pai (Página de listagem de produtos)
  @Output() filteredListEventEmitter: EventEmitter<IProduto[]> = new EventEmitter();


  constructor(actRoute: ActivatedRoute, data: DataService) {
    this.filtrar = actRoute.snapshot.params.filtrar;
    // console.log(this.filtrar);
    this.data = data;

   }

  ngOnInit(): void {
  }

  //Recebe o texto de input de procura do utilizador e envia para um método de um serviço de procura que devolve uma lista de elementos onde houve "hits", depois passa essa lista já filtrada para o elemento pai via EventEmitter
  filterList(filtro: string){
    this.filteredList = this.data.procurarLista(filtro.trim());
    // console.log(this.filteredList);
    this.filteredListEventEmitter.emit(this.filteredList);
  }
}
