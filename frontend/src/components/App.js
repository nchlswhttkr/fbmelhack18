import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  AppBar,
  Toolbar,
  Collapse
} from 'material-ui'
import {
  ModeEdit as EditIcon,
  Add as AddIcon,
  ArrowDropDown as DownArrowIcon,
  ArrowDropUp as UpArrowIcon
} from '@material-ui/icons'

import { getItems } from '../ducks/items'
import ItemEditor from './ItemEditor'
import ItemCreator from './ItemCreator'

const styles = theme => ({
  header: {
    color: theme.palette.common.white
  },
  title: { flex: 1 },
  page: {
    width: '70%',
    minWidth: 256,
    margin: '96px auto 0'
  },
  nestedItem: {
    paddingLeft: 4 * theme.spacing.unit
  }
})

class App extends Component {
  state = {
    currentItemIndex: -1,
    isItemEditorOpen: false,
    isItemCreatorOpen: false,
    isDropdownOpenForIndex: []
  }

  openItemEditorWithIndex = i =>
    this.setState({ currentItemIndex: i, isItemEditorOpen: true })

  closeItemEditor = () => {
    this.setState({ isItemEditorOpen: false })
    this.props.getItems()
  }

  openItemCreator = () => this.setState({ isItemCreatorOpen: true })

  closeItemCreator = () => {
    this.setState({ isItemCreatorOpen: false })
    this.props.getItems()
  }

  toggleDropdownByIndex = i => {
    const toggleState = !this.state.isDropdownOpenForIndex[i]
    this.setState({
      isDropdownOpenForIndex: this.state.isDropdownOpenForIndex.fill(
        toggleState,
        i,
        i + 1
      )
    })
  }

  componentDidMount = () => {
    this.props.getItems()
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const lengthDiff =
      nextProps.items.payload.length - prevState.isDropdownOpenForIndex.length
    console.log(lengthDiff, prevState.isDropdownOpenForIndex)
    if (lengthDiff === 0) {
      return null
    } else {
      // extend the array with false values (closed dropdowns)
      return {
        isDropdownOpenForIndex: [
          ...prevState.isDropdownOpenForIndex,
          ...Array(lengthDiff).fill(false)
        ]
      }
    }
  }

  render() {
    const { items, classes } = this.props
    const {
      isItemEditorOpen,
      currentItemIndex,
      isItemCreatorOpen,
      isDropdownOpenForIndex
    } = this.state
    return (
      <div>
        <AppBar classes={{ root: classes.header }}>
          <Toolbar>
            <Typography
              color="inherit"
              variant="headline"
              classes={{ root: classes.title }}
            >
              Hello World!
            </Typography>
            <IconButton color="inherit" onClick={this.openItemCreator}>
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Paper classes={{ root: classes.page }}>
          <List>
            {items.payload.map((item, i) => (
              <div key={i}>
                <ListItem>
                  <ListItemText
                    primary={item.title}
                    secondary={item.end_date}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.openItemEditorWithIndex(i)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => this.toggleDropdownByIndex(i)}>
                      {isDropdownOpenForIndex[i] ? (
                        <UpArrowIcon />
                      ) : (
                        <DownArrowIcon />
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={isDropdownOpenForIndex[i]}>
                  <List>
                    <ListItem classes={{ root: classes.nestedItem }}>
                      <ListItemText>
                        {`This is an '${item.type}' item, running until ${
                          item.end_date
                        }`}
                        <br />
                        {`${item.message}`}
                        <br />
                        {`${item.event_url}`}
                      </ListItemText>
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
          <ItemEditor
            open={isItemEditorOpen}
            onClose={this.closeItemEditor}
            index={currentItemIndex}
          />
          <ItemCreator
            open={isItemCreatorOpen}
            onClose={this.closeItemCreator}
          />
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = ({ items }) => ({
  items
})

const mapDispatchToProps = { getItems }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(App)
)
