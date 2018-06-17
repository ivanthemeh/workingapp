import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import NewScheduleForm from './NewScheduleForm';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    modal: {
        top: '20px',
        bottom: '20px',
        left: '20%',
        width: '60%',
        overflow: 'auto'
    },
    datePicker: {
        width: '50%'
    },
    timePicker: {
        width: '50%'
    }
});

class NewScheduleModal extends Component {
    state = {
        open: this.props.open,
        selectedDate: new Date(),
    };

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            open: nextProps.open
        })
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.props.closeModal();
    };
    // TODO: change to form component TODO:
    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
    }    
    render() {
        const { classes } = this.props;
        return (
            <div>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open}
                        onClose={this.handleClose}
                        className={classes.modal} 
                    >
                        <div className={classes.paper}>
                            <Typography variant="title" id="modal-title">
                                Text in a modal
                            </Typography>
                        <NewScheduleForm />
                        </div>
                    </Modal>
            </div>
        );
    }
}

NewScheduleModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewScheduleModal);