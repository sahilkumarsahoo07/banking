import React from 'react';
import ReactECharts from 'echarts-for-react';
import useTheme from '../hooks/useTheme';

const DashboardCharts = ({ role }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseTextStyle = {
    color: isDark ? '#64748b' : '#94a3b8',
    fontFamily: 'Outfit, sans-serif',
    fontSize: 10,
    fontWeight: 'bold'
  };

  // Funnel: Admin/Manager
  const getFunnelOption = () => ({
    backgroundColor: 'transparent',
    tooltip: { show: false },
    series: [
      {
        name: 'Conversion',
        type: 'funnel',
        left: '10%',
        top: 10,
        bottom: 10,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '5%',
        maxSize: '100%',
        gap: 5,
        label: { show: true, position: 'inside', color: '#fff', fontSize: 10 },
        itemStyle: { borderColor: 'transparent', borderRadius: 12 },
        data: [
          { value: 100, name: 'Login Done' },
          { value: 80, name: 'Follow up' },
          { value: 60, name: 'Branch Visit' },
          { value: 40, name: 'Disbursement' }
        ]
      }
    ],
    color: ['#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef']
  });

  // Line: Trends
  const getLineOption = () => ({
    backgroundColor: 'transparent',
    grid: { top: 30, right: 10, bottom: 30, left: 30 },
    xAxis: {
      type: 'category',
      data: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: baseTextStyle.color, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
      axisLabel: { color: baseTextStyle.color, fontSize: 10 }
    },
    series: [
      {
        data: [15, 23, 18, 25, 32, 28, 35],
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: '#0ea5e9' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.2)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0)' }
            ]
          }
        }
      }
    ]
  });

  // Pie: Mix
  const getPieOption = () => ({
    backgroundColor: 'transparent',
    tooltip: { show: true },
    legend: { show: false },
    series: [
      {
        name: 'Mix',
        type: 'pie',
        radius: ['50%', '80%'],
        itemStyle: { borderRadius: 8, borderColor: isDark ? '#0f172a' : '#fff', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 45, name: 'Proprietor' },
          { value: 35, name: 'Pvt Ltd' },
          { value: 20, name: 'LLP' }
        ]
      }
    ],
    color: ['#0ea5e9', '#6366f1', '#f59e0b']
  });

  return (
    <div className="w-full h-[220px]">
      {(role === 'admin' || role === 'manager') && <ReactECharts option={getFunnelOption()} style={{ height: '100%', width: '100%' }} />}
      {role === 'sales_rep' && <ReactECharts option={getLineOption()} style={{ height: '100%', width: '100%' }} />}
      {role === 'customer' && <ReactECharts option={getPieOption()} style={{ height: '100%', width: '100%' }} />}
    </div>
  );
};

export default DashboardCharts;
