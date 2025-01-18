import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-observable-controller',
    templateUrl: './observable-controller.component.html',
    styleUrls: ['./observable-controller.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class ObservableControllerComponent {
    @Output() addEvent = new EventEmitter<{value: string, delay: number, isError: boolean}>();
    @Output() changeOperator = new EventEmitter<string>();

    inputValue: string = '';
    delay: number = 100;
    isError: boolean = false;
    selectedOperator: string = 'none';
    availableOperators: string[] = ['none', 'map', 'filter', 'delay'];


    onAddEvent() {
        this.addEvent.emit({value: this.inputValue, delay: this.delay, isError: this.isError});
    }
    onDelayChange(delay: any){
        this.delay = parseInt(delay.target.value, 10);
    }
    onInputValueChange(event: any) {
        this.inputValue = event.target.value;
    }
    onErrorClick(){
        this.isError = !this.isError;
    }
    onOperatorChange(event: any){
        this.selectedOperator = event.target.value;
        this.changeOperator.emit(event.target.value)
    }
}