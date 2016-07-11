import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';
import {expandToggle} from './Actions';
import globals from '../../Globals';

const Home = ({customServices, home, dispatch, credentials}) => {
  const styles = require('./Home.scss');
  const step1 = require('./step1-fs8.png');
  const step2 = require('./step2-fs8.png');
  const step3 = require('./step3-fs8.png');
  const step4 = require('./step4-fs8.png');

  const projectName = (globals.namespace === 'default') ? globals.projectDomain.split('.')[0] : globals.namespace;
  const expanded = ' ' + styles.expanded;
  return (
    <div className={styles.home + ' container-fluid'}>
      <Helmet title={projectName + ' console | Hasura'} />
      <div className="col-md-8">
        <div className="container-fluid">
          <div className="row">
            <h3>Project Info</h3>
            <h5>Name: <span className={styles.projectName}>{projectName}</span></h5>
            <h5>Your admin token: <span className={styles.projectName}>{credentials.auth_token}</span></h5>
          </div>
        </div>
        <hr/>
        <h3> Services running </h3>
        <div className="container-fluid">
          <div className="row">
            <div className={styles.box}>
              <div className="container-fluid">
                <div className="row">
                  <h5 className="text-center">
                    <i title="Data" className="fa fa-database" aria-hidden="true"></i>&nbsp;
                    Data
                  </h5>
                </div>
                <br/>
                <div className={styles.boxFooter + ' row'}>
                  <div className="col-md-6 text-left">
                    <Link to="/data/manage">Status</Link>
                  </div>
                  <div className="col-md-6 text-right">
                    <Link to="/data/schema">Schema</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.box}>
              <div className="container-fluid">
                <div className="row">
                  <h5 className="text-center">
                    <i title="Auth" className="fa fa-users" aria-hidden="true"></i>&nbsp;
                    Auth
                  </h5>
                </div>
                <br/>
                <div className={styles.boxFooter + ' row'}>
                  <div className="col-md-6 text-left">
                    <Link to="/auth/manage">Status</Link>
                  </div>
                  <div className="col-md-6 text-right">
                    <Link to="/auth/manage">Browse</Link>
                  </div>
                </div>
              </div>
            </div>
            {customServices.map((cs, i) => {
              return (
                <div key={i} className={styles.box}>
                  <div className="container-fluid">
                    <div className="row">
                      <h5 className="text-center">
                        {cs.metadata.name}
                      </h5>
                    </div>
                    <br/>
                    <div className={styles.boxFooter + ' row'}>
                      <div className="col-md-6 text-left">
                        <Link to={'/custom/' + cs.metadata.name + '/manage'}>Status</Link>
                      </div>
                      <div className="col-md-6 text-right">
                        <Link to={'/custom/' + cs.metadata.name + '/configure'}>Configure</Link>
                      </div>
                    </div>
                  </div>
                </div>);
            })}
          </div>
        </div>
        <hr/>
        <h3> Feedback & Support </h3>
        <div className="container-fluid">
          To ask questions and drop any feedback please join the <a href="https://slack.hasura.io" target="_blank">slack channel</a> or file issues on the github <a href="https://github.com/hasura/support/issues" target="_blank">support repo</a>.
        </div>
        <hr/>
        <h3>5 min quick-start</h3>
        <p>
          Read the <a href="https://hasura.io/blog/building-and-deploying-todo-app-2-mins/" target="_blank">blog-post</a> or watch the video <a target="_blank" href="https://youtu.be/PO3-2DKrBuc">video</a> to see a live demo of going through
          the steps below.
        </p>
        <div className={styles.accordion + (home.step1 ? expanded : '') + ' container-fluid'} onClick={() => {
          dispatch(expandToggle('step1'));
        }}>
          <h5>Step 1: Create a table</h5>
          <img className="img-responsive" src={step1} />
        </div>
        <hr/>
        <div className={styles.accordion + (home.step2 ? expanded : '') + ' container-fluid'} onClick={() => {
          dispatch(expandToggle('step2'));
        }}>
          <h5>Step 2: Add permissions</h5>
          <img className="img-responsive" src={step2} />
        </div>
        <hr/>
        <div className={styles.accordion + (home.step3 ? expanded : '') + ' container-fluid'} onClick={() => {
          dispatch(expandToggle('step3'));
        }}>
          <h5>Step 3: Add the UI</h5>
          <img className="img-responsive" src={step3} />
        </div>
        <hr/>
        <div className={styles.accordion + (home.step4 ? expanded : '') + ' container-fluid'} onClick={() => {
          dispatch(expandToggle('step4'));
        }}>
          <h5>Step 4: And done...</h5>
          <img className="img-responsive" src={step4} />
        </div>
        <hr/>
      </div>
      <div className="clearfix"></div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {...state.main, home: {...state.home}, credentials: state.loginState.credentials};
};

export default connect(mapStateToProps)(Home);
