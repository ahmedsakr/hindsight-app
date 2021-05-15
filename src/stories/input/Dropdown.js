import { makeStyles, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const styles = makeStyles(theme => ({
  dropdown: {
    border: `solid 2px ${theme.palette.secondary.dark}`,
    borderRadius: 6,
    padding: `0px ${theme.spacing(1.5)}px`,
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.background.main,
  },
  dropdownOverride: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.background.light,
  },
  selectIcon: {
    color: theme.palette.secondary.main
  },
}));

/**
 * Reusable dropdown component that controls an option choice from a set
 * of options
 */
const Dropdown = ({ options, selected, onSelect, ...props }) => {
  const classes = styles(props);

  return (
    <Select
      className={classes.dropdown}
      value={selected}
      onChange={onSelect}
      MenuProps={{
        classes: {
          paper: classes.dropdownOverride
        }
      }}
      classes={{
        icon: classes.selectIcon,
      }}
    >
      {options?.map((option, id) => {
        return (
          <MenuItem
            key={id}
            value={option}
          >
            {option}
          </MenuItem>
        )
      })}
    </Select>
  )
}

Dropdown.propTypes = {

  /**
   * The list of options for the dropdown.
   */
  options: PropTypes.array,

  /**
   * The option that is chosen.
   */
  selected: PropTypes.string,
}

Dropdown.defaultProps = {
  options: [ "empty" ],
  selected: "empty"
}

export default Dropdown;