import React, { SyntheticEvent } from 'react';
import { Select, IItemRendererProps, ItemRenderer } from '@blueprintjs/select';
import { Language, getAllLanguages, getLanguageName, getDefaultLanguage } from '../../lib/lang';
import Logger from '../../lib/Logger';
import { Button, MenuItem } from '@blueprintjs/core';
import styles from './LanguageSelect.module.scss';

const SelectControl = Select.ofType<Language>();

export type CallbackItemSelect = (item: Language, event?: SyntheticEvent<HTMLElement>) => void;

interface IProps {
  initialItem: Language;
  onItemSelect: CallbackItemSelect;
}

interface IState {
  currentItem: Language;
}

class LanguageSelect extends React.Component<IProps, IState> {
  private items = getAllLanguages();
  state = {
    currentItem: this.props.initialItem
  };

  componentDidMount() {
    this.setState({ currentItem: this.props.initialItem });
  }

  private onItemSelect: CallbackItemSelect = (item, event) => {
    this.setState({ currentItem: item });
    this.props.onItemSelect(item, event);
  };

  private renderItem: ItemRenderer<Language> = (language, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        className={styles.item}
        active={modifiers.active}
        disabled={modifiers.disabled}
        text={getLanguageName(language)}
        key={language}
        onClick={handleClick}
      />
    );
  };

  getCurrentItem = (): Language => {
    return this.state.currentItem;
  };

  render() {
    return (
      <div className={styles.select}>
        <SelectControl
          itemRenderer={this.renderItem}
          onItemSelect={this.onItemSelect}
          items={this.items}
          filterable={false}
          activeItem={this.state.currentItem}
        >
          <Button
            className={styles.button}
            text={getLanguageName(this.state.currentItem)}
            rightIcon='double-caret-vertical'
          />
        </SelectControl>
      </div>
    );
  }
}

export default LanguageSelect;
