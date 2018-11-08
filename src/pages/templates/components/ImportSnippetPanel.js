import React from 'react';
import { Button, Label, Panel } from '@sparkpost/matchbox';
import CopyField from 'src/components/copyField';
import ExternalLink from 'src/components/externalLink';
import PanelLoading from 'src/components/panelLoading';
import { Typeahead, TypeaheadItem } from 'src/components/typeahead/Typeahead';
import { LINKS } from 'src/constants';
import { slugToFriendly } from 'src/helpers/string';

export default class ImportSnippetPanel extends React.Component {
  state = {
    snippetId: undefined
  }

  componentDidMount() {
    this.props.getSnippets();
  }

  handleChange = (snippet) => {
    const snippetId = !snippet ? undefined : snippet.id;
    this.setState({ snippetId });
  }

  render() {
    const { loading, onClose, snippets } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    return (
      <Panel
        title="Import snippets in this template"
        actions={[{
          component: ExternalLink,
          content: 'Learn More',
          to: LINKS.SNIPPET_SUBSTITUTION_REFERENCE
        }]}
      >
        <Panel.Section>
          <p>
            Find a snippet, copy the code, and paste it in your template.
          </p>
          <Typeahead
            itemToString={({ id, name }) => `${name || slugToFriendly(id)} (${id})`}
            label="Snippet"
            onChange={this.handleChange}
            placeholder="Type to search..."
            renderItem={({ id, name }) => (
              <TypeaheadItem id={id} label={name || slugToFriendly(id)} />
            )}
            results={snippets}
          />
          <Label>Snippet Code</Label>
          <CopyField
            value={`{{ render_snippet('${this.state.snippetId || 'example-id'}') }}`}
          />
        </Panel.Section>
        <Panel.Section>
          <Button primary onClick={onClose}>Done</Button>
        </Panel.Section>
      </Panel>
    );
  }
}
