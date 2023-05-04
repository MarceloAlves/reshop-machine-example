import { createMachine } from "xstate";

export const reshopMachine = createMachine({
  tsTypes: {} as import("./reshop.machine.typegen").Typegen0,
  id: 'reshop',
  initial: 'waiting_for_confirmation',
  predictableActionArguments: true,
  schema: {
    context: {} as {
      allow_force: boolean
    },
    services: {} as {
      reshopMutation: {
        data: {
          network_id: string;
          order_id: string;
          order_number: string;
          skip_wms_cancel?: boolean
        } | { errors: Array<{ error_code: string }> }
      }
    },
    events: {} as {
      type: 'CONFIRM',
      data: {
        network_id: string;
        order_id: string;
        order_number: string;
        skip_wms_cancel?: boolean
      }
    } | { type: 'CANCEL' } | {
      type: "error.platform.reshop.attempting_reshop:invocation[0]";
      data: { errors: Array<{ error_code: string }> };
    },
    actions: {} as {
      type: 'successToast' | 'failureToast' | 'closeModal'
    }
  },
  context: {
    allow_force: false
  },
  states: {
    waiting_for_confirmation: {
      tags: ['show_confirmation'],
      on: {
        CONFIRM: 'attempting_reshop',
        CANCEL: 'canceled',
      }
    },
    attempting_reshop: {
      tags: ['show_confirmation'],
      invoke: {
        src: 'reshopMutation',
        onDone: {
          target: 'complete'
        },
        onError: [
          {
            target: 'waiting_for_force_reshop_confirmation',
            cond: 'isAllowedToForceReshop'
          }, {
            target: 'complete_with_error'
          }]
      }
    },
    waiting_for_force_reshop_confirmation: {
      tags: ['show_force_reshop_confirmation'],
      on: {
        CONFIRM: 'attempting_force_reshop',
        CANCEL: 'canceled',
      }
    },
    attempting_force_reshop: {
      tags: ['show_force_reshop_confirmation'],
      invoke: {
        src: 'reshopMutation',
        onDone: {
          target: 'complete'
        },
        onError: {
          target: 'complete_with_error'
        }
      }
    },
    complete: {
      entry: ['successToast', 'closeModal'],
      type: 'final'
    },
    complete_with_error: {
      entry: ['failureToast', 'closeModal'],
      type: 'final'
    },
    canceled: {
      entry: ['closeModal'],
      type: 'final'
    }
  }
}, {
  guards: {
    isAllowedToForceReshop: (ctx, event) => {
      return ctx.allow_force && event.data.errors?.some(error => error.error_code === 'ERR_WMS_CANCELLATION_FAILED')
    }
  },
})
