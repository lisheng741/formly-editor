import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorService } from '../../services/editor-service/editor.service';
import { IEditorFormlyField, IForm } from '../../services/editor-service/editor.types';
import { FileService } from '../../services/file-service/file.service';
import { AddFormDialogComponent } from '../add-form-dialog/add-form-dialog.component';
import { AddFormResponse } from '../add-form-dialog/add-form-dialog.types';
import { ExportFormDialogComponent } from '../export-form-dialog/export-form-dialog.component';
import { ExportJSONRequest, ExportJSONResponse } from '../export-form-dialog/export-json-dialog.types';
import { ImportFormDialogComponent } from '../import-form-dialog/import-form-dialog.component';
import { ImportJSONRequest, ImportJSONResponse } from '../import-form-dialog/import-json-dialog.types';

@Component({
    selector: 'editor-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
    public tabIndex = 0;
    public forms: IForm[] = [];

    private _destroy$: Subject<void> = new Subject();

    constructor(
        private _editorService: EditorService,
        private _dialog: MatDialog,
        private _fileService: FileService
    ) { }

    ngOnInit(): void {
        this._editorService.forms$
            .pipe(takeUntil(this._destroy$))
            .subscribe(forms => this.forms = forms);
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    onAddForm(): void {
        const config: MatDialogConfig = {
            height: 'auto',
            maxWidth: '600px'
        };

        const dialogRef: MatDialogRef<AddFormDialogComponent, AddFormResponse> = this._dialog.open(AddFormDialogComponent, config);

        dialogRef.afterClosed()
            .subscribe(res => {
                if (res) {
                    this._editorService.addNewForm(res.name);
                    // Navigate to new form. Allow some time for tab to load.
                    setTimeout(() => {
                        this.tabIndex = this.forms.length - 1;
                    }, 1000);
                }
            });
    }

    onImportForm(): void {
        const config: MatDialogConfig<ImportJSONRequest> = {
            data: {
                type: 'Form',
                showName: true
            }
        };

        const dialogRef: MatDialogRef<ImportFormDialogComponent, ImportJSONResponse> = this._dialog.open(ImportFormDialogComponent, config);

        dialogRef.afterClosed()
            .subscribe(res => {
                if (res) {
                    this._editorService.importForm(res.name, res.json);
                    // Navigate to new form. Allow some time for tab to load.
                    setTimeout(() => {
                        this.tabIndex = this.forms.length - 1;
                    }, 1000);
                }
            });
    }

    onExportForm(): void {
        const form: IForm = this.forms[this.tabIndex];
        const fieldsClone: IEditorFormlyField[] = cloneDeep(form.fields);
        fieldsClone.forEach(field => this._editorService.cleanField(field, true, true));

        const config: MatDialogConfig<ExportJSONRequest> = {
            data: {
                type: 'Form',
                name: form.name + '.json',
                json: JSON.stringify(fieldsClone, null, 2)
            }
        };

        const dialogRef: MatDialogRef<ExportFormDialogComponent, ExportJSONResponse> = this._dialog.open(ExportFormDialogComponent, config);

        dialogRef.afterClosed()
            .subscribe(res => {
                if (res) {
                    this._fileService.saveFile(res.name, res.json);
                }
            });
    }

    onRemoveForm(index: number): void {
        this._editorService.removeForm(index);
    }

    trackFormById: TrackByFunction<IForm> = (_, form: IForm) => form.id;
}
