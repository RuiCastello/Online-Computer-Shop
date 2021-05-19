import { Pipe, PipeTransform } from '@angular/core';

//
// Aqui criei um pipe apenas para aprender a fazê-lo, e aproveitei para criar um que transforme uma string qualquer onde apenas a primeira letra da primeira palavra tem letra maiúscula, isto depois foi usado em alguns componentes da app
//

@Pipe({
  name: 'capFirstLetterString'
})
export class CapFirstLetterStringPipe implements PipeTransform {
  
  transform(value: (number | string), ...args: unknown[]): unknown {
    if (value){
      value = value.toString();
      let wordArray = [];
      wordArray = value.trim().split(' ');
      
      let capitalizedArray:any[] = wordArray.map((element, indexOri) => {
        
        let letterArray = element.split('');
        
        let newLetterArray:[] = letterArray.map((letter:string, index:number) =>{
          if (index == 0 && indexOri == 0) letter = letter.toUpperCase();
          else letter = letter.toLowerCase();
          return letter;
        });
        
        let joinedLetters:any[] = [];
        joinedLetters.push(newLetterArray.join(''));
        // console.log(joinedLetters);
        return joinedLetters;
        
      })
      
      value = capitalizedArray.join(' ');
      
      return value;
    }
    else return "";
  }
  
}
