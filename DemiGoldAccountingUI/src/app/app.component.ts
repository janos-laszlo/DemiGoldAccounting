import { Component, OnInit } from '@angular/core';
import { TranslationService } from './translation.service';
import { Language } from './Model/Language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  languages: Language[] = [];
  selectedLanguage: Language = null;

  constructor(private translationService: TranslationService) {
    this.initializeLanguage();
  }

  setLanguage(languageId: number) {
    this.translationService.setLanguage(languageId);
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    this.languages = this.translationService.getLanguages().filter(l => l.id !== this.selectedLanguage.id);
  }

  private initializeLanguage() {
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    this.languages = this.translationService.getLanguages().filter(l => l.id !== this.selectedLanguage.id);
  }
}
