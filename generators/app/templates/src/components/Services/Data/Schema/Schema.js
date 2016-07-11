/* global d3 */
/* eslint-disable space-infix-ops */
/* eslint-disable no-loop-func  */

import React from 'react';
import { connect } from 'react-redux';
import d3Wrap from 'react-d3-wrap';
import Helmet from 'react-helmet';

const Chart = d3Wrap({
  update(svg, schema, options) { // eslint-disable-line no-unused-vars
    // Optional initialize method called once when component mounts
  },

  initialize(svg, [root], options) { // The main svg element where stuff will happen

    const {treeName, widthC, heightC} = options.data;
    const classTreeName = `.${treeName}`;

    const diagonal = d3.svg.diagonal()
      .projection((d) => ([d.y, d.x])); // Normal tidy tree

    const zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 10]);

    const vis = d3.select(svg)
      .attr('width', widthC)
      .attr('height', heightC)
      .append('g')
      .call(zoom);

    const rect = vis.append('rect')
      .attr('width', widthC)
      .attr('height', heightC)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    const svgDgm = vis.append('g')
      .attr('class', treeName)
      .attr('transform', 'translate('+root.name.length*8 + ',0)');

    const tree = d3.layout.tree()
      .size([heightC, widthC]); // height, width

    const duration = 0.1;
    const expandedNodes = [];

    const addTableDetails = (data, node) => { // eslint-disable-line no-unused-vars
      let width = data.name.length*8;
      const container = d3.select(classTreeName)
        .append('g')
        .attr('class', 'table-details')
        .attr('transform', 'translate('+ (data.y + (-1)*width/2) + ',' + (-20 + data.x) + ')');

      data.expandedDetails = container;
      expandedNodes.push(data);

      const height = 30;
      const names = data.table.columns.map((c) => (c.name.length + c.type.length));
      names.push(data.name.length);
      width = d3.max(names)*8 + 9;

      /* Add heading */
      let colContainer = container.append('g')
        .attr('class', 'col-container col-heading');

      colContainer.append('rect')
        .attr('class', 'col-rect')
        .attr('height', height)
        .attr('width', width);

      colContainer.append('text')
        .attr('class', 'col-text')
        .attr('x', 9)
        .attr('y', height)
        .attr('dy', (-1*(height-12)/2))
        .text(data.name);

      colContainer = container.append('g')
        .attr('class', 'col-container col-actions')
        .attr('transform', 'translate(0,'+(-1 * height)+')');

      colContainer.append('rect')
        .attr('class', 'col-rect')
        .attr('height', height)
        .attr('width', width);

      colContainer.append('text')
        .attr('class', 'col-text')
        .attr('x', 9)
        .attr('y', height)
        .attr('dy', (-1*(height-12)/2))
        .text('Close')
        .on('click', () => {
          const i = expandedNodes.findIndex((d) => (d.id === data.id));
          expandedNodes.splice(i, 1);
          data.expandedDetails.remove();
          data.expandedDetails = null;
        });

      data.table.columns.forEach((col, i) => {
        const _colContainer = container.append('g')
          .attr('class', 'col-container')
          .attr('transform', 'translate(0,'+(i+1)*height+')');

        _colContainer.append('rect')
          .attr('class', 'col-rect')
          .attr('height', height)
          .attr('width', width);

        _colContainer.append('text')
          .attr('class', 'col-text')
          .attr('x', 9)
          .attr('y', height)
          .attr('dy', (-1*(height-12)/2))
          .text(col.name + ' (' + col.type+')');
      });
    };

    const addRelDetails = (data, node) => { // eslint-disable-line no-unused-vars
      let width = data.name.length*8;
      const container = d3.select(classTreeName)
        .append('g')
          .attr('class', 'table-details rel-details')
          .attr('transform', 'translate('+ (data.y + (-1)*width/2) + ',' + (-20+ data.x) + ')');

      data.expandedDetails = container;
      expandedNodes.push(data);

      const rel = data.relData;
      const typeLabel = rel.type === 'arr_rel' ? 'array': 'object';

      let description = data.parent.name + '.' + data.name + ' = ';
      if (rel.type === 'arr_rel') {
        description = (description + '[...' + rel.rtable + ']');
      } else {
        description = (description + '{' + rel.rtable + '}');
      }

      const fkLabel = 'Via foreign-key: \u00A0';

      let fkDescription = '  ';
      if (rel.type === 'arr_rel') {
        fkDescription = fkDescription + rel.rtable + '.' + rel.rcol + ' → ' + data.parent.name + '.' + rel.lcol;
      } else {
        fkDescription = fkDescription + data.parent.name + '.' + rel.lcol + ' → ' + rel.rtable + '.' + rel.rcol;
      }

      const labels = [
        {label: '', description: description},
        {label: fkLabel, description: fkDescription}
      ];
      const labelLengths = labels.map((l) => (l.label.length + l.description.length + 2));
      labelLengths.push(data.name + ' ' + typeLabel);

      const height = 30;
      width = d3.max(labelLengths)*8 + 9;

      /* Add heading */
      let colContainer = container.append('g')
        .attr('class', 'col-container col-heading');

      colContainer.append('rect')
        .attr('class', 'col-rect')
        .attr('height', height)
        .attr('width', width);

      colContainer
        .append('text')
          .attr('class', 'col-text')
          .attr('x', 9)
          .attr('y', height)
          .attr('dy', (-1*(height-12)/2))
          .text(data.name)
          .append('tspan')
            .text(' (' + typeLabel + ' relationship)');

      /* Add actions */
      colContainer = container.append('g')
        .attr('class', 'col-container col-actions')
        .attr('transform', 'translate(0,'+(-1 * height)+')');

      colContainer.append('rect')
        .attr('class', 'col-rect')
        .attr('height', height)
        .attr('width', width);

      colContainer.append('text')
        .attr('class', 'col-text')
        .attr('x', 9)
        .attr('y', height)
        .attr('dy', (-1*(height-12)/2))
        .text('Close')
        .on('click', () => {
          const i = expandedNodes.findIndex((d) => (d.id === data.id));
          expandedNodes.splice(i, 1);
          data.expandedDetails.remove();
          data.expandedDetails = null;
        });

      labels.forEach((cur, i) => {
        const _colContainer = container.append('g')
          .attr('class', 'col-container')
          .attr('transform', 'translate(0,'+(i+1)*height+')');

        _colContainer.append('rect')
          .attr('class', 'col-rect')
          .attr('height', height)
          .attr('width', width);

        _colContainer.append('text')
          .attr('class', 'col-text')
          .attr('x', 9)
          .attr('y', height)
          .attr('dy', (-1*(height-12)/2))
          .text(cur.label)
          .append('tspan')
            .text(cur.description);
      });
    };

    const updateTree = (linkLength, width, height) => {
      rect.transition()
        .duration(duration)
        .attr('width', width)
        .attr('height', height);

      tree.size([height, width]);
      const _nodes = tree.nodes(root);
      const _links = tree.links(_nodes);

      let _i = 0;
      _nodes.forEach((d) => { d.y = d.depth*linkLength; d.id = ++_i; });

      /* Link stuff ----------------------- */
      const link = svgDgm.selectAll('.link')
        .data(_links, (d) => (d.target.id));

      link.enter().append('path')
        .attr('class', 'link')
        .attr('d', diagonal);

      link.transition().duration(duration)
        .attr('d', diagonal);

      /* Node stuff ----------------------- */
      const node = svgDgm.selectAll('.node')
        .data(_nodes, (d) => (d.id));

      const nodeEnter = node
        .enter().append('g')
        .attr('class', (d) => ('node' +
            (d.children ? ' node--internal' : ' node--leaf') +
            (d.type === 'rel' ? ' rel-node' : '')))
        .attr('transform', (d) => ('translate(' + d.y + ',' + d.x + ')'));

      const nodeRectG = nodeEnter.append('g')
        .attr('transform', (d) => {
          const _width = d.name.length * 8;
          return 'translate('+ (-1)*_width/2 + ', -10)';
        })
        .on('click', (d) => {
          if (d.type === 'rel') {
            addRelDetails(d);
          } else {
            addTableDetails(d);
          }
        });

      nodeRectG.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', (d) => (d.name.length * 8))
        .attr('height', 20)
        .style('opacity', (d) => (d.visited ? 0.7 : 1));

      nodeRectG.append('polygon')
        .attr('points', '0,0 0,20 15,10')
        .attr('transform', (d) => {
          const _width = d.name.length * 8;
          return 'translate(' + _width + ',0)';
        });

      nodeEnter.append('text')
        .style('text-anchor', 'middle')
        .attr('dy', 4)
        .text((d) => {
          if (d.type === 'rel') {
            if (d.relData.type === 'arr_rel') {
              return '['+d.name +']';
            }
            return '{'+d.name +'}';
          }
          return d.name;
        })
        .style('opacity', (d) => (d.visited ? 0.7 : 1));

      node.transition() // node update
        .duration(duration)
        .attr('transform', (d) => ('translate(' + d.y + ',' + d.x + ')'));

      expandedNodes.forEach((e) => {
        const _width = e.name.length*8;
        e.expandedDetails
          .attr('transform', 'translate('+ (e.y + (-1)*_width/2) + ',' + (-20+ e.x) + ')');
      });
    };

    updateTree(100, widthC, heightC);

    /* Zoom and drag stuff */
    const zoomed = () => { // Function that executes on zoom
      svgDgm.attr('transform', 'translate(' + d3.event.translate + ')');
      updateTree(100*d3.event.scale, widthC*d3.event.scale, heightC*d3.event.scale);
    };

    zoom.on('zoom', zoomed);

    zoom.translate([root.name.length*8, 0]);
  },

  destroy() {
    // Optional clean up when a component is being unmounted...
  }
});

const Schema = ({schema}) => { // eslint-disable-line no-unused-vars
  require('./Schema.scss');

  // Parition the schema
  const nodes = JSON.parse(JSON.stringify(schema));

  // nodes are sorted by number of connections
  nodes.sort((n1, n2) => {
    if (n1.relationships.length < n2.relationships.length) {
      return -1;
    }
    if (n1.relationships.length > n2.relationships.length) {
      return 1;
    }
    // If equal then sort alphabetically
    if (n1.name < n2.name) { return 1; }
    if (n1.name > n2.name) { return -1; }

    return 0;
  });

  const nodeMap = nodes.reduce((acc, curNode) => {
    acc[curNode.name] = curNode;
    return acc;
  }, {});

  const visitedNodes = [];
  const roots = [];

  while (nodes.length > 0) {
    // Pop an element from nodes and process it if it hasn't been visited yet
    const curNode = nodes.pop();
    const ind = visitedNodes.findIndex((n) => (n === curNode.name));
    if (ind > 0) {
      continue;
    }

    // Start breadth-firsting it
    const newRoot = {};
    newRoot.name = curNode.name;
    newRoot.parent = null;
    newRoot.table = nodeMap[curNode.name];
    newRoot.treeHeight = 0;
    let maxHeight = 0;
    const queue = [];
    let next = newRoot;

    while (next) {
      const isNotVisited = (visitedNodes.findIndex((n) => (n === next.name))) < 0 ? true : false;

      if (isNotVisited) {
        visitedNodes.push(next.name);
        next.children = [];
        nodeMap[next.name].relationships.forEach((r, j) => {
          if (maxHeight < (next.treeHeight + 1)) { (maxHeight = next.treeHeight + 1); }
          const i = visitedNodes.findIndex((n) => (n === r.rtable));
          if ( i >= 0) { // If already visited
            next.children.push({name: r.name, relData: r, type: 'rel',
              children: [{name: r.rtable, table: nodeMap[r.rtable], relname: r.name, visited: true, treeHeight: (next.treeHeight + 1)}] });
            return;
          }
          // If not visited add to the queue
          next.children.push({name: r.name, relData: r, type: 'rel',
            children: [{name: r.rtable, table: nodeMap[r.rtable], relname: r.name, treeHeight: (next.treeHeight + 1)}] });
          queue.push(next.children[j].children[0]);
        });
      }
      next = queue.shift();
    }
    newRoot.maxHeight = maxHeight;
    roots.push(newRoot);
  }

  // Get all the single element nodes
  const singles = [];
  const trees = [];
  roots.map(r => {
    if (r.children && r.children.length) {
      const treeData = {};
      treeData.root = r;
      treeData.width = 900; // (r.maxHeight * 300 > 1000) ? 1000 : (r.maxHeight * 300);
      const adjHeight = r.children.length * 100;
      if (adjHeight > 700) {
        treeData.height = 700;
      } else if (adjHeight < 400) {
        treeData.height = 450;
      } else {
        treeData.height = adjHeight;
      }
      trees.push(treeData);
    } else {
      const treeData = {};
      treeData.root = r;
      treeData.width = 300;
      treeData.height= 450;
      singles.push(treeData);
    }
  });

  let relationships = 0;
  schema.map(t => (relationships = relationships + t.relationships.length));
  return (
    <div className="container-fluid">
      <Helmet title="Schema - Data | Hasura" />
      <div>
        <h2> Schema </h2>
      </div>
      <div>
        There are <b>{schema.length}</b> tables in this schema, with <b>{relationships}</b> relationships.
      </div>
      <br/>
      <hr/>
      {singles.map((t, i) => {
        console.log(t);
        return (<Chart data={[t.root]} width={t.width} key={i} height={t.height}
                  options={{color: '#ff0000', data: {widthC: t.width, heightC: t.height, treeName: `tree${i}`}}} />);
      })}
      <br/>
      {trees.map((t, i) => {
        console.log(t);
        return (<Chart data={[t.root]} width={t.width} key={i*100} height={t.height}
                  options={{color: '#ff0000', data: {widthC: t.width, heightC: t.height, treeName: `tree${i+100}`}}} />);
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    schema: state.tables.allSchemas
  };
};

export default connect(mapStateToProps)(Schema);
