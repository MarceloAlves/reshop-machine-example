// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'done.invoke.reshop.attempting_force_reshop:invocation[0]': {
      type: 'done.invoke.reshop.attempting_force_reshop:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.reshop.attempting_reshop:invocation[0]': {
      type: 'done.invoke.reshop.attempting_reshop:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'error.platform.reshop.attempting_force_reshop:invocation[0]': {
      type: 'error.platform.reshop.attempting_force_reshop:invocation[0]'
      data: unknown
    }
    'error.platform.reshop.attempting_reshop:invocation[0]': {
      type: 'error.platform.reshop.attempting_reshop:invocation[0]'
      data: unknown
    }
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {
    reshopMutation:
      | 'done.invoke.reshop.attempting_force_reshop:invocation[0]'
      | 'done.invoke.reshop.attempting_reshop:invocation[0]'
  }
  missingImplementations: {
    actions: 'closeModal' | 'failureToast' | 'successToast'
    delays: never
    guards: never
    services: 'reshopMutation'
  }
  eventsCausingActions: {
    closeModal:
      | 'CANCEL'
      | 'done.invoke.reshop.attempting_force_reshop:invocation[0]'
      | 'done.invoke.reshop.attempting_reshop:invocation[0]'
      | 'error.platform.reshop.attempting_force_reshop:invocation[0]'
      | 'error.platform.reshop.attempting_reshop:invocation[0]'
    failureToast:
      | 'error.platform.reshop.attempting_force_reshop:invocation[0]'
      | 'error.platform.reshop.attempting_reshop:invocation[0]'
    successToast:
      | 'done.invoke.reshop.attempting_force_reshop:invocation[0]'
      | 'done.invoke.reshop.attempting_reshop:invocation[0]'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {
    isAllowedToForceReshop: 'error.platform.reshop.attempting_reshop:invocation[0]'
  }
  eventsCausingServices: {
    reshopMutation: 'CONFIRM'
  }
  matchesStates:
    | 'attempting_force_reshop'
    | 'attempting_reshop'
    | 'canceled'
    | 'complete'
    | 'complete_with_error'
    | 'waiting_for_confirmation'
    | 'waiting_for_force_reshop_confirmation'
  tags: 'show_confirmation' | 'show_force_reshop_confirmation'
}
