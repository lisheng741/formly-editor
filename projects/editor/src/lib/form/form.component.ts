import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { cloneDeep } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { EditorService } from '../editor.service';
import { FieldOption, IEditorFormlyField, IForm } from '../editor.types';
import { cleanField } from './form.utils';
import { isCategoryOption, isTypeOption, trackByFieldId } from '../editor.utils';
import { selectActiveForm } from '../state/state.selectors';
import { Store } from '@ngrx/store';
import { IEditorState } from '../state/state.types';

@Component({
    selector: 'editor-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, OnDestroy {
    @Input() form: IForm;

    @Output() duplicateForm: EventEmitter<void> = new EventEmitter();
    @Output() exportForm: EventEmitter<void> = new EventEmitter();
    @Output() toggleSidebars: EventEmitter<void> = new EventEmitter();

    public toolbarTabIndex: 0 | 1 = 0;
    public fieldOptions: FieldOption[];

    public formFields$: Observable<IEditorFormlyField[]>;
    public model$: Observable<Record<string, any>>;
    public formFieldsJSON: string;
    public formGroup: UntypedFormGroup = new UntypedFormGroup({});
    public options: FormlyFormOptions = {};

    trackByFieldId = trackByFieldId;
    isCategoryOption = isCategoryOption;
    isTypeOption = isTypeOption;

    private _destroy$: Subject<void> = new Subject();
    private _cachedFields: IEditorFormlyField[] = [];
    private _cachedModel: Record<string, any> = {};

    private readonly _debounceTime: number = 100;

    constructor(private _editorService: EditorService, private _store: Store<IEditorState>) {}

    public ngOnInit(): void {
        this.fieldOptions = this._editorService.fieldOptions;

        const activeForm$ = this._store.select(selectActiveForm).pipe(
            takeUntil(this._destroy$),
            filter(form => form && form.id === this.form.id),
            shareReplay()
        );
        this.formFields$ = activeForm$.pipe(
            filter(form => form.fields !== this._cachedFields),
            debounceTime(this._debounceTime),
            tap(form => {
                this._cachedFields = form.fields;
                this.formGroup = new UntypedFormGroup({});
                this.options = {};

                let fieldsClone: IEditorFormlyField[] = cloneDeep(form.fields);
                fieldsClone.forEach(field => cleanField(field, true, true));
                this.formFieldsJSON = JSON.stringify(fieldsClone, null, 2);

                fieldsClone = this._editorService.onDisplayFields(fieldsClone, this._cachedModel);
            }),
            map(form => cloneDeep(form.fields))
        );

        this.model$ = activeForm$.pipe(
            map(form => {
                this._cachedModel = cloneDeep(form.model);
                return this._cachedModel;
            })
        );
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    onEditModeChanged(isEditMode: boolean): void {
        this._editorService.setEditMode(this.form.id, isEditMode);
    }

    onAddField(type: string): void {
        this._editorService.addField(type);
    }

    onFormModelChanged(model: Record<string, any>): void {
        this._editorService.setActiveModel(model);
    }

    onResetModel(): void {
        this.options.resetModel({});
    }
}
