import { ColumnInfo, Finding, ChatMessage, DataQualityReport } from '../types/dataset';

export function answerDataQuestion(
  question: string,
  data: Record<string, any>[],
  columns: ColumnInfo[],
  findings: Finding[],
  quality: DataQualityReport
): ChatMessage {
  const qLower = question.toLowerCase().trim();
  const numCols = columns.filter(c => c.type === 'number');
  const catCols = columns.filter(c => c.type === 'string' && c.uniqueCount > 1);
  const dateCol = columns.find(c => c.type === 'date' || c.name.toLowerCase().includes('date') || c.name.toLowerCase().includes('day'));

  // 1. "What is happening in my data?" / "Overview" / "Summarize"
  if (
    qLower.includes('happening') ||
    qLower.includes('overview') ||
    qLower.includes('summary') ||
    qLower.includes('summarize') ||
    qLower.includes('tell me about')
  ) {
    const primaryCat = catCols[0];
    const primaryNum = numCols.find(c => c.sum && c.sum > 0) || numCols[0];

    let breakdownText = '';
    let chartConfig = undefined;

    if (primaryCat && primaryNum) {
      const grouped: Record<string, number> = {};
      data.forEach((row) => {
        const cat = String(row[primaryCat.name] || 'Other');
        const val = Number(row[primaryNum.name]) || 0;
        grouped[cat] = (grouped[cat] || 0) + val;
      });

      const chartData = Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value]) => ({
          name,
          value: Math.round(value * 10) / 10,
        }));

      chartConfig = {
        type: 'bar' as const,
        xAxis: 'name',
        yAxis: 'value',
        data: chartData,
        title: `Total ${primaryNum.name} by ${primaryCat.name}`,
      };

      breakdownText = `The most active ${primaryCat.name} is "${chartData[0]?.name}" with a total ${primaryNum.name} of ${chartData[0]?.value.toLocaleString()}.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Your dataset contains **${data.length} rows of information** across **${columns.length} columns**. Overall data cleanliness is rated at **${quality.qualityScore}/100**. ${breakdownText} We discovered ${findings.length} key patterns, including notable concentrations and variations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Calculated from ${data.length} records. Identified ${numCols.length} numerical fields and ${catCols.length} descriptive categories.`,
      chartConfig,
      suggestedFollowUps: [
        'Are there any unusual values?',
        'What should I look at next?',
        findings[0]?.title ? `Tell me more about: ${findings[0].title}` : 'Which category has the highest total?',
      ],
    };
  }

  // 2. "Unusual values" / "Anomalies" / "Outliers"
  if (
    qLower.includes('unusual') ||
    qLower.includes('anomal') ||
    qLower.includes('outlier') ||
    qLower.includes('strange') ||
    qLower.includes('weird') ||
    qLower.includes('unexpected')
  ) {
    if (quality.potentialOutliers.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `We checked your numbers using statistical interquartile range testing and **found no unusual spikes or extreme outliers**. The values stay comfortably within expected ranges.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: `Checked across ${numCols.length} numerical columns. No data points exceeded standard statistical boundaries.`,
        suggestedFollowUps: ['What is happening in my data?', 'What should I look at next?'],
      };
    }

    const outlierSummary = quality.potentialOutliers
      .map(o => `• In **${o.column}**, ${o.rowCount} value(s) stand out, such as ${o.sampleOutliers.join(', ')}.`)
      .join('\n');

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Some values look unusual compared with the rest of your records:\n\n${outlierSummary}\n\nThese numbers are substantially higher or lower than typical entries. They might be high-value orders, special circumstances, or simple typos.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Identified using standard interquartile spread (1.5 × IQR) on numerical fields.`,
      suggestedFollowUps: [
        'Can I clean these unusual values?',
        'What is happening in my data?',
      ],
    };
  }

  // 3. "Which product/category sells the most?" / "Highest" / "Maximum" / "Best" / "Top"
  if (
    qLower.includes('most') ||
    qLower.includes('highest') ||
    qLower.includes('best') ||
    qLower.includes('top') ||
    qLower.includes('maximum') ||
    qLower.includes('largest')
  ) {
    // Find matched category or primary category
    const targetCat = catCols.find(c => qLower.includes(c.name.toLowerCase())) || catCols[0];
    const targetNum = numCols.find(c => qLower.includes(c.name.toLowerCase())) || numCols.find(c => c.sum && c.sum > 0) || numCols[0];

    if (!targetCat || !targetNum) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `To answer which item is the highest, we need both a descriptive column (like product, category, or customer) and a numerical column (like sales, amount, or score). Your dataset doesn't have enough matching columns for this calculation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['What is happening in my data?'],
      };
    }

    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    data.forEach((row) => {
      const key = String(row[targetCat.name] || 'Unknown');
      const val = Number(row[targetNum.name]);
      if (!isNaN(val)) {
        totals[key] = (totals[key] || 0) + val;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `No numeric entries could be calculated for "${targetNum.name}" grouped by "${targetCat.name}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    const topItem = sorted[0];
    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    const topPct = grandTotal > 0 ? Math.round((topItem[1] / grandTotal) * 1000) / 10 : 0;

    const chartData = sorted.slice(0, 6).map(([name, value]) => ({
      name,
      value: Math.round(value * 10) / 10,
    }));

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `**"${topItem[0]}"** ranks highest in ${targetCat.name}, accounting for a total of **${Math.round(topItem[1]).toLocaleString()}** in ${targetNum.name} (${topPct}% of the grand total across all records).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Aggregated ${data.length} records by "${targetCat.name}". "${topItem[0]}" appeared in ${counts[topItem[0]] || 0} rows.`,
      chartConfig: {
        type: 'bar',
        xAxis: 'name',
        yAxis: 'value',
        data: chartData,
        title: `Top ${targetCat.name} by Total ${targetNum.name}`,
      },
      suggestedFollowUps: [
        `How does "${topItem[0]}" compare to the others?`,
        'What should I look at next?',
      ],
    };
  }

  // 4. "Why did sales decrease?" / "Why" questions
  if (qLower.includes('why') || qLower.includes('reason') || qLower.includes('cause')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Your dataset records **what occurred** (such as amounts, timestamps, and categories), but does not record external causal reasons (like weather interruptions, competitor actions, or marketing pauses).\n\n**What we can see from your records:**\n• Look for specific days, products, or channels where numbers dipped.\n• Two things may change together, but that does not necessarily mean one caused the other.\n\nWe recommend filtering by date or category in the **Explore** tab to isolate the exact period of decline.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Observational dataset without controlled causal experimental tags.`,
      suggestedFollowUps: [
        'How did numbers change over time?',
        'What are the most important discoveries here?',
      ],
    };
  }

  // 5. "What should I look at next?" / "Recommendations" / "Suggestions"
  if (
    qLower.includes('next') ||
    qLower.includes('recommend') ||
    qLower.includes('suggest') ||
    qLower.includes('action') ||
    qLower.includes('do now')
  ) {
    const topFinding = findings[0];
    const nextSteps = findings.slice(0, 3).map((f, i) => `${i + 1}. **${f.title}**: ${f.suggestedNextStep}`).join('\n\n');

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Here are 3 practical next steps based directly on your findings:\n\n${nextSteps}\n\nWould you like to examine any of these in detail?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Extracted from ${findings.length} evidence-backed finding cards.`,
      suggestedFollowUps: [
        topFinding ? `Tell me more about ${topFinding.title}` : 'Are there any unusual values?',
        'Download full PDF report',
      ],
    };
  }

  // 6. "Change over time" / "Trends" / "Date"
  if (qLower.includes('time') || qLower.includes('trend') || qLower.includes('date') || qLower.includes('month') || qLower.includes('day')) {
    if (!dateCol || numCols.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `To analyze changes over time, the dataset needs a recognizable date or timeline column. We did not detect a clear date sequence in your columns.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['What is happening in my data?', 'Which category has the highest total?'],
      };
    }

    const primaryNum = numCols.find(c => c.sum && c.sum > 0) || numCols[0];
    const timeMap: Record<string, number> = {};

    data.forEach((row) => {
      const d = String(row[dateCol.name] || '').slice(0, 10);
      const val = Number(row[primaryNum.name]);
      if (d && !isNaN(val)) {
        timeMap[d] = (timeMap[d] || 0) + val;
      }
    });

    const timeSeries = Object.entries(timeMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(0, 15)
      .map(([date, value]) => ({
        date,
        value: Math.round(value * 10) / 10,
      }));

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Here is how **${primaryNum.name}** tracked across **${dateCol.name}**. Over the period shown, there were ${timeSeries.length} recorded points.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidence: `Calculated from ${data.length} records across "${dateCol.name}".`,
      chartConfig: {
        type: 'line',
        xAxis: 'date',
        yAxis: 'value',
        data: timeSeries,
        title: `${primaryNum.name} Over Time`,
      },
      suggestedFollowUps: [
        'Are there any unusual values?',
        'What should I look at next?',
      ],
    };
  }

  // 7. Fallback / General match
  // Check if query matches any column name directly
  const matchedCol = columns.find(c => qLower.includes(c.name.toLowerCase()));
  if (matchedCol) {
    if (matchedCol.type === 'number') {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `For **"${matchedCol.name}"**:\n• Average (Mean): **${matchedCol.mean}**\n• Midpoint (Median): **${matchedCol.median}**\n• Lowest value: **${matchedCol.min}**\n• Highest value: **${matchedCol.max}**\n• Overall sum: **${matchedCol.sum?.toLocaleString()}**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: `Calculated from ${data.length} rows. Missing values: ${matchedCol.missingCount}.`,
        suggestedFollowUps: [
          `Are there any unusual values in ${matchedCol.name}?`,
          'What is happening in my data?',
        ],
      };
    } else {
      const topCategories = matchedCol.categories?.slice(0, 4) || [];
      const catList = topCategories.map(c => `• **${c.name}**: ${c.count} records (${c.percentage}%)`).join('\n');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Column **"${matchedCol.name}"** has **${matchedCol.uniqueCount} distinct values**. Here are the most common:\n\n${catList}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: `Based on frequency counts across ${data.length} rows.`,
        suggestedFollowUps: [
          'What is happening in my data?',
          'What should I look at next?',
        ],
      };
    }
  }

  // Helpful informative fallback
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `I looked through your **${data.length} records** and **${columns.length} columns**. While I couldn't find a direct match for "${question}", here are questions I can readily answer based on your specific fields:\n\n• "What is happening in my data?"\n• "Which ${catCols[0]?.name || 'category'} has the highest ${numCols[0]?.name || 'value'}?"\n• "Are there any unusual values?"\n• "What should I look at next?"`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    evidence: `Columns checked: ${columns.map(c => c.name).slice(0, 6).join(', ')}.`,
    suggestedFollowUps: [
      'What is happening in my data?',
      'Are there any unusual values?',
      'What should I look at next?',
    ],
  };
}
