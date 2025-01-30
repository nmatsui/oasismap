import { BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts'
import { Popup } from 'react-leaflet'
import { questionTitles } from '@/libs/constants'
import { graphColors } from '@/theme/color'
import { Pin } from '@/types/pin'

const YAXIS_WIDTH = 125
export const AllPopup = ({ pin }: { pin: Pin }) => {
  const graphData = [
    {
      questionTitle: questionTitles.happiness1,
      value: Math.ceil(pin.answer1 * 100),
    },
    {
      questionTitle: questionTitles.happiness2,
      value: Math.ceil(pin.answer2 * 100),
    },
    {
      questionTitle: questionTitles.happiness3,
      value: Math.ceil(pin.answer3 * 100),
    },
    {
      questionTitle: questionTitles.happiness4,
      value: Math.ceil(pin.answer4 * 100),
    },
    {
      questionTitle: questionTitles.happiness5,
      value: Math.ceil(pin.answer5 * 100),
    },
    {
      questionTitle: questionTitles.happiness6,
      value: Math.ceil(pin.answer6 * 100),
    },
  ]
  return (
    <Popup>
      <BarChart
        data={graphData}
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
              {graphData[index].value}%
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
    </Popup>
  )
}
