import React from 'react'
import PropTypes from 'prop-types'
import Debug from 'debug'
import { RIEInput } from 'riek'
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown'

import Loop from '../loop'
import * as Model from '../model'
import HashForm from './hash-form'
import Share from './share'
import Settings from './settings'

const log = Debug('pushpin:title-bar')

export default class TitleBar extends React.PureComponent {
  static propTypes = {
    formDocId: PropTypes.string.isRequired,
    // activeDocId: PropTypes.string.isRequired,
    requestedDocId: PropTypes.string.isRequired,
    board: PropTypes.shape({
      title: PropTypes.string.isRequired
    }),
    self: PropTypes.shape({ 
      name: PropTypes.string.isRequired
    })
  }

  constructor(props) {
    super(props)
    log('constructor')

    this.onChange = this.onChangeTitle.bind(this)
    this.onSubmit = this.onChangeBoardBackgroundColor.bind(this)
  }

  onChangeTitle(newState) {
    log('onChangeTitle')
    Loop.dispatch(Model.setTitle, newState)
  }

  onChangeBoardBackgroundColor(color) {
    log('onChangeBoardBackgroundColor')
    Loop.dispatch(Model.setBackgroundColor, { backgroundColor: color.hex })
  }

  onSubmit(e) {
    log('onSubmit')
    e.preventDefault()
  }

  render() {
    log('render')

    /*
    const shareData = {
      authors: {
        1: { name: 'Roshan', avatar: '../img/avatar-example.png' },
        2: { name: 'Peter' }
      },
      board: this.props.board,
      contacts: {
        3: { name: 'Mark' },
        4: { name: 'Ignatius' }
      },
      notifications: {
        A: { type: 'Invitation', sender: { name: 'Pvh' }, board: { title: 'Pushpin Demo' } },
        B: { type: 'Invitation', sender: { name: 'Ignatius' }, board: { title: 'Pokemon research' } }
      }
    }
    */

    const { state } = this.props

    const notifications = []
    state.workspace.offeredIds.forEach(offer => {
      const contact = state.contacts[offer.offererId]

      if(state.offeredDocs && state.offeredDocs[offer.offeredId]) {
        const board = state.offeredDocs[offer.offeredId]
        notifications.push({ type: "Invitation", sender: contact, board: board })
      }
    })

    let shareData = {
      authors: {},
      board: this.props.board,
      contacts: state.contacts || {},
      notifications: notifications
    }

    // remember to exclude yourself from the authors list (maybe?)
    if (state.board && state.board.authors) {
      shareData = { ...shareData,
        authors: state.board.authors.map((a) =>
          (state.contacts && state.contacts[a] ? state.contacts[a] : { name: 'ErrNo' })), }
    }

    // This line totally doesn't work but is directionally correct.
    /*
    if (state.workspace && state.workspace.offeredIds) {
      shareData.notifications = { ...state.workspace.offeredIds.map((offer, idx) => ([idx,
        { type: 'Invitation',
          sender: {
            name: state.contacts && state.contacts[offer.offerrerId] ?
              state.contacts[offer.offererId].name : offer.offererId
          },
          board: {
            title: state.boards && state.boards[offer.offeredId] ?
              state.boards[offer.offeredId].title : 'Title Not Loaded',
            docId: state.boards && state.boards[offer.offeredId] ?
              state.boards[offer.offeredId].docId : offer.offeredId
          }
        }])) }
    }
    */

    return (
      <div className="TitleBar">
        <img
          className="TitleBar__logo"
          alt="pushpin logo"
          src="pushpinIcon_Standalone.svg"
          width="28"
          height="28"
        />

        <RIEInput
          value={this.props.board.title}
          change={this.onChangeTitle}
          propName="title"
          className="TitleBar__titleText"
          classLoading="TitleBar__titleText--loading"
          classInvalid="TitleBar__titleText--invalid"
        />

        <HashForm
          formDocId={this.props.formDocId}
          // activeDocId={this.props.activeDocId}
          requestedDocId={this.props.requestedDocId}
        />

        <Dropdown>
          <DropdownTrigger>
            <div className="TitleBar__dropDown">
              <i className="fa fa-group" />
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <Share {...shareData} />
          </DropdownContent>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <div className="TitleBar__dropDown">
              <i className="fa fa-gear" />
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <Settings name={"Roshan"} />
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }
}
