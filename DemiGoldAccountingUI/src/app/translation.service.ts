import { Injectable } from '@angular/core';
import { TranslationText } from './Model/TranslationText';
import { ClientService } from './client.service';
import { Language } from './Model/Language';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';
import { LANGUAGES } from './constants';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { HttpOptions } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    currentLanguageIdKey = 'CurrentLanguage';
    translationKey = 'translationCache';
    DefaultLanguageId = 1;
    languages: Language[] = LANGUAGES;
    translation: TranslationText = null;    
    private translationObservable: Observable<TranslationText>;
    private notifyAll;

    constructor(private clientService: ClientService) {
        this.translationObservable = new Observable(this.translationSubscriber());
    }

    getLanguages(): Language[] {
        return this.languages;
    }

    getCurrentLanguage(): Language {
        var currentLanguageId: number = parseInt(window.localStorage.getItem(this.currentLanguageIdKey));
        if (!currentLanguageId) {
            window.localStorage.setItem(this.currentLanguageIdKey, this.DefaultLanguageId.toString());
            currentLanguageId = this.DefaultLanguageId;
        }

        HttpOptions.headers = HttpOptions.headers.set("Content-Language", currentLanguageId.toString());

        return this.languages.find(l => l.id === currentLanguageId);
    }

    setLanguage(newLangaugeId: number) {
        window.localStorage.setItem(this.currentLanguageIdKey, newLangaugeId.toString());
        this.getTranslation().subscribe(() => this.notifyAll());
        HttpOptions.headers = HttpOptions.headers.set("Content-Language", newLangaugeId.toString());
    }

    getText(textPosition: string): Observable<string> {
        return this.translationObservable.pipe(
            map(translation => translation.translationTextPositions.find(t => t.textPosition === textPosition).textValue)
        );
    }

    getTextFromCache(textPosition: string): string {
        return this.translation.translationTextPositions.find(t => t.textPosition === textPosition).textValue;
    }

    private getTranslation(): Observable<TranslationText> {
        if (!this.translation) {
            this.translation = JSON.parse(window.sessionStorage.getItem(this.translationKey));
        }
        const currentLanguageId = this.getCurrentLanguage().id;
        if (!this.translation || this.translation.id !== currentLanguageId) {
            return this.clientService.getTranslationTextForLanguage(currentLanguageId)
                .pipe(
                    tap(translation => {
                        window.sessionStorage.setItem(this.translationKey, JSON.stringify(translation || {}));
                        this.translation = translation;
                    }));
        } else {
            return of(this.translation);
        }
    }

    private translationSubscriber() {
        const observers: Subscriber<TranslationText>[] = [];

        function notifyAll() {
            observers.forEach(observer => observer.next(this.translation));
        }

        this.notifyAll = notifyAll;

        return (observer) => {
            observers.push(observer);
            if (observers.length === 1) {
                this.getTranslation().subscribe((translation) => observers.forEach(observer => observer.next(translation)));
            } else if (this.translation) {
                observer.next(this.translation);
            }

            return {
                unsubscribe() {
                    observers.splice(observers.indexOf(observer), 1);
                }
            };
        }
    }
}
