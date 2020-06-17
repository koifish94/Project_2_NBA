
var chart_n = JSC.chart('chartDiv', { 
  debug: true, 
  type: 'horizontal column', 
  title_label_text: 
    'Average Salary($) by Rating and Conference', 
  yAxis: { 
    scale_type: 'stacked', 
    defaultTick_label_text: 
      '{Math.abs(%Value):a2}'
  }, 
  xAxis: { 
    label_text: 'Rating', 
    crosshair_enabled: true
  }, 
  defaultTooltip_label_text: 
    'Rating %xValue:<br><b>%points</b>', 
  defaultPoint_tooltip: 
    '%icon {Math.abs(%Value)}', 
  legend_template: 
    '%name %icon {Math.abs(%Value)}', 
  series: [ 
    { 
      name: 'Eastern Conference', 
      points: { 
        mapTo: 'x,y', 
        data: [ 
          ['67-71', -1767496], 
          ['72-74', -4861886], 
          ['75-77', -7003909], 
          ['78-80', -11408022], 
          ['81-83', -16295374], 
          ['84-86', -18294906], 
          ['87-89', -28758855], 
          ['90+', -28363109] 
        ] 
      } 
    }, 
    { 
      name: 'Western Conference', 
      points: { 
        mapTo: 'x,y', 
        data: [ 
            ['67-71', 1386646], 
            ['72-74', 3830978], 
            ['75-77', 6061962], 
            ['78-80', 12273128], 
            ['81-83', 16998569], 
            ['84-86', 18414650], 
            ['87-89', 19306689], 
            ['90+', 34627124]  
        ] 
      } 
    } 
  ] 
});