import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem
} from 'material-ui'

import { createItem } from '../utils/api'

const styles = theme => ({
  root: {
    width: '100%' // forces paper to fill entire dialog block
  }
})

class ItemEditor extends Component {
  state = { item: undefined }

  handleCreateAndClose = async () => {
    await createItem(this.state.item)
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
        <DialogTitle>Create Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the item details and save!
          </DialogContentText>
          <TextField
            label="title"
            onChange={this.handleUpdate('title')}
            value={item && item.title ? item.title : ''}
            error={item && !item.title}
            fullWidth
            required
          />
          <TextField
            label="message"
            onChange={this.handleUpdate('message')}
            value={item && item.message ? item.message : ''}
            fullWidth
            required
          />
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              value={item && item.type ? item.type : ''}
              onChange={this.handleUpdate('type')}
              fullWidth
            >
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="recurring">Recurring</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button
            onClick={this.handleCreateAndClose}
            disabled={!(item && item.title && item.message && item.type)}
          >
            Create Item
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ItemEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default withStyles(styles)(ItemEditor)
