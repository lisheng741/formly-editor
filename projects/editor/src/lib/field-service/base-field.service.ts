import { FormlyTemplateOptions } from '@ngx-formly/core';
import { Injectable } from '@angular/core';

import { StylesService } from '../edit-field/styles/styles.service';
import { IProperty, PropertyType } from '../property/property.types';
import { IBaseFormlyField } from '../editor.types';

@Injectable()
export abstract class BaseFieldService<T extends FormlyTemplateOptions> {
    public constructor(private _stylesService: StylesService) {}

    public getProperties(type: string): IProperty[] {
        return [
            {
                name: 'Key',
                key: 'key',
                type: PropertyType.TEXT,
            },
            {
                name: 'Default Value',
                key: 'defaultValue',
                type: PropertyType.TEXT,
                outputRawValue: true,
            },
            {
                name: 'Hide',
                key: 'hide',
                type: PropertyType.BOOLEAN,
            },
            ...this._getFieldTemplateOptions(type),
            // TODO Prevent input of items not in options
            {
                name: 'Wrappers',
                key: 'wrappers',
                type: PropertyType.CHIP_LIST,
                options: this._getWrapperTypes(type),
            },
            ...this._getWrapperTemplateOptions(type),
            {
                name: 'Classes',
                key: 'className',
                type: PropertyType.CHIP_LIST,
                options: this._stylesService.classNames,
                outputString: true,
            },
            {
                name: 'Field Group Classes',
                key: 'fieldGroupClassName',
                type: PropertyType.CHIP_LIST,
                options: this._stylesService.fieldGroupClassNames,
                outputString: true,
            },
            {
                name: 'Expression Properties',
                key: 'expressionProperties',
                type: PropertyType.EXPRESSION_PROPERTIES,
            },
        ];
    }

    public abstract getDefaultConfig(type: string): IBaseFormlyField<T>;

    protected abstract _getFieldTemplateOptions(type: string): IProperty[];
    protected abstract _getWrapperTemplateOptions(type: string): IProperty[];
    protected abstract _getWrapperTypes(type: string): string[];
}
