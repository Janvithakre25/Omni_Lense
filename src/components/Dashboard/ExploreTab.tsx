import React, { useState, useMemo } from 'react';
import { ParsedDataset } from '../../types/dataset';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart2, LineChart as LineIcon, PieChart as PieIcon, ScatterChart as ScatterIcon, Search, Filter, ArrowUpDown } from 'lucide-react';

interface ExploreTabProps {
  dataset: ParsedDataset;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({ dataset }) => {
  const numCols = dataset.columns.filter(c => c.type === 'number');
  const catCols = dataset.columns.filter(c => c.type === 'string' || c.type === 'date');

  // Chart configuration state
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [xAxisKey, setXAxisKey] = useState<string>(catCols[0]?.name || dataset.columns[0]?.name || '');
  const [yAxisKey, setYAxisKey] = useState<string>(numCols[0]?.name || dataset.columns[1]?.name || '');
  
  // Table search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Starbucks palette for charts
  const CHART_COLORS = ['#006241', '#00754A', '#2E5A44', '#6F4E37', '#8B654A', '#A3B899', '#4A7C59', '#3D5A45'];

  // Aggregate / prepare data for charts
  const aggregatedChartData = useMemo(() => {
    if (!xAxisKey || !yAxisKey) return [];

    if (chartType === 'scatter') {
      // Scatter uses raw numeric pairs
      return dataset.data
        .map((r, i) => ({
          x: Number(r[xAxisKey]) || 0,
          y: Number(r[yAxisKey]) || 0,
          id: i,
        }))
        .filter(p => !isNaN(p.x) && !isNaN(p.y))
        .slice(0, 100);
    }

    // Grouping by X-axis
    const map: Record<string, { sum: number; count: number }> = {};
    dataset.data.forEach((row) => {
      const xVal = String(row[xAxisKey] ?? 'Unknown');
      const yVal = Number(row[yAxisKey]);
      if (!isNaN(yVal)) {
        if (!map[xVal]) {
          map[xVal] = { sum: 0, count: 0 };
        }
        map[xVal].sum += yVal;
        map[xVal].count += 1;
      }
    });

    const result = Object.entries(map).map(([key, stats]) => ({
      name: key,
      value: Math.round(stats.sum * 100) / 100,
      average: Math.round((stats.sum / stats.count) * 100) / 100,
      count: stats.count,
    }));

    // If too many categories, take top 12
    if (result.length > 12 && chartType !== 'line') {
      return result.sort((a, b) => b.value - a.value).slice(0, 12);
    }

    return result;
  }, [dataset.data, xAxisKey, yAxisKey, chartType]);

  // Filtered and sorted table data
  const filteredTableData = useMemo(() => {
    let result = [...dataset.data];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          val => val !== null && val !== undefined && String(val).toLowerCase().includes(term)
        )
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [dataset.data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTableData.slice(start, start + rowsPerPage);
  }, [filteredTableData, currentPage]);

  const handleSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colName);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chart Builder Card */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl p-6 sm:p-8 shadow-soft">
        
        {/* Chart Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-cream-dark">
          <div>
            <h3 className="text-xl font-bold text-forest-dark">Visual Data Explorer</h3>
            <p className="text-xs text-mutedGrey mt-1">
              Select your variables and chart type to view comparisons and distributions.
            </p>
          </div>

          {/* Chart Type Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                chartType === 'bar'
                  ? 'bg-forest text-warmWhite shadow-soft'
                  : 'bg-cream/60 text-charcoal hover:bg-cream'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Bar Chart</span>
            </button>

            <button
              onClick={() => setChartType('line')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                chartType === 'line'
                  ? 'bg-forest text-warmWhite shadow-soft'
                  : 'bg-cream/60 text-charcoal hover:bg-cream'
              }`}
            >
              <LineIcon className="w-4 h-4" />
              <span>Line Chart</span>
            </button>

            <button
              onClick={() => setChartType('pie')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                chartType === 'pie'
                  ? 'bg-forest text-warmWhite shadow-soft'
                  : 'bg-cream/60 text-charcoal hover:bg-cream'
              }`}
            >
              <PieIcon className="w-4 h-4" />
              <span>Donut Chart</span>
            </button>

            {numCols.length >= 2 && (
              <button
                onClick={() => setChartType('scatter')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  chartType === 'scatter'
                    ? 'bg-forest text-warmWhite shadow-soft'
                    : 'bg-cream/60 text-charcoal hover:bg-cream'
                }`}
              >
                <ScatterIcon className="w-4 h-4" />
                <span>Scatter Plot</span>
              </button>
            )}
          </div>
        </div>

        {/* Variable Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-cream/40 border border-sage/40">
          <div>
            <label className="block text-xs font-bold text-forest-dark uppercase tracking-wider mb-1.5">
              {chartType === 'scatter' ? 'X-Axis (Numeric Variable)' : 'Category / Group By (X-Axis)'}
            </label>
            <select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
              className="w-full bg-warmWhite border border-sage/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:ring-2 focus:ring-forest focus:outline-none shadow-soft"
            >
              {dataset.columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-dark uppercase tracking-wider mb-1.5">
              Value to Measure (Y-Axis)
            </label>
            <select
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              className="w-full bg-warmWhite border border-sage/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:ring-2 focus:ring-forest focus:outline-none shadow-soft"
            >
              {dataset.columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Rendering Area */}
        <div className="h-80 sm:h-96 w-full pt-4">
          {aggregatedChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-mutedGrey text-sm">
              No calculable data found for the selected variables. Please select another combination.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={aggregatedChartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#66736B"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke="#66736B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFCF7',
                      borderColor: '#D4E4D3',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [Number(val).toLocaleString(), yAxisKey]}
                  />
                  <Bar dataKey="value" fill="#006241" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={aggregatedChartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#66736B"
                    fontSize={11}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke="#66736B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFCF7',
                      borderColor: '#D4E4D3',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#006241" strokeWidth={3} dot={{ fill: '#00754A', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : chartType === 'pie' ? (
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFCF7',
                      borderColor: '#D4E4D3',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Pie
                    data={aggregatedChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {aggregatedChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" />
                  <XAxis type="number" dataKey="x" name={xAxisKey} stroke="#66736B" fontSize={11} />
                  <YAxis type="number" dataKey="y" name={yAxisKey} stroke="#66736B" fontSize={11} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#FFFCF7',
                      borderColor: '#D4E4D3',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Scatter name="Data Points" data={aggregatedChartData} fill="#006241" />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-[11px] text-mutedGrey text-center mt-3">
          Hover over data points to inspect exact calculated values.
        </p>
      </div>

      {/* Interactive Data Records Table */}
      <div className="bg-warmWhite border border-sage/60 rounded-3xl overflow-hidden shadow-soft">
        
        {/* Table Controls Bar */}
        <div className="p-6 border-b border-cream-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-forest-dark">All Recorded Rows</h3>
            <p className="text-xs text-mutedGrey mt-0.5">
              Showing {filteredTableData.length} records matching your filter.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-mutedGrey absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in all fields..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-cream/40 border border-sage/80 rounded-xl text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-cream/40 text-charcoal font-semibold border-b border-sage/40">
              <tr>
                {dataset.columns.map((c) => (
                  <th
                    key={c.name}
                    onClick={() => handleSort(c.name)}
                    className="px-5 py-3.5 whitespace-nowrap cursor-pointer hover:bg-cream/70 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{c.name}</span>
                      <ArrowUpDown className="w-3 h-3 text-mutedGrey" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={dataset.columns.length} className="px-6 py-8 text-center text-mutedGrey">
                    No records match your search filter.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream/20 transition-colors">
                    {dataset.columns.map((c) => (
                      <td key={c.name} className="px-5 py-3 whitespace-nowrap text-charcoal/80">
                        {row[c.name] !== null && row[c.name] !== undefined ? String(row[c.name]) : (
                          <span className="text-mutedGrey italic">empty</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-cream/30 border-t border-sage/40 flex items-center justify-between text-xs text-mutedGrey">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-sage bg-warmWhite disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-sage bg-warmWhite disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
