import { Injectable } from '@angular/core';
import { IArrayProperty, IObjectProperty, IProperty, PropertyType } from 'editor';
import { BaseFieldService } from '../base-field.service';
import { CustomFieldType, FieldType, IFormlyField, WrapperType } from '../field.types';
import { IRadioTemplateOptions } from './radio.types';

@Injectable({
	providedIn: 'root',
})
export class RadioService extends BaseFieldService<IRadioTemplateOptions> {

	public getDefaultConfig(customType?: CustomFieldType): IFormlyField<IRadioTemplateOptions> {
		return {
			type: FieldType.RADIO,
			wrappers: [WrapperType.FORM_FIELD],
			templateOptions: {
				label: 'Label',
				placeholder: 'Placeholder',
				description: 'Description',
				required: true,
				options: [
					{ value: 1, label: 'Option 1' },
					{ value: 2, label: 'Option 2' },
					{ value: 3, label: 'Option 3' },
					{ value: 4, label: 'Option 4', disabled: true },
				],
			},
			expressionProperties: {},
		};
	}

	getProperties(): IProperty[] {
		return [
			...this._getSharedProperties(),
            this._getTemplateOptionsProperty(
                [
					{
						name: 'Label',
						key: 'label',
						type: PropertyType.TEXT,
                        isSimple: true,
					},
					{
						name: 'Placeholder',
						key: 'placeholder',
						type: PropertyType.TEXT,
                        isSimple: true,
					},
					{
						name: 'Description',
						key: 'description',
						type: PropertyType.TEXT,
                        isSimple: true,
					},
					{
						name: 'Required',
						key: 'required',
						type: PropertyType.BOOLEAN,
                        isSimple: true,
					},
					{
						name: 'Options',
						key: 'options',
						type: PropertyType.ARRAY,
                        isSimple: true,
						canAdd: true,
						childProperty: {
							type: PropertyType.OBJECT,
							isDeletable: true,
							childProperties: [
								{
                                    name: 'Label',
									key: 'label',
									type: PropertyType.TEXT,
                                    isSimple: true,
								},
								{
                                    name: 'Value',
									key: 'value',
									type: PropertyType.TEXT,
                                    isSimple: true,
								},
								{
                                    name: 'Disabled',
									key: 'disabled',
									type: PropertyType.BOOLEAN,
                                    isSimple: true,
								},
							],
						} as IObjectProperty
					} as IArrayProperty,
                ],
                [WrapperType.FORM_FIELD]
            ),
			this._getWrapperProperty([WrapperType.FORM_FIELD])
		];
	}
}
