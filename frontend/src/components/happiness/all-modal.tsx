import React, { useState } from 'react'
import Pagination from '@mui/material/Pagination'
import { Modal, Box } from '@mui/material'
import { Pin } from '@/types/pin'
import { HappinessAllGraph } from './happiness-all-graph'

interface ModalProps {
  data: Pin | null
  onClose: () => void
}

const MEMOS_PER_PAGE = 5

export const AllModal: React.FC<ModalProps> = ({ onClose, data }) => {
  const [currentPage, setCurrentPage] = useState(1)

  if (data === null) {
    return
  }
  if (data.memos === undefined) {
    return
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const pageCount = Math.ceil(data.memos.length / MEMOS_PER_PAGE)

  return (
    <Modal open={!!data} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <HappinessAllGraph data={data} />
        {data.memos !== undefined && (
          <>
            <hr style={{ marginTop: '10px' }}></hr>
            <p style={{ marginTop: '10px', fontSize: '20px' }}>メモ一覧</p>
            <div style={{ marginTop: '10px', height: '144px' }}>
              {data.memos
                .filter(Boolean)
                .slice(
                  (currentPage - 1) * MEMOS_PER_PAGE,
                  currentPage * MEMOS_PER_PAGE
                )
                .map((title: string, index: number) => (
                  <div
                    style={{
                      display: 'flex',
                      marginTop: '2px',
                    }}
                    key={index}
                  >
                    ■
                    <span
                      style={{
                        fontSize: '12px',
                        marginTop: '5px',
                        marginLeft: '2px',
                      }}
                    >
                      {title}
                    </span>
                  </div>
                ))}
            </div>
            <Pagination
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
              }}
              count={pageCount}
              color="primary"
              page={currentPage}
              boundaryCount={pageCount > 4 ? 1 : 0}
              siblingCount={pageCount > 4 ? 0 : 1}
              onChange={handlePageChange}
            />
          </>
        )}
      </Box>
    </Modal>
  )
}
