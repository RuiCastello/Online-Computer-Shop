import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { transition, trigger, query, style, animate, group, animateChild, state, keyframes } from '@angular/animations';

import { startWith, tap, delay } from 'rxjs/operators';

// Hero page com uso de Angular Animations e também CSS
// O logotipo (nome da loja + slogan) têm uma animação criada com Angular animations para dar uma espécie de movimento de escorrega para o meio do ecrã e tentar chamar a atenção do utilizador com este hit rápido "in-your-face" do logotipo, seguido de uma animação essa feita em CSS com iterações infinitas e keyframes para animar um icone svg de carrinho de compras do FontAwesome, escalado para um tamanho razoavelmente grande para servir de elemento de entretenimento e dar um ar mais dinâmico à hero page.

@Component({
  selector: 'app-heropage',
  templateUrl: './heropage.component.html',
  styleUrls: ['./heropage.component.scss'],
  animations: [
    trigger('slideDownUp', [
      // ...
      state('start', style({
        transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
        opacity: 0
      })),
      state('end', style({
        transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
        opacity: 1
      })),
      transition('start => end', [
        animate('.5s', 
        keyframes([
          style({ 
            opacity: 0,
            transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)', 
            animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
            offset: 0
          }),
          style({ 
            opacity: 1,
            transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)', 
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
            offset: 0.6
          }),
          style({ 
            opacity: 1,
            transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)', 
            animationTimingFunction: 'linear',
            offset: 1
          })
        ])
        )
      ]),
      transition('end => start', [
        //animate( duração atraso easing )
        animate('0.5s 0s ease-in-out')
      ]),
    ]),
  ]//end animations
})

export class HeropageComponent implements OnInit {

  // Para enviar a informação para o elemento pai de que deverá ser feita a transição para a loja propriamente dita.
  @Output() heroUpEventEmitter: EventEmitter<boolean> = new EventEmitter(true);
  @Output() heroWrapperEventEmitter: EventEmitter<object> = new EventEmitter(true);
  @Input() title:string;
  animationState: string = "start";
  heroUp: boolean = false;
  
  constructor() { }
  
  ngOnInit(): void {
    
    
  }
  
  //Resquícios de experimentação, com tentativas de resolver problemas de variáveis a mudar o valor a meio de um ciclo do Angular
  ngAfterViewInit() { 
    
    // fazemos isto aqui para garantir que o elemento no dom já existe e daí despoletar a animação. 
    // timeout para prevenir o erro de mudança de valor da variável durante o check
    setTimeout( () => (this.animationState = "end") );
  }
  
  // Para escutar window scroll event - window:scroll
  // Para escutar mousewheel event - wheel
  @HostListener('wheel', ['$event'])
  onWheel() {
    
    if (!this.heroUp) {
      this.heroUp = !this.heroUp;
      this.heroUpEventEmitter.emit(this.heroUp);
    }
  }
  
  toggle()
  {
    this.animationState = "end";
    
  }
  
  toggleHeroWrapper(elementoHtml:ElementRef){
    this.heroUp= !this.heroUp;
    this.heroUpEventEmitter.emit(this.heroUp);
    this.heroWrapperEventEmitter.emit(elementoHtml);
    // console.log(elementoHtml)
  }
}
