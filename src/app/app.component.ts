import { Component, ViewChild, SimpleChanges, OnChanges, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit } from '@angular/core';
import { transition, trigger, query, style, animate, group, animateChild, state } from '@angular/animations';
import { Router, ActivatedRoute, RouterOutlet} from '@angular/router';


//
// Aqui definem-se algumas transições com Angular animations entre componentes que entram e saiem do dom através do routing
// Também se definem Angular animations para a transição vertical da página hero, esta transição é ativada com scrolling ou click.
//

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('animRoutes', [
      transition('* <=> *', [
        group([
          query(
            ':enter',
            [
              style({
                opacity: 1,
                transform: 'translateX(-120vw) rotate(0)'
              }),
              animate(
                '0.35s cubic-bezier(.71,.08,.47,.96)',
                style({ opacity: 1, transform: 'translateX(0vw) rotate(0)' })
              ),
              animateChild()
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [animate('0.35s', style({ opacity: 0 })), animateChild()],
            { optional: true }
          )
        ])
      ])
    ]),
    trigger('animHero', [
      transition('* <=> *', [
        
        group([
          query(
            ':leave',
            [
              style({
                opacity: 1,
                transform: 'translateY(0vw) rotate(0)'
              }),
              animate(
                '0.75s cubic-bezier(.71,.08,.47,.96)',
                style({ opacity: 1, transform: 'translateY(-120vh) rotate(0)' })
              ),
              animateChild() 
            ],
            { optional: true }
          )
        ])
      ])
    ]),
    trigger('animContent', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(120vw) rotate(0)',
        top: '220vh'
      })),
      transition('* <=> *', [
        group([
          query(
            ':enter',
            [
              style({
                opacity: 1,
                top: '220vw'
              }),
              animate(
                '0.75s cubic-bezier(.71,.08,.47,.96)',
                style({ opacity: 1, top: '0vw' })
              ),
              animateChild()
            ],
            { optional: true }
          )
        ])
      ])
    ])
  ]
})


export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit {
  title = 'Generic store lda';
  esteElemento:object;
  @ViewChild('appOutlet') appOutletPage: RouterOutlet;
  oldAppOutletPage:string = "";
  outletPage:string = "";
  currentUrl: string;
  heroUp:boolean;
  displayHeroVar: boolean;
  heroUp2: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, ){

  // console.log(this.activatedRoute.snapshot.data['page']);
  // console.log(this.activatedRoute.snapshot.firstChild?.data['page']);
  }


  //
  // Aqui fiz muita experimentação com lifecycle hooks para corrigir erros de "value has changed after it was checked" relativos a variáveis que indicam quando o utilizador já carregou no elemento hero para que possa transitar para a página principal.
  // acabei por descobrir que o melhor era detectar algumas mudanças de valor para este caso específico em ngAfterContentChecked pois alguns valores só existem ou só se alteram após a página já existir no dom, pois dependem de interações com o dom. Foi a única forma que arranjei de prevenir erros de valuehaschangedafterithasbeenchecked, se calhar algumas destas situações poderiam ter sido resolvidas com observables, mas como está a funcionar bem, acabei por seguir em frente.
  //
  ngOnInit(): void {
    // console.log(this.activatedRoute.snapshot.firstChild?.data['page']);
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);

    if( this.router.url.trim() == "/" ){ 
     
      this.displayHeroVar = true;
      this.heroUp = false;
      // console.log('ROUTER URL ANTES TRIM, DEPOIS NORMAL')
      // console.log(this.router.url)

    }
    else {
      this.displayHeroVar = false;
      this.heroUp = true;
    }
    
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    

   
    
    // if( this.router.url.trim() == "/"){ 
     
    //   this.displayHeroVar = true;
    // }
    // else {
    //   this.displayHeroVar = false;
    //   this.heroUp=true;
    // }

  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(this.activatedRoute.snapshot.firstChild?.data['page']);
  //   for (const propName in changes) {
  //     if (changes.hasOwnProperty(propName)) {
  //       switch (propName) {
  //         case 'appOutletPage': {
  //           console.log(this.appOutletPage)
  //         }
  //       }
  //     }
  //   }

  //   console.log(this.appOutletPage)
  // }

  
  ngAfterViewChecked() {
  
  
  
  }


  ngAfterContentInit() {
    
  }


  ngAfterContentChecked() {
    this.heroUp = this.heroUp2;


    let newPage:string;
    if (this.appOutletPage) {
      newPage = this.appOutletPage.activatedRouteData['page'] || 'main';
    }
  
    if (newPage != this.oldAppOutletPage)
    { this.outletPage = newPage };
  }

  checkHeroUp(event: boolean){
    // setTimeout(() => {this.heroUp = event;});
    this.heroUp2 = event;
  }

  getPage(outlet: RouterOutlet) {
    // console.log(outlet);
    // Promise.resolve(null).then(() => {return outlet.activatedRouteData['page'] || 'main'});
    // setTimeout(() => { return outlet.activatedRouteData['page'] || 'main';});
    // setTimeout(() => { return outlet.activatedRouteData['page'] || 'main';}, 0);
    
    return outlet.activatedRouteData['page'] || 'main';
  }



  // displayHero(){
  //   if( this.router.url.trim() == "/"){ 
     
  //     this.displayHeroVar = true;
  //   }
  //   else {
  //     // estes setTimeouts() servem apenas aqui para resolver erros de "Expression has changed after it was checked", garantindo que a variável só muda no próximo ciclo da VM (VM turn)
  //     setTimeout(() => {  this.heroUp=true; 
  //     // this.heroUp=true; 
  //     return false;}); 
  //   }

  // }

}
