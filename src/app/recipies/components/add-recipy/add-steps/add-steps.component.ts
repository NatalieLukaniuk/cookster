import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-steps',
  templateUrl: './add-steps.component.html',
  styleUrls: ['./add-steps.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddStepsComponent),
      multi: true,
    },
  ],
})
export class AddStepsComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input()
  index!: number;
  public stepsForm!: FormGroup;
  @Output() stepsFormValid = new EventEmitter<boolean>();

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.stepsForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    this.stepsForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.stepsForm.disable() : this.stepsForm.enable();
  }
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if(this.stepsForm && this.stepsForm.valid){
      this.stepsFormValid.emit(true);
    } else {
      this.stepsFormValid.emit(false)
    }
  }

  ngOnInit() {
    this.stepsForm = new FormGroup({
      id: new FormControl(this.idValue),
      description: new FormControl('', Validators.required),
      timeActive: new FormControl('', Validators.required),
      timePassive: new FormControl('', Validators.required),
    });
    this.stepsForm.valid
  }

  get idValue() {
    return this.index + 1;
  }
}
