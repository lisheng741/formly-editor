import { Injectable } from '@angular/core';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { BaseFieldService, IProperty, PropertyType } from '@sesan07/ngx-formly-editor';

import { AppFieldType, AppWrapperType } from '../../../field-services/field.types';

@Injectable({
    providedIn: 'root',
})
export class FormlyGroupService extends BaseFieldService<FormlyFieldProps> {
    public getDefaultField(type: AppFieldType): FormlyFieldConfig {
        return {
            type,
            fieldGroup: [],
        };
    }
    protected _getFieldProperties(type: AppFieldType): IProperty[] {
        return [];
    }

    protected _getWrapperProperties(type: AppFieldType): IProperty[] {
        return [
            {
                name: 'Card Title',
                key: 'props.cardTitle',
                type: PropertyType.TEXT,
            },
        ];
    }

    protected _getWrapperTypes(type: AppFieldType): AppWrapperType[] {
        return [AppWrapperType.CARD];
    }
}
