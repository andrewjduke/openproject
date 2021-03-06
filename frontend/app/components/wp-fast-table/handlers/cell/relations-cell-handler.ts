import {InputState} from 'reactivestates';
import {debugLog} from '../../../../helpers/debug_output';
import {$injectFields, injectorBridge} from '../../../angular/angular-injector-bridge.functions';
import {States} from '../../../states.service';
import {TableRowEditContext} from '../../../wp-edit-form/table-row-edit-context';
import {WorkPackageEditForm} from '../../../wp-edit-form/work-package-edit-form';
import {cellClassName, readOnlyClassName} from '../../builders/cell-builder';
import {rowClassName} from '../../builders/rows/single-row-builder';
import {WorkPackageTable} from '../../wp-fast-table';
import {ClickOrEnterHandler} from '../click-or-enter-handler';
import {TableEventHandler} from '../table-handler-registry';
import {
  relationCellIndicatorClassName,
  relationCellTdClassName
} from '../../builders/relation-cell-builder';
import {WorkPackageTableRelationColumnsService} from '../../state/wp-table-relation-columns.service';

export class RelationsCellHandler extends ClickOrEnterHandler implements TableEventHandler {
  // Injections
  public wpTableRelationColumns:WorkPackageTableRelationColumnsService;

  public get EVENT() {
    return 'click.table.relationsCell, keydown.table.relationsCell';
  }

  public get SELECTOR() {
    return `.${relationCellIndicatorClassName}`;
  }

  public eventScope(table:WorkPackageTable) {
    return jQuery(table.container);
  }

  constructor(table:WorkPackageTable) {
    super();
    $injectFields(this, 'wpTableRelationColumns');
  }

  protected processEvent(table:WorkPackageTable, evt:JQueryEventObject):boolean {
    debugLog('Handled click on relation cell: ', evt.target);
    evt.preventDefault();

    // Locate the relation td
    const td = jQuery(evt.target).closest(`.${relationCellTdClassName}`);
    const columnId = td.data('columnId');

    // Locate the row
    const rowElement = jQuery(evt.target).closest(`.${rowClassName}`);
    const workPackageId = rowElement.data('workPackageId');

    // Get any existing edit state for this work package
    let state = this.wpTableRelationColumns.current;

    // If currently expanded
    if (state.getExpandFor(workPackageId) === columnId) {
      this.wpTableRelationColumns.collapse(workPackageId);
    } else {
      this.wpTableRelationColumns.expandFor(workPackageId, columnId);
    }

    return false;
  }
}
