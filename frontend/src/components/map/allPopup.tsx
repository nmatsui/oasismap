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
  if (pin.memos === undefined) {
    return
  }
  const memoArray: any = []
  {
    pin.memos.map((title) => memoArray.push(title.memo))
  }
  return (
    <Popup>
      <HappinessAllGraph data={pin} />
      {pin.memos !== undefined && (
        <Box sx={{ fontWeight: 'bolder' }}>
          {memoArray.filter(Boolean).join('').length > 15 ? (
            <>
              {memoArray.filter(Boolean).join(',').slice(0, 15)}…
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
            memoArray
          )}
        </Box>
      )}
    </Popup>
  )
}
