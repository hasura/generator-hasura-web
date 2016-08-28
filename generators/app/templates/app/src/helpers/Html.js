import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    initialStore: PropTypes.object
  }

  render() {
    const {assets, component, initialStore} = this.props;
    const head = Helmet.rewind();
    const code = `
          window.__insp = window.__insp || [];
          __insp.push(['wid', 897790933]);
          (function() {
            function ldinsp(){if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
            setTimeout(ldinsp, 500); document.readyState != "complete" ? (window.attachEvent ? window.attachEvent('onload', ldinsp) : window.addEventListener('load', ldinsp, false)) : ldinsp();
          })();
    `;
    const inspectlet = (
      <script type="text/javascript" id="inspectletjs" dangerouslySetInnerHTML={{__html: code}}>
      </script>); // eslint-disable no-unused-vars

    return (
      <html lang="en-us">
        <head>
          {/*FIXME: Use helmet properly*/}
          {/*head.base.toComponent()*/}
          {/*head.title.toComponent()*/}
          {/*head.meta.toComponent()*/}
          {/*head.link.toComponent()*/}
          {/*head.script.toComponent()*/}

          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}

          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
          {/* Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{__html: require('../theme/bootstrap.config.js') + require('../containers/App/App.scss')._style}}/> : null */}

          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(initialStore)};`}} charSet="UTF-8"/>
          <script dangerouslySetInnerHTML={{__html:
            `window.__env={ namespace: '${process.env.NAMESPACE}', scheme: '${process.env.SCHEME}', baseDomain: '${process.env.BASE_DOMAIN}' };` }} />
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: component}}/>
          <script src={assets.javascript.main} charSet="UTF-8"/>
        </body>
      </html>
    );
  }
}
