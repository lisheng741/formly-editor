import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';

import { EditorModule } from '@sesan07/ngx-formly-editor';

import { CheckboxService } from '../field-services/checkbox/checkbox.service';
import { AppFieldType } from '../field-services/field.types';
import { FormlyGroupService } from './field-services/formly-group/formly-group.service';
import { InputService } from '../field-services/input/input.service';
import { RadioService } from '../field-services/radio/radio.service';
import { SelectService } from '../field-services/select/select.service';
import { TextareaService } from '../field-services/textarea/textarea.service';
import { BootstrapRoutingModule } from './bootstrap-routing.module';
import { BootstrapComponent } from './bootstrap.component';

@NgModule({
    declarations: [BootstrapComponent],
    imports: [
        CommonModule,
        BootstrapRoutingModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot({
            validationMessages: [{ name: 'required', message: 'This field is required' }],
        }),
        EditorModule.forRoot({
            options: [
                {
                    displayName: 'Input',
                    children: [
                        {
                            displayName: 'Input',
                            type: AppFieldType.INPUT,
                            keyGenerationPrefix: 'inp',
                            service: InputService,
                        },
                        {
                            displayName: 'Number',
                            type: AppFieldType.NUMBER,
                            keyGenerationPrefix: 'num',
                            service: InputService,
                        },
                    ],
                },
                {
                    displayName: 'Checkbox',
                    type: AppFieldType.CHECKBOX,
                    keyGenerationPrefix: 'chk',
                    service: CheckboxService,
                },
                {
                    displayName: 'Radio',
                    type: AppFieldType.RADIO,
                    keyGenerationPrefix: 'rad',
                    service: RadioService,
                },
                {
                    displayName: 'Select',
                    type: AppFieldType.SELECT,
                    keyGenerationPrefix: 'sel',
                    service: SelectService,
                },
                {
                    displayName: 'Textarea',
                    type: AppFieldType.TEXTAREA,
                    keyGenerationPrefix: 'txt',
                    service: TextareaService,
                },
                {
                    displayName: 'Group',
                    type: AppFieldType.FORMLY_GROUP,
                    disableKeyGeneration: true,
                    childrenConfig: {
                        path: 'fieldGroup',
                    },
                    service: FormlyGroupService,
                },
            ],
        }),
    ],
})
export class BootstrapModule {}
