import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPriceFormat]',
  standalone: true,
})
export class PriceFormatDirective implements OnInit {
  constructor(private elementRef: ElementRef, private control: NgControl) {}

  ngOnInit() {
    console.log('Directive initialized with value:', this.control.value);
    this.formatInput(this.control.value); // Format initial value if any
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.formatInput(value);
  }

  private formatInput(value: string) {
    const formattedValue = value.replace(/[^\d]/g, '');

    const numberLenght = formattedValue.length;
    if (numberLenght < 3) {
      this.elementRef.nativeElement.value = formattedValue;
      return;
    }

    const firstPart = formattedValue.slice(0, -2);
    const secondPart = formattedValue.slice(-2);

    this.elementRef.nativeElement.value = `${firstPart}.${secondPart}`;
  }
}
