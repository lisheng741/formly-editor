import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { DndService } from '@ng-dnd/core';
import { Store } from '@ngrx/store';
import { EditorService } from '../editor.service';
import { DropAction, FieldOption, IEditorFieldInfo, IEditorFormlyField } from '../editor.types';
import { isCategoryOption, isTypeOption, trackByFieldId } from '../editor.utils';
import { FieldDragDrop } from '../field-drag-drop/field-drag-drop';
import { getFieldChildren } from '../form/form.utils';
import { selectActiveField } from '../state/state.selectors';
import { IEditorState } from '../state/state.types';

@Component({
    selector: 'editor-field-tree-item',
    templateUrl: './field-tree-item.component.html',
    styleUrls: ['./field-tree-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTreeItemComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public field: IEditorFormlyField;
    @Input() public index: number;
    @Input() public fieldOptions: FieldOption[];
    @Input() public isExpanded = false;
    @Input() public treeLevel = 0;

    @Output() public expandParent: EventEmitter<void> = new EventEmitter();

    public isActiveField$: Observable<boolean>;
    public isExpanded$: Observable<boolean>;
    public childFields: IEditorFormlyField[] = [];
    public fieldInfo: IEditorFieldInfo;

    public dnd: FieldDragDrop;

    trackByFieldId = trackByFieldId;
    isCategoryOption = isCategoryOption;
    isTypeOption = isTypeOption;

    private _destroy$: Subject<void> = new Subject();
    private _isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(this.isExpanded);

    constructor(
        private _editorService: EditorService,
        private _store: Store<IEditorState>,
        private _dndService: DndService,
        private _ngZone: NgZone,
        elementRef: ElementRef<HTMLElement>
    ) {
        this.isExpanded$ = this._isExpanded$.asObservable();

        this.dnd = new FieldDragDrop(DropAction.MOVE, this._editorService, this._dndService, this._ngZone, elementRef);
        this.dnd.hoverPosition$.pipe(takeUntil(this._destroy$)).subscribe(position => {
            if (position === 'center' && !this._isExpanded$.value) {
                this._isExpanded$.next(true);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.field) {
            this.fieldInfo = this.field._info;

            if (this.fieldInfo.childrenConfig) {
                const children = getFieldChildren(this.field);
                this.childFields = Array.isArray(children) ? children : children ? [children] : [];
            }
        }

        if (changes.field || changes.index) {
            this.dnd.setup(this.field, this.index);
        }

        if (changes.isExpanded) {
            this._isExpanded$.next(this.isExpanded);
        }
    }

    ngOnInit(): void {
        this.isActiveField$ = this._store.select(selectActiveField).pipe(
            takeUntil(this._destroy$),
            map(field => this.fieldInfo.fieldId === field?._info.fieldId),
            tap(isActiveField => {
                if (isActiveField) {
                    this.expandParent.emit();
                }
            })
        );
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this.dnd.destroy();
    }

    addField = (type: string) => {
        if (this.fieldInfo.childrenConfig) {
            this._isExpanded$.next(true);
        }
        this._editorService.addField(type, this.fieldInfo.fieldId);
    };

    replaceField = (type: string) => this._editorService.replaceField(type, this.fieldInfo.fieldId);

    onRemove(): void {
        this._editorService.removeField(this.fieldInfo.fieldId, this.fieldInfo.parentFieldId);
    }

    onSelected(): void {
        this._editorService.setActiveField(this.fieldInfo.fieldId);
    }

    onExpandParent(): void {
        this._isExpanded$.next(true);
        this.expandParent.emit();
    }
}
