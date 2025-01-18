import {Component, OnDestroy} from '@angular/core';
import {MarbleDiagramComponent} from "./components/marble-diagram/marble-diagram.component";
import {Observable, Subscriber, Subscription, delay, filter, map} from 'rxjs';
import {ObservableControllerComponent} from "./components/observable-controller/observable-controller.component";

interface EventRecord {
    value: string;
    delay: number;
    isError: boolean
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MarbleDiagramComponent, ObservableControllerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    dynamicObservable!: Observable<string>;
    eventRecords: EventRecord[] = [];
    pipeDescription: string = 'none';


    constructor() {
        this.createObservable();
    }

    createObservable() {
        this.eventRecords.push({value: 'initial', delay: 0, isError: false})
        this.dynamicObservable = new Observable<string>((subscriber: Subscriber<string>) => {
            subscriber.next('initial');
        })
    }
    changeOperator(operator: string){
        if(operator === 'map'){
            this.pipeDescription = "map(value => value + ' mapped')"
        }
        if(operator === 'filter'){
            this.pipeDescription = "filter(value => !value.includes('a'))"
        }
        if(operator === 'delay'){
            this.pipeDescription = "delay(500)"
        }
        if(operator === 'none') {
            this.pipeDescription = 'none'
        }
    }

    addEventToObservable(event: {value: string, delay: number, isError: boolean}) {
        this.eventRecords.push(event);

        this.dynamicObservable = new Observable<string>((subscriber) => {
            let next = (value: string) => subscriber.next(value);
            let error = (err: any) => subscriber.error(err);
            let observable = new Observable<string>((sub) => {
                this.eventRecords.forEach( event => {
                    setTimeout(() => {
                        if(event.isError){
                            error('My Error');
                        } else {
                            next(event.value)
                        }
                    }, event.delay);
                });
            });

            if(this.pipeDescription === "map(value => value + ' mapped')"){
                observable = observable.pipe(map(value => value + ' mapped'))
            }
            if(this.pipeDescription === "filter(value => !value.includes('a'))"){
                observable = observable.pipe(filter(value => !value.includes('a')))
            }
            if(this.pipeDescription === "delay(500)"){
                observable = observable.pipe(delay(500))
            }

            observable.subscribe(subscriber);

        });
    }

    myObservable = new Observable<string>((subscriber: Subscriber<string>) => {
        setTimeout(() => subscriber.next('a'), 100);
        setTimeout(() => subscriber.next('b'), 300);
        setTimeout(() => subscriber.next('c'), 500);
        setTimeout(() => subscriber.complete(), 700);
    });

    myErrorObservable = new Observable<string>((subscriber: Subscriber<string>) => {
        setTimeout(() => subscriber.next('a'), 200);
        setTimeout(() => subscriber.error('My Error'), 400);
        setTimeout(() => subscriber.next('b'), 500);
    })

    testObservable = new Observable<string>((subscriber) => {
        subscriber.next('value 1');
        setTimeout(() => subscriber.next('value 2'), 50);
        setTimeout(() => subscriber.next('value 3'), 150);
        setTimeout(() => subscriber.complete(), 300);
    });

    intervalObservable = new Observable<string>(subscriber => {
        let i = 0;
        const intervalId = setInterval(() => {
            subscriber.next(`interval ${i++}`);
            if (i > 3) {
                clearInterval(intervalId);
                subscriber.complete();
            }
        }, 100)
    });
}

