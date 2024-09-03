import { useState, useEffect } from 'react';

import axios from 'axios';
import Chart from 'react-google-charts';
import Title from '../title';
import Loader from '../loader';
import style from './chart.module.scss';
import Icon from '../icon';

export default function ChartCustom({ headers, body, id, loading, cloneHeight, title, isStacked, type, api, width, height, className, chartArea, pieHole, series, fontSize, colors, legend, hAxis, vAxis, curveType, ...options  }) {
    // ESTADOS
    const [data, setData] = useState([]);
    const [loadingAux, setLoadingAux] = useState(true);
    const [chartEmpty, setChartEmpty] = useState(false);
    
    // GET DATA
    function get_data() {
        setChartEmpty(false);
        
        let body_content;

        if(Array.isArray(body?.content)){
            body_content = body?.content;
        }else{
            body_content = body?.content.split(',');
        }

        if (api?.url) {
            axios({
                url: api?.url,
                params: api?.params
            }).then((response) => {
                if (response.data) {
                    let chart_aux = [];
                    chart_aux.push(headers);
                    const arr = (api?.level ? response?.data?.data[0] : response.data) ? (api?.level ? response?.data?.data[0] : response.data) : []
                    arr.map((item, i) => {
                        let body_aux = [];

                        if (type === 'AreaCharts') {
                            if (body_content[0]) {
                                body_aux.push(body_content[0]);
                            }

                            if (item[body_content[1]] || item[body_content[1]] === 0) {
                                body_aux.push(item[body_content[1]]);
                            }

                            if (item[body_content[2]] || item[body_content[2]] === 0) {
                                body_aux.push(item[body_content[2]]);
                            }

                            if (item[body_content[3]] || item[body_content[3]] === 0) {
                                body_aux.push(item[body_content[3]]);
                            }

                            if (item[body_content[4]] || item[body_content[4]] === 0) {
                                body_aux.push(item[body_content[4]]);
                            }

                            if (item[body_content[5]] || item[body_content[5]] === 0) {
                                body_aux.push(item[body_content[5]]);
                            }

                            chart_aux.push(body_aux);
                        } else if (type === 'AreaChart' || type === 'ComboChart' || type === 'LineChart') {
                            body_aux.push(headers);

                            if (body_content[0]) {
                                body_content.map((item, i) => {
                                    body_aux.push(item);
                                });
                            }

                            chart_aux = body_aux;
                        } else {
                            if (body?.type === 'custom') {
                                body_aux.push(headers);

                                if (body_content[0]) {
                                    body_aux.push([body_content[0][0], item[body_content[0][1]]]);
                                }

                                if (body_content[1]) {
                                    body_aux.push([body_content[1][0], item[body_content[1][1]]]);
                                }

                                if (body_content[2]) {
                                    body_aux.push([body_content[2][0], item[body_content[2][1]]]);
                                }

                                chart_aux = body_aux;
                            } else {
                                if (item[body_content[0]] || item[body_content[0]] === 0) {
                                    body_aux.push(item[body_content[0]]);
                                }

                                if (item[body_content[1]] || item[body_content[1]] === 0) {
                                    body_aux.push(item[body_content[1]]);
                                }

                                chart_aux.push(body_aux);
                            }
                        }
                    });

                    if(response?.data.length === 0){
                        setChartEmpty(true);
                    }
                    setData(chart_aux);
                    setLoadingAux(false);
                }
            });
        } else {
            let chart_aux = [];
            let body_aux = [];

            if(headers.length > 0){
              chart_aux.push(headers);
            }

            if (type === 'AreaChart' || type === 'ComboChart' || type === 'LineChart' || type === 'PieChart' || type === 'ColumnChart') {
                if(headers.length > 0){
                  body_aux.push(headers);
                }

                if (body_content[0]) {
                  body_content.map((item, i) => {
                    body_aux.push(item);
                  });
                }

                chart_aux = body_aux;
            }
            
            if (body_aux.length === 0 || chart_aux.length < 1 || body_content.length ===0) {
              setChartEmpty(true);
            }
            
            setData(chart_aux);
        }
    }

    // SEGUNDA CHAMADA AO REALIZAR ALGUM FILTRO
    useEffect(() => {
        if(api?.url){
            setLoadingAux(true);
        }

        get_data();
    }, [JSON.stringify(api?.params), JSON.stringify(body?.content)]); // PASSAR UM OBJETO COMO DEPENDÊNCIA ESTAVA CAUSANDO MÚLTIPLAS CHAMADAS

    // REMOVE LOADING
    useEffect(() => {
        setLoadingAux(loading);
    }, [loading]);

    let area_width_aux;
    let area_height_aux;
    let area_top_aux;
    let area_left_aux;
    let height_aux;
    let legend_position_aux = 'bottom';
    let curve_type_aux = null

    if (height) {
        height_aux = height - 30;
    } else {
        height_aux = 400 - 30;
    }

    if(chartArea){
      area_width_aux = chartArea?.width;
      area_height_aux = chartArea?.height;
      area_top_aux = chartArea?.top;
      area_left_aux = chartArea?.left;
    }else{
      if (type === 'AreaChart') {
          area_width_aux = '92%';
          area_height_aux = '40%';
          area_top_aux = '10%';
          area_left_aux = '5%';
      } else if (type === 'ComboChart') {
          area_width_aux = '97%';
          area_height_aux = '45%';
          area_top_aux = '12%';
          area_left_aux = '3%';
          height_aux = height - 80;
      } else if (type === 'ColumnChart') {
        area_width_aux = '95%';
        area_height_aux = '60%';
        area_top_aux = '8%';
        area_left_aux = '5%';
        legend_position_aux = 'none';
      } else if(type === 'LineChart') {
          area_width_aux = '92%';
          area_height_aux = '50%';
          area_top_aux = '10%';
          area_left_aux = '6%';
          height_aux = height - 80;

          if(curveType !== false){
              curve_type_aux = 'function';
          }
      } else {
          if(legend?.position === 'left' || legend?.position === 'right'){
              area_width_aux = '90%';
              area_height_aux = '80%';
              area_top_aux = '0%';
              area_left_aux = '5%';
          }else{
              area_width_aux = '70%';
              area_height_aux = '55%';
              area_top_aux = '5%';
              area_left_aux = '15%';
          }
      }
    }

    if(legend){
        if(legend.position){
            legend_position_aux = legend.position;
        }
    }

    return (
      <>
        <div
          id={"chart_" + id}
          className={style.chart + " " + className}
          style={{ height: height_aux ? height_aux : 400 }}
          data-chart={true}
        >
          {title ? <Title>{title}</Title> : ""}

          {loadingAux ? (
            <div className={style.loader}>
              <Loader />
            </div>
          ) : (
            ""
          )}

          {chartEmpty ? (
            <div className={style.empty}>
              <div>
                <Icon type="alert" readonly title={false} />
                <p className="mb-0">Nenhum dado disponível</p>
              </div>
            </div>
          ) : data.length > 0 || (api === false && loading === false) ? (
            <Chart
              chartType={type ? type : "PieChart"}
              data={data}
              width="100%"
              chartLanguage='pt'
              height={height_aux}
              options={{
                
                legend: {
                  position: legend_position_aux,
                  alignment: "center",
                  bottom: 50,
                  textStyle: {
                    fontSize: (legend?.fontSize ? legend?.fontSize : 14),
                    color: '#898e94'
                  },
                },
                hAxis: {
                  ...hAxis,
                  textStyle: {
                    fontSize: (hAxis?.fontSize ? hAxis?.fontSize : 14),
                    color: '#898e94'
                  },
                },
                vAxis: {
                  ...vAxis,
                  textStyle: {
                    fontSize: (vAxis?.fontSize ? vAxis?.fontSize : 14),
                    color: '#898e94'
                  },
                },
                pieHole: pieHole ? pieHole : undefined,
                chartArea: {
                  width: area_width_aux,
                  height: area_height_aux,
                  left: area_left_aux,
                  top: area_top_aux,
                },
                fontName: "Roboto",
                fontSize,
                seriesType: type === "ComboChart" || type === 'ColumnChart' ? "bars" : null,
                curveType: curve_type_aux,
                series: series ? series : undefined,
                colors: colors ? colors : undefined,
                pointSize: type === "ComboChart" || type === 'ColumnChart' ? 5 : undefined,
                // annotationText: {
                //     displayAnnotations: false,
                // },
                isStacked: isStacked ? true : false,
                annotations: {
                  displayAnnotations: false,
                  textStyle: {
                    fontSize: 12,
                    bold: true,
                    color: "#898e94",
                    auraColor: "none",
                    // slantedText: true,
                    // slantedTextAngle: 90
                  },
                },
                //sliceVisibilityThreshold: 0
                ...options
              }}
            />
          ) : (
            ""
          )}
        </div>
      </>
    );
}
