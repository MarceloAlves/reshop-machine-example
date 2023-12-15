import {
  Button,
  Center,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useMachine } from '@xstate/react'
import { Layout } from './components/Layout'
import { reshopMachine } from './machines/reshop.machine'
import { useState } from 'react'

type APIData = { network_id: string; order_id: string; order_number: string; skip_wms_cancel?: boolean }
type APIReturn = APIData
type APIError = { errors: Array<{ error_code: string }> }

const reshopMutation = () =>
  useMutation<APIReturn, APIError, APIData>((data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.skip_wms_cancel) {
          resolve(data)
        } else {
          reject({ errors: [{ error_code: 'ERR_WMS_CANCELLATION_FAILED' }] })
        }
      }, 2000)
    })
  })

function App() {
  const [allowForce, setAllowForce] = useState(false)
  const modalControl = useDisclosure()

  return (
    <Layout>
      <Center flexDirection="column" gap={10}>
        <Checkbox value={allowForce} onChange={(e) => setAllowForce(e.target.checked)}>
          Allow force?
        </Checkbox>
        <Button onClick={modalControl.onOpen}>Open</Button>
        {modalControl.isOpen && <ReshopModal {...modalControl} allowForce={allowForce} />}
      </Center>
    </Layout>
  )
}

function ReshopModal({
  allowForce,
  ...modalControl
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  allowForce: boolean
}) {
  const toast = useToast()
  const { mutateAsync } = reshopMutation()

  const [state, send] = useMachine(reshopMachine, {
    devTools: true,
    context: {
      allow_force: allowForce,
    },
    actions: {
      failureToast: () => toast({ status: 'error', title: 'Error!', description: 'Something went wrong' }),
      successToast: (ctx, evt) =>
        toast({
          status: 'success',
          title: 'Success!',
          description: evt.type === 'done.invoke.reshop.attempting_reshop:invocation[0]' ? 'Success' : 'Force success',
        }),
      closeModal: modalControl.onClose,
    },
    services: {
      reshopMutation: (_ctx, event) => {
        return mutateAsync(event.data)
      },
    },
  })

  return (
    <Modal {...modalControl} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>A Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {state.hasTag('show_confirmation') && 'Are you sure you want to reshop?'}
          {state.hasTag('show_force_reshop_confirmation') && 'Something went wrong, force it?'}
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            colorScheme="grey"
            variant="outline"
            onClick={() => send('CANCEL')}
            isDisabled={!state.nextEvents.some((event) => event === 'CANCEL')}
          >
            Cancel
          </Button>

          <Button
            colorScheme="red"
            isLoading={state.matches('attempting_reshop') || state.matches('attempting_force_reshop')}
            loadingText="Reshopping"
            onClick={() => {
              send({
                type: 'CONFIRM',
                data: {
                  network_id: '1',
                  order_id: '1',
                  order_number: '1',
                  skip_wms_cancel: state.matches('waiting_for_force_reshop_confirmation'),
                },
              })
            }}
          >
            {state.matches('waiting_for_confirmation') && 'Confirm'}
            {state.matches('waiting_for_force_reshop_confirmation') && 'Confirm force reshop'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default App
