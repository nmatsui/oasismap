import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
  Marker,
  LayersControl,
  LayerGroup,
  useMapEvents,
} from 'react-leaflet'
import { LatLngTuple, divIcon } from 'leaflet'
import React, { useState, useEffect, useContext } from 'react'
import 'leaflet/dist/leaflet.css'
import { getIconByType } from '../utils/icon'
import { IconType } from '@/types/icon-type'
import { EntityByEntityId } from '@/types/entityByEntityId'
import { IconButton } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import CurrentPositionIcon from '@mui/icons-material/RadioButtonChecked'
import { renderToString } from 'react-dom/server'
import { DetailModal } from '../happiness/detailModal'
import { Pin } from '@/types/pin'
import { questionTitles } from '@/libs/constants'
import { MePopup } from './mePopup'
import { AllPopup } from './allPopup'
import { MessageType } from '@/types/message-type'
import { messageContext } from '@/contexts/message-context'

// 環境変数の取得に失敗した場合は日本経緯度原点を設定
const defaultLatitude =
  parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_LATITUDE!) || 35.6581064
const defaultLongitude =
  parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_LONGITUDE!) || 139.7413637

const loadEnvAsNumber = (
  variable: string | undefined,
  defaultValue: number
): number => {
  if (!variable) return defaultValue
  const value = parseFloat(variable)
  if (Number.isNaN(value)) return defaultValue
  return value
}

const defaultZoom = loadEnvAsNumber(
  String(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM),
  13
)

type Props = {
  pointEntities: any[]
  surfaceEntities: any[]
  fiware: {
    tenant: string
    servicePath: string
  }
  iconType: IconType
  pinData: any[]
  initialEntityId?: string | null
  entityByEntityId?: EntityByEntityId
  onPopupClose?: () => void
}

const ClosePopup = () => {
  const map = useMap()
  map.closePopup()
  return null
}

const OnPopupClose = ({ onPopupClose }: { onPopupClose: () => void }) => {
  useMapEvents({
    popupclose: () => {
      onPopupClose()
    },
  })
  return null
}

export { questionTitles }

const MapOverlay = ({
  iconType,
  type,
  filteredPins,
  initialPopupPin,
  layerIndex,
  setSelectedPin,
}: {
  iconType: IconType
  type: string
  filteredPins: Pin[]
  initialPopupPin: Pin | undefined
  layerIndex: number
  setSelectedPin: React.Dispatch<React.SetStateAction<Pin | null>>
}) => (
  <LayersControl.Overlay checked name={type}>
    <LayerGroup>
      {filteredPins.map((pin, index) => (
        <Marker
          key={index}
          position={[pin.latitude, pin.longitude]}
          icon={getIconByType(iconType, pin.type, pin.answer)}
          zIndexOffset={-layerIndex}
        >
          {iconType === 'pin' ? (
            <MePopup
              pin={pin}
              initialPopupPin={initialPopupPin}
              setSelectedPin={setSelectedPin}
            />
          ) : (
            <AllPopup pin={pin} />
          )}
        </Marker>
      ))}
    </LayerGroup>
  </LayersControl.Overlay>
)

const Map: React.FC<Props> = ({
  iconType,
  pinData,
  initialEntityId,
  entityByEntityId,
  onPopupClose,
}) => {
  const [center, setCenter] = useState<LatLngTuple | null>(null)
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(
    null
  )
  const [error, setError] = useState<Error | null>(null)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const noticeMessageContext = useContext(messageContext)

  useEffect(() => {
    // geolocation が http に対応していないため固定値を設定
    if (location.protocol === 'http:') {
      setCenter([defaultLatitude, defaultLongitude])
      setCurrentPosition([defaultLatitude, defaultLongitude])
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition: LatLngTuple = [
          position.coords.latitude,
          position.coords.longitude,
        ]
        setCenter((prev) => {
          if (!prev) {
            return newPosition
          }
          return prev
        })
        setCurrentPosition(newPosition)
        setError(null)
      },
      (e) => {
        console.error(e)
        setError(e instanceof Error ? e : new Error(e.message))
        if (e.code === e.PERMISSION_DENIED) {
          noticeMessageContext.showMessage(
            '位置情報機能が無効になっている可能性があります。設定から位置情報機能を有効にしてください。',
            MessageType.Error
          )
        } else {
          noticeMessageContext.showMessage(
            '位置情報の取得に失敗しました。',
            MessageType.Error
          )
        }
        setCurrentPosition(null)
        setCenter(null)
      },
      { enableHighAccuracy: true }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentPositionIconHTML = renderToString(
    <CurrentPositionIcon style={{ fill: 'blue' }} />
  )
  const currentPositionIcon = divIcon({
    html: currentPositionIconHTML,
    className: 'current-position',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const MoveToCurrentPositionButton = () => {
    const map = useMap()
    const moveToCurrentPosition = () => {
      if (currentPosition) {
        map.flyTo(currentPosition, defaultZoom)
      }
    }
    return (
      <IconButton
        style={{
          top: '2%',
          left: '2%',
          width: '35px',
          height: '35px',
          backgroundColor: '#f7f7f7',
          border: '1px solid #ccc',
          zIndex: 1000,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        }}
        onClick={moveToCurrentPosition}
      >
        <MyLocationIcon style={{ color: 'blue' }} />
      </IconButton>
    )
  }
  if (error) {
    console.error('Error: Unable to get current position.', error)
    return null
  }
  if (center === null || currentPosition === null) {
    return <p>Loading...</p>
  }

  const filteredPinsByType = (type: string) =>
    pinData.filter((pin) => pin.type === type)

  let initialEntityUuid: string | undefined = undefined
  if (initialEntityId) {
    initialEntityUuid = entityByEntityId?.[initialEntityId]?.id
  }

  return (
    <>
      <MapContainer
        center={currentPosition}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MoveToCurrentPositionButton />
        <ZoomControl position={'bottomleft'} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          minZoom={5}
        />
        <LayersControl position="topright">
          {Object.keys(questionTitles).map((type, index) => {
            const filteredPins = filteredPinsByType(type)
            return (
              <MapOverlay
                key={type}
                iconType={iconType}
                type={questionTitles[type]}
                layerIndex={index}
                filteredPins={filteredPins}
                initialPopupPin={filteredPins.find(
                  (pin) => pin.id === initialEntityUuid
                )}
                setSelectedPin={setSelectedPin}
              />
            )
          })}
        </LayersControl>
        {!selectedPin && !initialEntityId && <ClosePopup />}
        {onPopupClose && <OnPopupClose onPopupClose={onPopupClose} />}
        {currentPosition && (
          <Marker position={currentPosition} icon={currentPositionIcon}></Marker>
        )}
      </MapContainer>
      <DetailModal data={selectedPin} onClose={() => setSelectedPin(null)} />
    </>
  )
}

export default Map
