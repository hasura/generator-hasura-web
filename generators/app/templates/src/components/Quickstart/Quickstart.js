import React from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
// import {Link} from 'react-router';

const Quickstart = ({}) => {
  // const baseUrl = '/p/' + projectName + '/';
  return (
    <div className="container-fluid">
      <Helmet title={'ToDo app backend | Quickstart :: Hasura'} />
      <div className="col-md-8">
        <h3>A ToDo App Backend (a.k.a The Quintessential Quickstart)</h3>
        <hr/>
        <p>
          Let's make an API backend for a Todo app.
          <br/><br/>
        </p>
        <hr/>
        <h4>Introduction</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/v1y5TZEfR9k"
          frameBorder="0"
          allowFullScreen>
        </iframe>
        <hr/>
        <h4>Creating users</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/JcCPR5Umw8c"
          frameBorder="0"
          allowFullScreen>
        </iframe>
        <hr/>
        <h4>Creating the database</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/9e3M7rC9RwE"
          frameBorder="0"
          allowFullScreen>
        </iframe>
        <hr/>
        <h4>Data Integrity and default values</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/gTc4xEK2Gsw"
          frameBorder="0"
          allowFullScreen>
        </iframe>
        <hr/>
        <h4>Adding relationships</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/IGnH56gZ8MI"
          frameBorder="0"
          allowFullScreen>
        </iframe>
        <hr/>
        <h4>Adding permissions</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/UxjaHBk9BUM"
          frameBorder="0"
          allowFullScreen>
        </iframe>
      </div>
      <div className="clearfix"></div>
    </div>
  );
};

export default connect()(Quickstart);
