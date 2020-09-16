import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendToken } from '../../actions/auth';

const VerificationMessage = ({ isVerified }) => {
    if (!isVerified) {
        sendToken({ email });
        return (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                {`${alert.msg} A verification token has been sent to your email.`}
            </div>
        )
    }
}

VerificationMessage.propTypes = {
    isVerified: PropTypes.bool,
    sendToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isVerified: state.auth.isVerified
});

export default connect(mapStateToProps, {sendToken})(VerificationMessage);
