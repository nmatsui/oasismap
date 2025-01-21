import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TableSortLabel,
} from '@mui/material'
import {
  CheckCircle,
  KeyboardArrowDown,
  KeyboardArrowUp,
  DeleteForever,
} from '@mui/icons-material'
import LayersIcon from '@mui/icons-material/Layers'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Data } from '@/types/happiness-list-response'
import { timestampToDateTime } from '@/libs/date-converter'
import DeleteConfirmationDialog from '@/components/happiness/delete-confirmation-dialog'
import SwapVertIcon from '@mui/icons-material/SwapVert'

interface ListTableProps {
  listData: Data[]
  deleteListData: (id: string) => void
  isLoaded: boolean
}

interface RowProps {
  row: Data
  openDialog: (row: Data) => void
}

const Row: React.FC<RowProps> = ({ row, openDialog }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false)
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )
  const router = useRouter()

  const open = Boolean(anchorElement)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <>
      <TableRow
        sx={{
          '& > .MuiTableCell-root': {
            px: '0px',
            textAlign: 'center',
            borderBottom: 'unset',
          },
        }}
      >
        <TableCell sx={{ pl: '8px', width: '28px' }}>
          <IconButton
            aria-label={isCollapseOpen ? 'collapse row' : 'expand row'}
            size="small"
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}
            sx={{ px: '0px' }}
          >
            {isCollapseOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.answers?.happiness1 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          {row.answers?.happiness2 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          {row.answers?.happiness3 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          {row.answers?.happiness4 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          {row.answers?.happiness5 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          {row.answers?.happiness6 ? <CheckCircle /> : null}
        </TableCell>
        <TableCell>
          <IconButton onClick={handleClick}>
            <MoreHorizIcon sx={{ color: 'black' }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={8}>
          <Collapse in={isCollapseOpen} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Typography variant="body2" gutterBottom>
                送信日時: {timestampToDateTime(row.timestamp)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                緯度: {row.location?.value.coordinates[0].toString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                経度: {row.location?.value.coordinates[1].toString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                送信住所: {row.location?.place}
              </Typography>
              <Typography variant="body2" gutterBottom>
                メモ: {row.memo}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Menu anchorEl={anchorElement} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            const params = new URLSearchParams()
            params.set('entityId', row.id)
            params.set('timestamp', row.timestamp)
            router.push(`/happiness/me?${params.toString()}`)
          }}
        >
          <ListItemIcon>
            <LayersIcon sx={{ color: 'black' }} />
          </ListItemIcon>
          <ListItemText
            primary="地図に表示"
            secondary="選択した幸福度を地図に表示します"
          />
        </MenuItem>
        <MenuItem onClick={() => openDialog(row)}>
          <ListItemIcon>
            <DeleteForever sx={{ color: 'black' }} />
          </ListItemIcon>
          <ListItemText primary="削除" secondary="選択した幸福度を削除します" />
        </MenuItem>
      </Menu>
    </>
  )
}

const ListTable: React.FC<ListTableProps> = ({
  listData,
  deleteListData,
  isLoaded,
}) => {
  const [selectedData, setSelectedData] = useState<Data | null>(null)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<Key | null>(null)
  const [iconView, setIconView] = useState<boolean>(true)
  type Key =
    | 'happiness1'
    | 'happiness2'
    | 'happiness3'
    | 'happiness4'
    | 'happiness5'
    | 'happiness6'
  function sortedRows(
    order: Order,
    orderBy: Key | null
  ): (a: Data, b: Data) => number {
    return order === 'asc'
      ? (a, b) => descendinComparator(a, b, orderBy)
      : (a, b) => -descendinComparator(a, b, orderBy)
  }
  type Order = 'asc' | 'desc'
  function descendinComparator(a: Data, b: Data, orderBy: Key | null) {
    if (orderBy !== null && b.answers[orderBy] < a.answers[orderBy]) {
      return 1
    }
    if (orderBy !== null && b.answers[orderBy] > a.answers[orderBy]) {
      return -1
    }
    return 0
  }
  const handleRequestSort = (property: Key) => {
    if (order === 'asc') {
      setOrder('desc')
      setOrderBy(null)
      setIconView(true)
      return
    }
    const isAsc = orderBy === property && order === 'desc'
    setOrder(isAsc ? 'asc' : 'desc')
    setOrderBy(property)
    setIconView(false)
  }
  const visibleRows = [...listData].sort(sortedRows(order, orderBy))

  const deleteRowData = () => {
    if (selectedData) {
      deleteListData(selectedData.id)
      setSelectedData(null)
    }
  }

  return (
    <TableContainer
      component={Paper}
      // maxHeightの指定についてはヘッダーの高さ(64px)と親コンポーネントの上下パディング(64px)を差し引く
      sx={{
        maxHeight: 'calc(100vh - 64px - 64px)',
        border: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Table
        stickyHeader
        sx={{ px: '16px', tableLayout: 'fixed', width: '100%' }}
      >
        <TableHead>
          <TableRow
            sx={{
              '& > .MuiTableCell-root': {
                textAlign: 'center',
                overflowWrap: 'break-word',
                lineHeight: '1.2em',
              },
            }}
          >
            <TableCell sx={{ pl: '8px', width: '28px' }} />
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness1')}
                active={orderBy === 'happiness1' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                ワクワク
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness2')}
                active={orderBy === 'happiness2' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                学び
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness3')}
                active={orderBy === 'happiness3' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                ホッとする
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness4')}
                active={orderBy === 'happiness4' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                自分を取り戻せる
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness5')}
                active={orderBy === 'happiness5' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                自慢
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                onClick={() => handleRequestSort('happiness6')}
                active={orderBy === 'happiness6' || iconView}
                direction={order}
                IconComponent={iconView === false ? undefined : SwapVertIcon}
                sx={{
                  flexFlow: { xs: 'column', sm: 'row' },
                  mx: { xs: 0, sm: '4px' },
                }}
              >
                思い出
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ width: '28px' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoaded === true && listData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                データがありません
              </TableCell>
            </TableRow>
          ) : (
            visibleRows.map((row: any) => (
              <Row
                key={row.id}
                row={row}
                openDialog={() => setSelectedData(row)}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteConfirmationDialog
        data={selectedData}
        onClose={() => setSelectedData(null)}
        deleteRowData={deleteRowData}
      />
    </TableContainer>
  )
}

export default ListTable
