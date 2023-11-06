import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appRedText]',
})
export class RedTextDirective implements OnInit {
  @Input() redText: boolean; // Input property to control text color

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.redText) {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
    }
  }
}
