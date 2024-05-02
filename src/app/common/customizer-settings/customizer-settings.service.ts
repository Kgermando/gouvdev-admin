import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomizerSettingsService {

    private isDarkTheme: boolean;
    private isSidebarDarkTheme: boolean;
    private isRightSidebarTheme: boolean;
    private isHideSidebarTheme: boolean;
    private isHeaderDarkTheme: boolean;
    private isCardBorderTheme: boolean;
    private isCardBorderRadiusTheme: boolean; 

    constructor() {
        this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')!);
        this.isSidebarDarkTheme = JSON.parse(localStorage.getItem('isSidebarDarkTheme')!);
        this.isRightSidebarTheme = JSON.parse(localStorage.getItem('isRightSidebarTheme')!);
        this.isHideSidebarTheme = JSON.parse(localStorage.getItem('isHideSidebarTheme')!);
        this.isHeaderDarkTheme = JSON.parse(localStorage.getItem('isHeaderDarkTheme')!);
        this.isCardBorderTheme = JSON.parse(localStorage.getItem('isCardBorderTheme')!);
        this.isCardBorderRadiusTheme = JSON.parse(localStorage.getItem('isCardBorderRadiusTheme')!); 
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    }

    toggleSidebarTheme() {
        this.isSidebarDarkTheme = !this.isSidebarDarkTheme;
        localStorage.setItem('isSidebarDarkTheme', JSON.stringify(this.isSidebarDarkTheme));
    }

    toggleRightSidebarTheme() {
        this.isRightSidebarTheme = !this.isRightSidebarTheme;
        localStorage.setItem('isRightSidebarTheme', JSON.stringify(this.isRightSidebarTheme));
    }

    toggleHideSidebarTheme() {
        this.isHideSidebarTheme = !this.isHideSidebarTheme;
        localStorage.setItem('isHideSidebarTheme', JSON.stringify(this.isHideSidebarTheme));
    }

    toggleHeaderTheme() {
        this.isHeaderDarkTheme = !this.isHeaderDarkTheme;
        localStorage.setItem('isHeaderDarkTheme', JSON.stringify(this.isHeaderDarkTheme));
    }

    toggleCardBorderTheme() {
        this.isCardBorderTheme = !this.isCardBorderTheme;
        localStorage.setItem('isCardBorderTheme', JSON.stringify(this.isCardBorderTheme));
    }

    toggleCardBorderRadiusTheme() {
        this.isCardBorderRadiusTheme = !this.isCardBorderRadiusTheme;
        localStorage.setItem('isCardBorderRadiusTheme', JSON.stringify(this.isCardBorderRadiusTheme));
    }
 

    isDark() {
        return this.isDarkTheme;
    }

    isSidebarDark() {
        return this.isSidebarDarkTheme;
    }

    isRightSidebar() {
        return this.isRightSidebarTheme;
    }

    isHideSidebar() {
        return this.isHideSidebarTheme;
    }

    isHeaderDark() {
        return this.isHeaderDarkTheme;
    }

    isCardBorder() {
        return this.isCardBorderTheme;
    }

    isCardBorderRadius() {
        return this.isCardBorderRadiusTheme;
    } 
    
    private isToggled = new BehaviorSubject<boolean>(false);

    get isToggled$() {
        return this.isToggled.asObservable();
    }

    toggle() {
        this.isToggled.next(!this.isToggled.value);
    }

}