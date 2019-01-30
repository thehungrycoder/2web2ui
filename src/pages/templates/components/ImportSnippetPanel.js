import React from 'react';
import { Button, Label, Panel } from '@sparkpost/matchbox';
import CopyField from 'src/components/copyField';
import ExternalLink from 'src/components/externalLink';
import PageLink from 'src/components/pageLink';
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
            disabled={snippets.length === 0}
            helpText={
              snippets.length === 0 ? (
                <span>
                   You have not created a snippet. {
                    <PageLink to="/snippets/create">Create your first snippet</PageLink>
                  }
                </span>
              ) : ''
            }
            itemToString={(snippet) => (
              snippet ? `${snippet.name || slugToFriendly(snippet.id)} (${snippet.id})` : ''
            )}
            label="Snippet"
            name="snippetTypeahead"
            onChange={this.handleChange}
            placeholder={snippets.length === 0 ? '' : 'Type to search...'}
            renderItem={({ id, name }) => (
              <TypeaheadItem id={id} label={name || slugToFriendly(id)} />
            )}
            results={snippets}
          />
          <Label>Snippet Code</Label>
          <CopyField
            value={`{{ render_snippet( "${this.state.snippetId || 'example-id'}" ) }}`}
          />
        </Panel.Section>
        <Panel.Section>
          <Button primary onClick={onClose}>Done</Button>
        </Panel.Section>
      </Panel>
    );
  }
}
