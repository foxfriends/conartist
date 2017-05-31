'use strict';
import * as React from 'react';
import { List, ListItem, Paper, FlatButton, Card, CardHeader, CardActions, CardMedia } from 'material-ui';
import * as Moment from 'moment';

import { ConData, Con } from '../../../types';

import './con-list.scss';

type Props = {
  cons: ConData;
};
type State = {
  con: Con | null;
};

export default class ConList extends React.Component<Props, State> {
  state: State = { con: null };

  private showInfo(con: Con | null = null): void {
    this.setState({ con });
  }

  render() {
    const cons = this.props.cons.cons.sort(({ start: a }, { start: b }) => b - a);
    return (
      <div>
        <List>
          { cons.map(con =>
            <ListItem
              key={con.code}
              primaryText={con.title}
              secondaryText={`${Moment(con.start).format('MMM d, YYYY')} - ${Moment(con.end).format('MMM d, YYYY')}`}
              onTouchTap={() => this.showInfo(con)}>
            </ListItem>
          ) }
        </List>
        <div className={`backdrop backdrop--${this.state.con ? 'visible' : 'hidden'}`} onClick={() => this.showInfo()}>
          <Paper className={`overlay overlay--${this.state.con ? 'visible' : 'hidden'}`}>
            { !this.state.con ? null :
              <Card>
                <CardHeader
                  title={this.state.con.title}
                  subtitle={`${Moment(this.state.con.start).format('MMM d, YYYY')} - ${Moment(this.state.con.end).format('MMM d, YYYY')}`} />
                <CardMedia>
                  {
                    // TODO: put some info here
                  }
                </CardMedia>
                <CardActions>
                  <FlatButton onTouchTap={() => this.showInfo()}>
                    Close
                  </FlatButton>
                </CardActions>
              </Card>
            }
          </Paper>
        </div>
      </div>
    );
  }
}
