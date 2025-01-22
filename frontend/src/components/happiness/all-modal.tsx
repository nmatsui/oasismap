import React, { useState } from 'react'
import { BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts'
import Pagination from '@mui/material/Pagination'
import { Modal, Box } from '@mui/material'
import { graphColors } from '@/theme/color'
import { Pin } from '@/types/pin'
import { YAXIS_WIDTH, questionTitles } from '@/libs/constants'

interface ModalProps {
  data: Pin | null
  onClose: () => void
}

const MEMOS_PER_PAGE = 5

export const AllModal: React.FC<ModalProps> = ({ onClose, data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  let barChartData: { questionTitle: string; value: number }[] = []
  if (data === null) {
    return
  }
  if (data.memos === undefined) {
    return
  }
  barChartData = [
    {
      questionTitle: questionTitles.happiness1,
      value: Math.floor(data.answer1 * 100),
    },
    {
      questionTitle: questionTitles.happiness2,
      value: Math.floor(data.answer2 * 100),
    },
    {
      questionTitle: questionTitles.happiness3,
      value: Math.floor(data.answer3 * 100),
    },
    {
      questionTitle: questionTitles.happiness4,
      value: Math.floor(data.answer4 * 100),
    },
    {
      questionTitle: questionTitles.happiness5,
      value: Math.floor(data.answer5 * 100),
    },
    {
      questionTitle: questionTitles.happiness6,
      value: Math.floor(data.answer6 * 100),
    },
  ]
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
        <BarChart
          data={barChartData}
          layout="vertical"
          barCategoryGap={1}
          margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
          width={325}
          height={200}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} />
          <YAxis
            type="category"
            width={YAXIS_WIDTH}
            axisLine={true}
            tickLine={false}
            dataKey="questionTitle"
            interval={0}
            tick={({ x, y, payload, index }) => {
              return (
                <text
                  x={x - 55}
                  y={y + 5}
                  fill={graphColors[index]}
                  fontSize={12}
                  textAnchor="middle"
                >
                  {payload.value}
                </text>
              )
            }}
          />
          <Bar
            dataKey="value"
            label={({ x, y, index }) => (
              // グラフ内のパーセンテージのデザイン調整部分
              <text x={x + 10} y={y + 17.5} fill="black" fontSize={12}>
                {barChartData[index].value}%
              </text>
            )}
            barSize={30}
            shape={(props: unknown) => {
              let index: number
              if (
                typeof props === 'object' &&
                props !== null &&
                'index' in props
              ) {
                if (typeof props.index === 'number') {
                  index = props.index
                } else {
                  return <></>
                }
              } else {
                return <></>
              }
              return (
                <rect
                  {...props}
                  // 棒グラフ開始位置の調整部分
                  x={YAXIS_WIDTH}
                  fill={graphColors[index]}
                  fillOpacity={0.5}
                />
              )
            }}
          />
        </BarChart>
        {data.memos !== undefined && (
          <>
            <hr style={{ marginTop: '10px' }}></hr>
            <h3 style={{ marginTop: '10px' }}>メモ一覧</h3>
            <div style={{ marginTop: '10px', height: '144px' }}>
              {data.memos
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
