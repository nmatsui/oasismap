import { Popup } from 'react-leaflet'
import { Box } from '@mui/material'
import { Pin } from '@/types/pin'
import { HappinessAllGraph } from '../happiness/happiness-all-graph'

export const AllPopup = ({
  pin,
  setSelectedPin,
}: {
  pin: Pin
  setSelectedPin: React.Dispatch<React.SetStateAction<Pin | null>>
}) => {
  return (
    <Popup>
      <HappinessAllGraph data={pin} />
      {pin.memos !== undefined && (
        <Box sx={{ textAlign: 'center' }}>
          {pin.memos.join('').length > 10 ? (
            <>
              {pin.memos.join(',').slice(0, 10)}…
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: 'blue',
                  border: 'solid 0px',
                }}
                onClick={() => setSelectedPin(pin)}
              >
                もっと見る
              </button>
            </>
          ) : (
            pin.memos
          )}
        </Box>
      )}
    </Popup>
  )
}
