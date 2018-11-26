import _ from 'lodash';
import React from 'react';
import { Page, Panel, Select, Tooltip, UnstyledLink } from '@sparkpost/matchbox';
import {
  ArrowDropDown,
  ArrowDropUp,
  Equalizer,
  FileDownload,
  InfoOutline,
  ShowChart
} from '@sparkpost/matchbox-icons';
import * as Recharts from 'recharts';
import { TableCollection } from 'src/components/collection';
import styles from './HealthScorePanel.module.scss';

import healthScores from '../data/healthScores';
const data = healthScores(10);

class HealthScorePanel extends React.Component {
  state = {
    chartType: 'spark'
  }

  render() {
    return (
      <Panel
        title={(
          <React.Fragment>
            Health Score Summary {
              <Tooltip
                content={(
                  <React.Fragment>
                    <strong>Health Score</strong> is a predictive indicator of potential issues that
                    could negatively impact your reputation ... For more details on this composite
                    score please <UnstyledLink>check out the knowledge base.</UnstyledLink>
                  </React.Fragment>
                )}
              >
                <InfoOutline />
              </Tooltip>
            }
          </React.Fragment>
        )}
        actions={[
          {
            Component: () => (
              <div className={styles.PanelAction}>
                Select view
                <ShowChart size={20} onClick={() => this.setState({ chartType: 'spark' })} />
                <Equalizer size={20} onClick={() => this.setState({ chartType: 'bar' })} />
              </div>
            ),
            to: '/' // ignore
          },
          {
            Component: () => (
              <div className={styles.PanelAction}>
                Download
                <FileDownload size={20} />
              </div>
            ),
            to: '/' // ignore
          }
        ]}
      >
        <div className={styles.HealthScoresLines}>
          <TableCollection
            columns={[
              { label: 'Sending Domains', width: '20%' },
              { label: 'Health Scores', width: '60%' },
              { label: 'Current', width: '10%' },
              { label: '% Change', width: '10%' }
            ]}
            getRowData={({ item, data, percentChange }) => [
              //
              item,

              //
              <Recharts.ResponsiveContainer height={50} width="100%">
                <Recharts.LineChart data={data}>
                  <Recharts.Line
                    dataKey="value"
                    dot={(props) => {
                      const index = data.findIndex((d) => d.date === props.payload.date);
                      const prevValue = _.get(data, `[${index - 1}].value`);
                      let fill = 'grey';

                      if (prevValue && prevValue !== props.payload.value) {
                        if (props.payload.value - prevValue > 0) {
                          fill = 'green';
                        } else {
                          fill = 'red';
                        }
                      }

                      // Example to only show the current dot
                      // if (props.payload.date === data[data.length - 1].date) {
                      //   return <Recharts.Dot {...props} />;
                      // }
                      //
                      // return null;

                      return <Recharts.Dot {...props} fill={fill} stroke="white" />;
                    }}
                    stroke="black"
                    type="linear"
                  />
                  <Recharts.Tooltip
                    content={(props) => {
                      const date = _.get(props, 'payload[0].payload.date');
                      const value = _.get(props, 'payload[0].payload.value');
                      const index = data.findIndex((d) => d.date === date);
                      const prevValue = _.get(data, `[${index - 1}].value`);
                      let accent = 'gray';
                      let changeIndicator;

                      if (prevValue && prevValue !== value) {
                        if (value - prevValue > 0) {
                          accent = 'green';
                          changeIndicator = <ArrowDropUp color="green" />;
                        } else {
                          accent = 'red';
                          changeIndicator = <ArrowDropDown color="red" />;
                        }
                      }

                      return (
                        <div className={styles.Tooltip}>
                          <Panel accent={accent}>
                            <div>
                              <strong>{item}</strong>
                            </div>
                            <div>
                              {value} {changeIndicator}
                            </div>
                            <div>
                              Health Score
                            </div>
                            <div>
                              <strong>Date:</strong> {date}
                            </div>
                          </Panel>
                        </div>
                      );
                    }}
                  />
                </Recharts.LineChart>
              </Recharts.ResponsiveContainer>,

              //
              data[data.length - 1].value,

              //
              <React.Fragment>
                {Math.round(Math.random()) ? <ArrowDropDown color="red" /> : <ArrowDropUp color="green" />} {percentChange}
              </React.Fragment>
            ]}
            rows={data}

            // Need to paginate due to large number of facets (e.g. sending domains, etc.)
            // Will we only download the current page or the whole dataset?
            defaultPerPage={5}
            pagination
          />
        </div>
      </Panel>
    );
  }
}

export default HealthScorePanel;
