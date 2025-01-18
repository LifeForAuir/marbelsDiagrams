import {CommonModule, SlicePipe} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

interface EventRecord {
    time: number;
    type: 'next' | 'error' | 'complete';
    value?: string | any;
}

@Component({
    selector: 'app-marble-diagram',
    standalone: true,
    templateUrl: './marble-diagram.component.html',
    styleUrls: ['./marble-diagram.component.css'],
    imports: [
        SlicePipe,
        CommonModule,
    ]
})
export class MarbleDiagramComponent implements OnChanges, OnDestroy {
    @Input() observable: Observable<string> | undefined;
    @Input() duration: number = 1000;

    eventRecords: EventRecord[] = [];
    subscription: Subscription | null = null;
    isRendering = false;

    hoveredEvent: EventRecord | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['observable'] && this.observable) {
            this.eventRecords = [];
            this.subscription?.unsubscribe();
            this.visualizeObservable();
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private visualizeObservable(): void {
        if(!this.observable) return;

        const startTime = Date.now();

        const handleNext = (value: string) => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'next', value });
        }
        const handleError = (err: any) => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'error', value: err });
        }
        const handleComplete = () => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'complete' });
        }

        this.subscription = this.observable.subscribe({
            next: handleNext,
            error: handleError,
            complete: handleComplete,
        });

        setTimeout(() => {
            this.subscription?.unsubscribe();
        }, this.duration);
    }
    private addEventRecord(record: EventRecord) {
        this.eventRecords.push(record);
        this.isRendering = true;
        setTimeout(() => {
            this.isRendering = false;
        })
    }
    calculateMarkerPosition(eventTime: number): string {
        return `${(eventTime / this.duration) * 100}%`;
    }
    onMarkerHover(event: EventRecord | null) {
        this.hoveredEvent = event;
    }
}
