import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslationService } from './translation.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Directive({
    selector: '[appTranslation]'
})
export class TranslationDirective implements OnDestroy {
    private _textPosition: string;
    private textSubscription: Subscription = null;

    constructor(
        private element: ElementRef,
        private translationService: TranslationService) { }

    ngOnDestroy() {
        if (this.textSubscription)
            this.textSubscription.unsubscribe();
    }

    get textPosition(): string {
        return this._textPosition;
    }

    @Input('appTranslation')
    set textPosition(textPosition: string) {
        this._textPosition = textPosition;
        this.setText();
    }

    private setText() {
        if (!this.textPosition.trim()) {
            return;
        }
        if (this.textPosition === '-') {
            this.element.nativeElement.innerText = '-';
        } else {
            if (this.textSubscription) {
                this.textSubscription.unsubscribe();
            }
            this.textSubscription = this.translationService.getText(this.textPosition).subscribe((textValue) => {
                if (textValue.trim())
                    this.element.nativeElement.innerText = textValue;
            });;
        }
    }
}
