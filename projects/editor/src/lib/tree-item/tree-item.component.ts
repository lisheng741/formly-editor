import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';

@Component({
    selector: 'editor-tree-item',
    templateUrl: './tree-item.component.html',
    styleUrls: ['./tree-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeItemComponent implements OnInit {
    @Input() treeLevel = 0;
    @Input() isExpanded: boolean;
    @Input() isExpandable: boolean;
    @Input() isActive: boolean;
    @Input() hasOptions: boolean;
    @Input() optionsMenu: MatMenuPanel;

    @Output() isExpandedChange: EventEmitter<boolean> = new EventEmitter();

    public treeLevelPadding: number;
    public sideLinePositions: number[];
    public isMouseInside: boolean;

    private readonly _treeIndentation = 18;

    @HostBinding('class.active') get isHeaderActive(): boolean {
        return this.isActive;
    }

    @HostListener('mouseover', ['$event'])
    onMouseOver(event: MouseEvent): void {
        this.isMouseInside = true;
        event.stopPropagation();
    }

    @HostListener('mouseout')
    onMouseOut(): void {
        this.isMouseInside = false;
    }

    @HostListener('click', ['$event'])
    onClicked(event: MouseEvent): void {
        if (this.isActive !== false) {
            this.onToggle(event);
        } else {
            this.isExpanded = true;
            this.isExpandedChange.emit(this.isExpanded);
            event.stopPropagation();
        }
    }

    ngOnInit(): void {
        this.treeLevelPadding = this._treeIndentation * this.treeLevel;
        this.sideLinePositions = [...Array(this.treeLevel).keys()].map(i => (i + 1) * this._treeIndentation);
    }

    onToggle(event: MouseEvent): void {
        this.isExpanded = !this.isExpanded;
        this.isExpandedChange.emit(this.isExpanded);
        event.stopPropagation();
    }
}
