import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from 'material-ui'

import { updateItem } from '../utils/api'

const styles = theme => ({
  root: {
    width: '100%' // forces paper to fill entire dialog block
  }
})

class ItemEditor extends Component {
  state = { item: {}, index: -1 }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.index === prevState.index) {
      return null
    } else {
      return {
        item: nextProps.items.payload[nextProps.index],
        index: nextProps.index
      }
    }
  }

  handleSaveAndClose = () => {
    updateItem(this.state.item)
    this.props.onClose()
  }

  handleUpdate = attribute => event => {
    this.setState({
      item: { ...this.state.item, [attribute]: event.target.value }
    })
  }
  render = () => {
    const { item } = this.state
    const { open, onClose, classes } = this.props
    return (
      <Dialog open={open} onClose={onClose} classes={{ paper: classes.root }}>
        <DialogTitle>{item ? `Edit '${item.title}'` : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the item details and save!
          </DialogContentText>
          <TextField
            label="title"
            onChange={this.handleUpdate('title')}
            value={item ? item.title : ''}
            fullWidth
          />
          <TextField
            label="message"
            onChange={this.handleUpdate('message')}
            value={item ? item.message : ''}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSaveAndClose}>Save And Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = ({ items }) => ({
  items
})

ItemEditor.propTypes = {
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(ItemEditor))
