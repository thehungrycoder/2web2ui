import React, { Component } from 'react';
import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
const MAX_ERROR_DETAILS = 25;

export class ErrorBanner extends Component {
  renderErrorDetails() {
    const parseError = this.props.parseError || {}; // ugh, null
    const persistError = this.props.persistError || {}; // ugh, null

    if (parseError.details) {
      return (
        <ul>
          {parseError.details.slice(0, MAX_ERROR_DETAILS).map((detail, index) =>
            <li key={index}>
              {detail.row !== undefined
                ? `On line ${detail.row + 1}, ${detail.message.toLowerCase()}.`
                : detail.message}
            </li>
          )}
          {parseError.details.length > MAX_ERROR_DETAILS && (
            <li key={MAX_ERROR_DETAILS}>And more...</li>
          )}
        </ul>
      );
    }

    return parseError.message || persistError.message;
  }

  render() {
    return (
      <ApiErrorBanner
        errorDetails={this.renderErrorDetails()}
        message="Unable to add recipients to your suppression list"
        status="danger"
      />
    );
  }

}
