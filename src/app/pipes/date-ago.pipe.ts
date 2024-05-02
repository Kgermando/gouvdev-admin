import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    // pure: true
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'Maintenant';
            const intervals: any = {
                'an': 31536000,
                'mois': 2592000,
                'Semaine': 604800,
                'jour': 86400,
                'heure': 3600,
                'minute': 60,
                'seconde': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return  'Il y a ' + counter + ' ' + i; // singular (1 day ago)
                    } else {
                        // return counter + ' ' + i + 's ago'; // plural (2 days ago)
                        return  'Il y a ' + counter + ' ' + i + 's';
                    }
            }
        }
        return value;
    }

}