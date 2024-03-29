import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, UntypedFormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { GetUkrIngredientsGroup, IngredientsGroup } from 'src/app/recipies/models/ingredient.interface';
import { PreparationStep } from 'src/app/recipies/models/preparationStep.interface';

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.scss'],

})
export class AddStepComponent implements OnInit, OnChanges {
  @Input()
  index!: number;
  public stepsForm!: UntypedFormGroup;
  @Input() isSplitToGroups: boolean = false;
  @Input() groupOptions: IngredientsGroup[] = []
  @Output() addNewStep: EventEmitter<PreparationStep> = new EventEmitter<PreparationStep>()
  // @Output() stepsFormValid = new EventEmitter<boolean>();

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  // public onTouched: () => void = () => { };

  // writeValue(val: any): void {
  //   val && this.stepsForm.setValue(val, { emitEvent: false });
  // }
  // registerOnChange(fn: any): void {
  //   this.stepsForm.valueChanges.subscribe(fn);
  // }
  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }
  // setDisabledState?(isDisabled: boolean): void {
  //   isDisabled ? this.stepsForm.disable() : this.stepsForm.enable();
  // }
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.stepsForm && this.stepsForm.valid) {
    //   this.stepsFormValid.emit(true);
    // } else {
    //   this.stepsFormValid.emit(false)
    // }

    if(this.isSplitToGroups && this.stepsForm){
      this.stepsForm.addControl('group', new UntypedFormControl('', Validators.required))
    }
  }

  ngOnInit() {
    if (!this.isSplitToGroups) {
      this.stepsForm = new UntypedFormGroup({
        id: new UntypedFormControl(this.idValue),
        description: new UntypedFormControl('', Validators.required),
        timeActive: new UntypedFormControl('', Validators.required),
        timePassive: new UntypedFormControl('', Validators.required),
      });
    } else {
      this.stepsForm = new UntypedFormGroup({
        id: new UntypedFormControl(this.idValue),
        description: new UntypedFormControl('', Validators.required),
        timeActive: new UntypedFormControl('', Validators.required),
        timePassive: new UntypedFormControl('', Validators.required),
        group: new UntypedFormControl('', Validators.required)
      });
    }

    this.stepsForm.valid
  }

  get idValue() {
    return this.index + 1;
  }

  get stepGroupOptions() {
    return this.groupOptions;
  }

  addStep(){
this.addNewStep.emit(this.stepsForm.value)
  }

  resetForm(){
    if (!this.isSplitToGroups) {
      this.stepsForm = new UntypedFormGroup({
        id: new UntypedFormControl(this.idValue),
        description: new UntypedFormControl('', Validators.required),
        timeActive: new UntypedFormControl('', Validators.required),
        timePassive: new UntypedFormControl('', Validators.required),
      });
    } else {
      this.stepsForm = new UntypedFormGroup({
        id: new UntypedFormControl(this.idValue),
        description: new UntypedFormControl('', Validators.required),
        timeActive: new UntypedFormControl('', Validators.required),
        timePassive: new UntypedFormControl('', Validators.required),
        group: new UntypedFormControl('', Validators.required)
      });
    }
  }
}
