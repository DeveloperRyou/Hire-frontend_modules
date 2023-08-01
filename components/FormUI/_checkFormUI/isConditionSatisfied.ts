import { Trigger } from 'fe-modules/models/FormUI/FormUICondition';
import { FieldValues, UseFormWatch } from 'react-hook-form';

function isConditionSatisfied(triggers: Array<Trigger>, watch: UseFormWatch<FieldValues>) {
  let satisfied = true;
  triggers.forEach((trigger) => {
    const value = watch(trigger.FormItem_id);
    console.log('value', value);
    switch (trigger.operator) {
      case 'equal':
        if (`${value}` !== trigger.val) {
          satisfied = false;
        }
        break;
      case 'notEqual':
        if (`${value}` === trigger.val) {
          satisfied = false;
        }
        break;
      case 'contains':
        if (!value) {
          satisfied = false;
        } else {
          switch (typeof value) {
            case 'string':
              if (typeof value == 'string') {
                if (value.indexOf(trigger.val as string) < 0) {
                  satisfied = false;
                }
              }
              break;
            case 'object':
              if (!value.includes(trigger.val)) {
                satisfied = false;
              }
              break;
            default:
              satisfied = false;
          }
        }
        break;
      case 'notContains':
        if (value) {
          switch (typeof value) {
            case 'string':
              if (typeof value == 'string') {
                if (value.indexOf(trigger.val as string) >= 0) {
                  satisfied = false;
                }
              }
              break;
            case 'object':
              if (value.includes(trigger.val)) {
                satisfied = false;
              }
              break;
          }
        }
        break;
      case 'greaterThan':
        if (typeof value === 'number' && typeof trigger.val === 'number' && value <= trigger.val) {
          satisfied = false;
        }
        break;
      case 'lessorThan':
        if (typeof value === 'number' && typeof trigger.val === 'number' && value >= trigger.val) {
          satisfied = false;
        }
        break;
      case 'empty':
        if (
          typeof value !== 'boolean' &&
          value &&
          (!['object', 'string'].includes(typeof value) || value.length > 0 || Object.keys(value).length > 0)
        ) {
          satisfied = false;
        } else if (value !== undefined && value !== null) {
          satisfied = false;
        }
        break;
      case 'notEmpty':
        if (
          typeof value !== 'boolean' &&
          !(
            value &&
            (!['object', 'string'].includes(typeof value) || value.length > 0 || Object.keys(value).length > 0)
          )
        ) {
          satisfied = false;
        } else if (value === undefined || value === null) {
          satisfied = false;
        }
        break;
    }
  });
  return satisfied;
}
export default isConditionSatisfied;
