import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TableCollection, ApiErrorBanner, Loading, SubaccountTag } from 'src/components';
import { Templates } from 'src/components/images';
import { Page } from '@sparkpost/matchbox';
import Editor from './components/Editor'; // async, for preload

import { format } from 'date-fns';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const primaryAction = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};

export default class ListPage extends Component {

  componentDidMount() {
    this.props.listTemplates();
    Editor.preload(); //loads editor chunk
  }

  renderError() {
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your templates.'}
        errorDetails={this.props.error.message}
        reload={this.props.listTemplates}
      />
    );
  }

  getRowData = ({ published, id, name, last_update_time, subaccount_id, shared_with_subaccounts }) => {
    const row = [
      <Link to={`/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`}>{name}</Link>,
      id,
      published ? 'Published' : 'Draft',
      format(last_update_time, 'MMM D, YYYY [at] h:mma')
    ];

    if (this.props.hasSubaccounts) {
      const tag = subaccount_id || shared_with_subaccounts
        ? <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />
        : null;
      row.push(tag);
    }

    return row;
  }

  getColumns() {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Name', width: '22%', sortKey: 'name' },
      { label: 'ID', width: '22%', sortKey: 'id' },
      { label: 'Status', width: '15%', sortKey: 'published' },
      { label: 'Updated', sortKey: 'last_update_time' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '20%', sortKey: (template) => [template.subaccount_id, template.shared_with_subaccounts]});
    }

    return columns;
  }

  renderCollection() {
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={this.props.templates}
        getRowData={this.getRowData}
        pagination
        filterBox={{
          show: true,
          exampleModifiers: ['id', 'name'],
          itemToStringKeys: ['name', 'id', 'subaccount_id']
        }}
        defaultSortColumn='name'
      />
    );
  }

  render() {
    const { canModify, count, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={canModify ? primaryAction : undefined}
        title='Templates'
        empty={{
          show: count === 0,
          image: Templates,
          title: 'Manage your email templates',
          content: <p>Build, test, preview and send your transmissions.</p>
        }} >
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}
