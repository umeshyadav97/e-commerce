import React from 'react';
import HeroSection from './components/HeroSection';
import Filters from './components/Filters'
import { connect } from "react-redux";

const Dashboard = (props) => {
  const isLoggedIn = props.isAuthenticated;
  return (
    <React.Fragment>
      {!isLoggedIn && <HeroSection props={props} />}
      <Filters/>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});
export default connect(mapStateToProps, null)(Dashboard);

